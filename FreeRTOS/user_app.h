#ifndef USER_APP_H
#define	USER_APP_H

typedef struct {
    uint16_t startValue;
    uint16_t delay;
} ConfigMsg_t;

void config_user_app();

void Display(uint16_t number);

void ADC_Init(void);
uint16_t ADC_Read(void);

void task_ADC();
void task_menu();
void task_counter();
void task_pause_button();
void task_delay_button();
void task_led();

void UART_init();
char UART_Busy(void);
void UART_SendNumber(uint16_t num);
char UART_ReadChar(void);
void UART_SendString(const char *s);
uint16_t UART_ReadNumber(void);

#endif	/* USER_APP_H */

