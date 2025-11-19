#include <xc.h>
#include <stdio.h>
#include "FreeRTOS.h"
#include "task.h"
#include "queue.h"
#include "portmacro.h"
#include "semphr.h"
#include "user_app.h"
#define _XTAL_FREQ 8000000UL   // cristal de 8 MHz
#define FCY        4000000UL  // ciclo de instrucao (Fosc/2)
#include <libpic30.h>

// CONFIG2
#pragma config POSCMOD = HS       // HS oscillator mode
#pragma config OSCIOFNC = OFF     // CLKO no RC15 (FOSC/2)
#pragma config FCKSM = CSDCMD     // Clock switching and fail-safe off
#pragma config FNOSC = PRI     // Primary Oscillator with PLL
#pragma config IESO = OFF         // Internal External Switch Over disabled

// CONFIG1
#pragma config WDTPS = PS32768
#pragma config FWPSA = PR128
#pragma config WINDIS = OFF
#pragma config FWDTEN = OFF
#pragma config ICS = PGx2
#pragma config GWRP = OFF
#pragma config GCP = OFF
#pragma config JTAGEN = OFF

#define BTN_PAUSE PORTBbits.RB0
#define BTN_DELAY PORTBbits.RB10

QueueHandle_t xQueueConfig;        // recebe ConfigMsg_t do Task_Menu
QueueHandle_t xQueueVelocidade;    // recebe uint16_t do Task_ADC

// Botao de pausa
SemaphoreHandle_t xMutex; // em uso, sinalizado pelo botão. 
SemaphoreHandle_t xPauseSemaphore;  // toDo: mover para ISR (INT0)       

volatile uint8_t paused = 0;
volatile uint16_t counter = 10;
volatile uint16_t delay_ms = 1500;

void config_user_app()
{
   // ADC_Init();
    UART_Init();

        // LED ritmo de contagem
    TRISEbits.TRISE0 = 0;
    
        // LED alarme
    TRISEbits.TRISE1 = 0;
    
        // Displays
  
    TRISBbits.TRISB1 = 0;
    TRISBbits.TRISB2 = 0;
    TRISBbits.TRISB3 = 0;
    TRISBbits.TRISB4 = 0;
    TRISBbits.TRISB4 = 0;
    TRISBbits.TRISB5 = 0;
    TRISBbits.TRISB6 = 0;
    TRISBbits.TRISB7 = 0;
    
    // Botões
    TRISBbits.TRISB0 = 1;
    TRISBbits.TRISB10 = 1;

    LATBbits.LATB5 = 1;
    LATBbits.LATB6 = 1;
    LATBbits.LATB7 = 1;

   // CNPU1bits.CN2PUE = 1;     // Ativa pull-up interno em RB0 (INT0) evita ruido
    
    // Configura interrupcao INT0 (ligado a RB0)
   // INTCON2bits.INT0EP = 1; // Interrupcao na borda de descida
   // IFS0bits.INT0IF = 0;    // Limpa flag
   // IEC0bits.INT0IE = 1;    // Habilita interrupcao INT0
   // IPC0bits.INT0IP = 3;      // Prioridade intermediaria

    xQueueConfig = xQueueCreate(2, sizeof(ConfigMsg_t));
    xQueueVelocidade = xQueueCreate(4, sizeof(uint16_t));
    xPauseSemaphore = xSemaphoreCreateBinary();
    
    xMutex = xSemaphoreCreateMutex();

    UART_SendString("User app configurado.\r\n");
}

void ADC_Init(void)
{
    AD1CON1bits.ADON = 0;
    TRISBbits.TRISB12 = 1;        // RB12 como entrada
    AD1PCFGbits.PCFG12 = 0;       // AN12 como analógico

    AD1CON1bits.FORM = 0;         // inteiro
    AD1CON1bits.SSRC = 7;         // auto-convert
    AD1CON1bits.ASAM = 1;         // auto-sample

    AD1CON2bits.VCFG = 0;         // Vref = AVdd/AVss
    AD1CON2bits.SMPI = 0;         // 1 conversão por interrupção

    AD1CON3bits.ADRC = 1;         // clock interno do ADC
    AD1CON3bits.SAMC = 10;        // sample 10 TAD
    AD1CON3bits.ADCS = 20;        // TAD = TCY*(ADCS+1)

    AD1CHSbits.CH0SA = 12;        // Canal AN12

    AD1CON1bits.ADON = 1;         // Liga o ADC
}


uint16_t ADC_Read(void)
{
    AD1CON1bits.SAMP = 1;// Inicia amostragem
      vTaskDelay(pdMS_TO_TICKS(2));
    AD1CON1bits.SAMP = 0;// Inicia conversão

    while (!AD1CON1bits.DONE); // Espera conversão terminar
    return ADC1BUF0;           // Retorna resultado de 0 a 4095
}

void Display(uint16_t number)
{
    uint8_t c = number / 100;
    uint8_t d = (number / 10) % 10;
    uint8_t u = number % 10;

    // Mostra c no display 1
LATBbits.LATB1 = c & 0x01;
LATBbits.LATB2 = (c >> 1) & 0x01;
LATBbits.LATB3 = (c >> 2) & 0x01;
LATBbits.LATB4 = (c >> 3) & 0x01;
vTaskDelay(10);
LATBbits.LATB5 = 0;  // pulso LE1
vTaskDelay(25);
LATBbits.LATB5 = 1;

// Mostra d no display 2
LATBbits.LATB1 = d & 0x01;
LATBbits.LATB2 = (d >> 1) & 0x01;
LATBbits.LATB3 = (d >> 2) & 0x01;
LATBbits.LATB4 = (d >> 3) & 0x01;
vTaskDelay(10);
LATBbits.LATB6 = 0;  // pulso LE2
vTaskDelay(25);
LATBbits.LATB6 = 1;

// Mostra u no display 3
LATBbits.LATB1 = u & 0x01;
LATBbits.LATB2 = (u >> 1) & 0x01;
LATBbits.LATB3 = (u >> 2) & 0x01;
LATBbits.LATB4 = (u >> 3) & 0x01;
vTaskDelay(10);
LATBbits.LATB7 = 0;  // pulso LE3
vTaskDelay(25);
LATBbits.LATB7 = 1;

}

