#include <zephyr/kernel.h>
#include <zephyr/drivers/gpio.h>

#define GPIO_CONTROLLER_NODE DT_NODELABEL(gpio0)

static const struct gpio_dt_spec led = {
    .port = DEVICE_DT_GET(GPIO_CONTROLLER_NODE),
    .pin = 2, // Pino do LED no ESP32
    .dt_flags = GPIO_ACTIVE_LOW
};

static const struct gpio_dt_spec button = {
    .port = DEVICE_DT_GET(GPIO_CONTROLLER_NODE),
    .pin = 0, // Pino do Botão BOOT no ESP32
    .dt_flags = GPIO_PULL_UP // Botão BOOT precisa de pull-up (ou ativo baixo)
};

static struct gpio_callback button_cb_data;

K_SEM_DEFINE(button_sem, 0, 1); // 0 inicial, 1 máximo

volatile int blink_delay_ms = 500;
K_MUTEX_DEFINE(delay_mutex);

void button_pressed_cb(const struct device *dev, struct gpio_callback *cb, uint32_t pins) 
{
    k_sem_give(&button_sem);
}

void blinker_thread_entry(void)
{
    if (!gpio_is_ready_dt(&led))
    {
        printk("Erro: Driver(s) GPIO do LED não pronto!\n");
        return;
    }
    gpio_pin_configure_dt(&led, GPIO_OUTPUT_INACTIVE);

    printk("LED Blinker rodando (Prioridade Baixa).\n");

    while (1)
    {
        // --- Verifica se há um sinal do botão ---
        if (k_sem_take(&button_sem, K_NO_WAIT) == 0)
        {
            printk("[CTRL] Botao pressionado! Alterando velocidade.\n");

            k_mutex_lock(&delay_mutex, K_FOREVER);

            if (blink_delay_ms == 100)
            {
                blink_delay_ms = 500;
            }
            else
            {
                blink_delay_ms -= 100;
            }

            k_mutex_unlock(&delay_mutex);

            printk("[CTRL] Novo delay: %d ms.\n", blink_delay_ms);
        }

        int current_delay;
        k_mutex_lock(&delay_mutex, K_FOREVER);
        current_delay = blink_delay_ms;
        k_mutex_unlock(&delay_mutex);

        gpio_pin_set_dt(&led, 1);
        k_msleep(current_delay);
        gpio_pin_set_dt(&led, 0);
        k_msleep(current_delay);
    }
}

// Definição da thread Blinker
K_THREAD_DEFINE(blinky_thread, 1024, blinker_thread_entry, NULL, NULL, NULL,
                8, 0, 0); // Prioridade 8 (Baixa)

/* --- 5. FUNÇÃO PRINCIPAL (Configuração) --- */

int main(void)
{
    printk("--- Zephyr LED Speed Control (ESP32) ---\n");

    // --- 5.1 Configuração do Botão (BOOT/IO0) ---
    if (!gpio_is_ready_dt(&button))
    {
        printk("Erro: Driver(s) GPIO do Botao não pronto!\n");
        return 0;
    }

    int ret = gpio_pin_configure_dt(&button, GPIO_INPUT | GPIO_PULL_UP);
    if (ret < 0)
        return 0;

    ret = gpio_pin_interrupt_configure_dt(&button, GPIO_INT_EDGE_TO_ACTIVE);
    if (ret < 0)
        return 0;

    // Adiciona o callback
    gpio_init_callback(&button_cb_data, button_pressed_cb, BIT(button.pin));
    gpio_add_callback(button.port, &button_cb_data);
    printk("Botao BOOT (GPIO %d) configurado para interrupcao.\n", button.pin);

    return 0;
}