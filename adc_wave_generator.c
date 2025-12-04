// =============================================================
// Projeto: Contador com 2 Displays de 7 segmentos (catodo comum)
// Plataforma: ESP32 com ESP-IDF (C puro)
// =============================================================

#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/portmacro.h"
#include "driver/gpio.h"
#include "driver/uart.h"
#include "esp_timer.h"
#include <math.h>

#define UART_PORT_NUM UART_NUM_0
#define BUF_SIZE 1024

// ===========================
// Mapeamento dos pinos
// GPIOs do DAC R-2R (8 bits)
static const int dac_pins[8] = {GPIO_NUM_15, GPIO_NUM_2, GPIO_NUM_4, GPIO_NUM_16, GPIO_NUM_17, GPIO_NUM_5, GPIO_NUM_18, GPIO_NUM_19};

// Quantidade de samples por período da onda
#define NUM_SAMPLES 64

// ========================== FORMAS DE ONDA ========================

static const uint8_t wave_square[NUM_SAMPLES] = {
    [0 ... 31] = 0,
    [32 ... 63] = 255};

static uint8_t wave_saw[NUM_SAMPLES];
static uint8_t wave_tri[NUM_SAMPLES];
static uint8_t wave_sine[NUM_SAMPLES];

// Ponteiro para onda atual
static const uint8_t *current_wave = wave_square;

// Índice atualizado pela ISR
volatile int sample_index = 0;

// Timer handle
esp_timer_handle_t timer_handle;

// ========================= GERAR VETORES DINÂMICOS ========================

void generate_waves()
{
    for (int i = 0; i < NUM_SAMPLES; i++)
    {
        // triangulo
        if (i < NUM_SAMPLES / 2)
        {
            wave_tri[i] = (i * 255) / (NUM_SAMPLES / 2);
        }
        else
        {
            wave_tri[i] = ((NUM_SAMPLES - i) * 255) / (NUM_SAMPLES / 2);
        }

        // serra
        wave_saw[i] = (i * 255) / (NUM_SAMPLES - 1);

        // senoide
        float rad = (2.0f * M_PI * i) / NUM_SAMPLES;
        wave_sine[i] = (uint8_t)((sin(rad) + 1.0f) * 127.5f);
    }
}

// ======================== FUNÇÃO DE SAÍDA R-2R ===========================

static inline void output_R2R(uint8_t value)
{
    for (int i = 0; i < 8; i++)
    {
        int bit = (value >> i) & 1;
        gpio_set_level(dac_pins[i], bit);
    }
}

// ============================= ISR DO TIMER =============================

// Essa ISR roda com jitter ZERO.
// Cada chamada envia o próximo sample.
void timer_isr(void *arg)
{
    output_R2R(current_wave[sample_index]);
    sample_index = (sample_index + 1) % NUM_SAMPLES;
}

// ============================ AJUSTAR FREQUÊNCIA =========================
// f_onda = 1 / (NUM_SAMPLES * periodo_timer)
// logo:
// periodo_timer = 1 / (f_onda * NUM_SAMPLES)

void set_frequency(float freq_hz)
{
    float period_sec = 1.0f / (freq_hz * NUM_SAMPLES);
    int64_t us = (int64_t)(period_sec * 1e6);

    esp_timer_stop(timer_handle);
    esp_timer_start_periodic(timer_handle, us);

    printf("Frequência ajustada para %.2f Hz (timer = %lld us)\n", freq_hz, us);
}

// ================================ MAIN ===================================

void app_main()
{
    // Configurar GPIOs
    for (int i = 0; i < 8; i++)
    {
        gpio_reset_pin(dac_pins[i]);
        gpio_set_direction(dac_pins[i], GPIO_MODE_OUTPUT);
    }

    generate_waves();

    // Criar timer
    const esp_timer_create_args_t timer_args = {
        .callback = &timer_isr,
        .arg = NULL,
        .name = "wave_timer"};
    esp_timer_create(&timer_args, &timer_handle);

    // Começa com 2 Hz por padrão
    set_frequency(2.0f);

    printf("MENU:\n");
    printf("[1] Quadrada\n");
    printf("[2] Senoide\n");
    printf("[3] Triangular\n");
    printf("[4] Serra\n");
    printf("Digite também frequências: ex: 8\n");

    // ------------------------- TASK DO MENU -------------------------
    while (1)
    {
        char input[32];
        if (fgets(input, sizeof(input), stdin))
        {
            float f = atof(input);
            if (f == 1)
            {
                current_wave = wave_square;
                printf("Quadrada\n");
            }
            else if (f == 2)
            {
                current_wave = wave_sine;
                printf("Senoide\n");
            }
            else if (f == 3)
            {
                current_wave = wave_tri;
                printf("Triangular\n");
            }
            else if (f == 4)
            {
                current_wave = wave_saw;
                printf("Serra\n");
            }
            else if (f > 0)
            {
                set_frequency(f);
            }
        }
        vTaskDelay(10 / portTICK_PERIOD_MS);
    }
}