void task_pause_button(void *pvParameters)
{
    uint8_t lastState = 0;
    while (1)
    {
        uint8_t current = BTN_PAUSE;
        if (lastState == 1 && current == 0)
        {
            xSemaphoreTake(xMutex, portMAX_DELAY);
            paused = !paused;
            xSemaphoreGive(xMutex);
            vTaskDelay(pdMS_TO_TICKS(200)); // debounce
        }
        lastState = current;
        vTaskDelay(pdMS_TO_TICKS(50));
    }
}

void task_menu(void *pvParameters)
{
    ConfigMsg_t cfg;
    while (1)
    {
        UART_SendString("\r\n=== MENU ===\r\n");
        UART_SendString("Digite o valor inicial (0-999): ");
        cfg.startValue = UART_ReadNumber();
        if (cfg.startValue > 999)
            cfg.startValue = 999;

        UART_SendString("Velocidade inicial (1-5): ");
        uint16_t v = UART_ReadNumber();
        if (v < 1)
            v = 1;
        if (v > 5)
            v = 5;
        cfg.delay = v * 200;

        UART_SendString("Configurado!\r\n");
        xQueueSend(xQueueConfig, &cfg, portMAX_DELAY);
    }
}

void task_led()
{
    for (;;)
    {
        LATEbits.LATE0 = !LATEbits.LATE0;
        vTaskDelay(pdMS_TO_TICKS(delay_ms));
    }
}

void task_ADC(void *pvParameters)
{
    uint16_t pot;
    uint16_t vel_ms;

    for (;;)
    {
        pot = ADC_Read(); // 0..1023

        vel_ms = 200 + (pot * 800) / 1023; // 200..1000 ms

        UART_SendString("Velocidade: ");
        UART_SendNumber(vel_ms);
        xQueueSend(xQueueVelocidade, &vel_ms, 0);

        vTaskDelay(pdMS_TO_TICKS(1000)); // le a cada 1s
    }
}

void task_counter()
{
    uint16_t new_delay;
       for (;;)
    {
           if (counter == 0) {
                counter = 30;
                LATEbits.LATE1 = 0;
            }
           if (counter < 4) {
                 LATEbits.LATE1 = 1;
           }
            if (xQueueReceive(xQueueVelocidade, &new_delay, 0) == pdTRUE)
            {   
                UART_SendString("Velocidade recebida");
               
                delay_ms = new_delay;
            }
            if (!paused) {
                Display(counter);
                UART_SendNumber(vel_ms);
                vTaskDelay(pdMS_TO_TICKS(delay_ms));
                counter--;
                
            } else {  
                 UART_SendString("Velocidade: ");
            }
    }
}

void __attribute__((__interrupt__, no_auto_psv)) _INT0Interrupt(void)
{
    BaseType_t xHigherPriorityTaskWoken = pdFALSE;

    xSemaphoreGiveFromISR(xPauseSemaphore, &xHigherPriorityTaskWoken);

    IFS0bits.INT0IF = 0; // Limpa flag da interrupï¿½ï¿½o

    // Se uma task de maior prioridade foi liberada, forï¿½a o yield
    if (xHigherPriorityTaskWoken == pdTRUE)
    {
        taskYIELD();
    }
}

void UART_Init()
{
    // Configura RF3 (TX) como saída
    TRISFbits.TRISF3 = 0; 
    // Configura RF2 (RX) como entrada
    TRISFbits.TRISF2 = 1; 

    U1MODEbits.STSEL = 0; // 1 stop bit
    U1MODEbits.PDSEL = 0;
    U1MODEbits.ABAUD = 0; // auto baud disabled
    U1MODEbits.BRGH = 1; // high speed mode
     // U1STA = 0;
    U1BRG = 103; // BAUD Rate 9600
    U1STAbits.UTXEN = 1;
    U1MODEbits.UARTEN = 1;
}

char UART_Busy(void)
{
    if (!IFS0bits.U1TXIF) {
        return 1;
    } else {
        IFS0bits.U1TXIF = 0;
        return 0;
    }
}


void UART_SendChar(char c)
{
    U1TXREG = c;
    while (UART_Busy());
}

void UART_SendString(const char *s)
{
    while(*s) {
        UART_SendChar(*s++);
    }
}

void UART_SendNumber(uint16_t num)
{
    char buffer[10];
    sprintf(buffer, "%u", num);
    UART_SendString(buffer);
}

char UART_ReadChar(void)
{
    while (!U1STAbits.URXDA);
    return U1RXREG;
}

uint16_t UART_ReadNumber(void)
{
    char buf[5];
    uint8_t i = 0;
    char c;
    while (1)
    {
        c = UART_ReadChar();
        if (c == '\r' || c == '\n')
            break;
        if (i < 4 && c >= '0' && c <= '9')
        {
            buf[i++] = c;
            UART_SendChar(c);
        }
    }
    buf[i] = '\0';
    UART_SendString("\r\n");
    return atoi(buf);
}
