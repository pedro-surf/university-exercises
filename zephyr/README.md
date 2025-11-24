## Zephyr Control Unit Project (WIP)

```
#include <zephyr/kernel.h>
#include <zephyr/drivers/gpio.h>
#include <stdio.h>

/* --- 1. CONFIGURAÇÃO DE HARDWARE E SINCRONIZAÇÃO --- */

// Definições de Device Tree (DT) que esperam os aliases 'led0' e 'led1' no .overlay
#define LED0_NODE DT_ALIAS(led0) 
#define LED1_NODE DT_ALIAS(led1) 

// Estruturas para os pinos GPIO
// A macro 'DT_ALIAS' é expandida para o ID do dispositivo e pino definido no .overlay
static const struct gpio_dt_spec led0 = GPIO_DT_SPEC_GET(LED0_NODE);
static const struct gpio_dt_spec led1 = GPIO_DT_SPEC_GET(LED1_NODE);

// Semáforo Binário: Usado pelo Menu (produtor) para sinalizar à thread Blinker (consumidora) quando começar.
// Inicializado com 0 (bloqueado).
K_SEM_DEFINE(blinker_sem, 0, 1); 

// Variável Compartilhada: Indica qual LED deve piscar (0, 1, ou -1 para parar).
static int current_led = -1; 
// Mutex: Protege o acesso à variável compartilhada 'current_led' contra corrupção por múltiplas threads.
K_MUTEX_DEFINE(led_mutex); 

/* --- 2. THREAD BLINKER (Prioridade Média) --- */

void blinky_thread_entry(void) {
    // Configura e verifica a prontidão dos pinos GPIO
    if (!gpio_is_ready_dt(&led0) || !gpio_is_ready_dt(&led1)) {
        printk("Erro: Driver(s) GPIO não pronto(s)!\n");
        return;
    }
    gpio_pin_configure_dt(&led0, GPIO_OUTPUT_INACTIVE);
    gpio_pin_configure_dt(&led1, GPIO_OUTPUT_INACTIVE);

    while (1) {
        // Bloqueia e espera pelo semáforo ser sinalizado pelo Menu (main thread)
        // Quando k_sem_take retorna (semáforo dado), a thread prossegue
        k_sem_take(&blinker_sem, K_FOREVER); 
        
        // --- Início da Seção Crítica ---
        k_mutex_lock(&led_mutex, K_FOREVER); 
        int led_to_blink = current_led; // Lê a seleção do LED
        k_mutex_unlock(&led_mutex);
        // --- Fim da Seção Crítica ---

        // Se current_led foi definido como -1, significa que o menu pediu para parar
        if (led_to_blink == -1) {
            gpio_pin_set_dt(&led0, 0); // Garante que ambos estão desligados
            gpio_pin_set_dt(&led1, 0);
            continue; 
        }

        const struct gpio_dt_spec *led_spec = (led_to_blink == 0) ? &led0 : &led1;
        
        printk("\n[BLINDER] LED %d (GPIO %d) piscando...\n", led_to_blink, led_spec->pin);
        
        for (int i = 0; i < 10; i++) { // Pisca 10 vezes
            gpio_pin_set_dt(led_spec, 1);
            k_msleep(200);
            gpio_pin_set_dt(led_spec, 0);
            k_msleep(200);
        }
        
        printk("[BLINDER] LED %d parou de piscar.\n", led_to_blink);
        
        // Sinaliza o fim: Volta 'current_led' para -1 para indicar que não há LED ativo
        k_mutex_lock(&led_mutex, K_FOREVER);
        current_led = -1; 
        k_mutex_unlock(&led_mutex);
    }
}

// Definição da thread Blinker (usa stack de 1024 bytes e prioridade 5 - média)
K_THREAD_DEFINE(blinky_thread, 1024, blinky_thread_entry, NULL, NULL, NULL, 
                5, 0, 0); 

/* --- 3. THREAD PRINCIPAL (MENU/Controle - Prioridade Baixa) --- */

void main(void) {
    char selection;
    
    printk("--- Inicializacao Zephyr no ESP32 (%s) ---\n", CONFIG_BOARD_TARGET);

    while (1) {
        
        // Garante que o estado anterior foi limpo antes de mostrar o menu
        k_mutex_lock(&led_mutex, K_FOREVER);
        if (current_led != -1) {
            // Se um LED estava piscando (current_led != -1), sinalizamos para o blinker parar.
            current_led = -1;
            k_sem_give(&blinker_sem); // Sinaliza a blinker thread para sair do loop de pisca
            k_msleep(100); // Pequeno atraso para dar tempo de parar
        }
        k_mutex_unlock(&led_mutex);
        
        printf("\n--- Zephyr Menu de I/O ---\n");
        printf("Selecione qual LED piscar (pisca 10 vezes):\n");
        printf("  [0] LED 0 (GPIO %d)\n", led0.pin);
        printf("  [1] LED 1 (GPIO %d)\n", led1.pin);
        printf("  [q] Sair/Parar\n");
        printf("Escolha: ");

        // Lendo entrada do console (usa 'scanf' que requer CONFIG_NEWLIB_LIBC=y)
        if (scanf(" %c", &selection) == 1) {
            if (selection == '0' || selection == '1') {
                int led_num = selection - '0';
                
                // Atualiza o LED a ser piscado dentro da seção crítica
                k_mutex_lock(&led_mutex, K_FOREVER);
                current_led = led_num;
                k_mutex_unlock(&led_mutex);
                
                printk("Opcao selecionada: LED %d. Aguardando Blinker...\n", led_num);
                k_sem_give(&blinker_sem); // Sinaliza a thread blinky para começar
                
            } else if (selection == 'q') {
                printf("Saindo do Menu...\n");
                // A logica de parada já está no topo do loop
            } else {
                printf("Opcao invalida. Tente novamente.\n");
            }
        }
        k_msleep(500); // Pequeno atraso para evitar polling excessivo
    }
}
```