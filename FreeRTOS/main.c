#include <xc.h>
#include "FreeRTOS.h"
#include "task.h"
#include "user_app.h"
#define _XTAL_FREQ 8000000UL   // cristal de 8 MHz
#define FCY        4000000UL  // ciclo de instrucao (Fosc/2)
#include <libpic30.h>

int main(void)
{

    config_user_app();
    xTaskCreate(task_counter, "Counter", 128, NULL, 3, NULL);
    xTaskCreate(task_pause_button, "Button", 128, NULL, 3, NULL);
   // xTaskCreate(task_menu, "Menu", 128, NULL, 1, NULL);
    xTaskCreate(task_led, "Led", 128, NULL, 2, NULL);
    xTaskCreate(task_ADC, "ADC", 128, NULL, 2, NULL);
    // UART_SendString("TEST UART\r\n");

    vTaskStartScheduler();
    
    while (1);
    
    return 0;
}
