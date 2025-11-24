// =======================================================
// Definição dos Pinos GPIO para o DAC R2R (D0 -> D7)
// =======================================================
// D0 é o Bit Menos Significativo (LSB), D7 é o Bit Mais Significativo (MSB)
// Conexão física:
// GPIO 13 -> R (Resistor R do LSB)
// ...
// GPIO 32 -> R (Resistor R do MSB)
const int dac_pins[8] = {13, 12, 14, 25, 26, 27, 33, 32}; 

// =======================================================
// Parâmetros do Gerador de Onda
// =======================================================
#define NUM_SAMPLES 100 // Número de amostras por ciclo
#define TARGET_FREQ 100 // Frequência alvo em Hz (Exemplo: 100 Hz)

// Cálculo do atraso em microssegundos:
// Período (s) = 1 / Freq (Hz)
// Período (us) = 1.000.000 / Freq (Hz)
// Delay por Amostra (us) = Período (us) / NUM_SAMPLES
const int DELAY_US = 1000000 / TARGET_FREQ / NUM_SAMPLES; // Ex: 1000000/100/100 = 100 us

// =======================================================
// Vetores de Amostras (0-255)
// =======================================================

// 1. Onda Senoidal (100 amostras)
int sine_wave[NUM_SAMPLES];

// 2. Onda Triangular (100 amostras)
int triangle_wave[NUM_SAMPLES];

// 3. Onda Dente de Serra (Sawtooth) (100 amostras)
int sawtooth_wave[NUM_SAMPLES];

// 4. Onda Quadrada (Não precisa de vetor, pois usa apenas 0 e 255)
// int square_wave[NUM_SAMPLES];

// =======================================================
// Variáveis de Estado
// =======================================================
int selected_wave = 0; // 0: Nenhum, 1: Quadrada, 2: Senoidal, 3: Triângulo, 4: Serra

// =======================================================
// Funções do DAC R2R
// =======================================================

/**
 * @brief Escreve um valor digital de 8 bits (0-255) na rede R2R
 * controlando o estado HIGH/LOW dos 8 pinos GPIO.
 * * @param value Valor digital de 0 a 255.
 */
void write_dac(int value) {
  // Loop de D0 (índice 0) a D7 (índice 7)
  for (int i = 0; i < 8; i++) {
    // Verifica o i-ésimo bit do valor (e.g., bit 0, bit 1, ...)
    if ((value >> i) & 0x01) {
      // Se o bit for 1, define o pino correspondente como HIGH (3.3V)
      digitalWrite(dac_pins[i], HIGH);
    } else {
      // Se o bit for 0, define o pino correspondente como LOW (0V)
      digitalWrite(dac_pins[i], LOW);
    }
  }
}

// =======================================================
// SETUP
// =======================================================
void setup() {
  Serial.begin(115200);

  // 1. Configura os pinos do DAC como saída e inicia em 0V
  for (int i = 0; i < 8; i++) {
    pinMode(dac_pins[i], OUTPUT);
    digitalWrite(dac_pins[i], LOW); 
  }

  // 2. Gera e preenche os vetores das formas de onda
  generate_wave_data();
  
  // 3. Exibe o menu
  print_menu();
}

/**
 * @brief Preenche os vetores de amostras de 0 a 255.
 */
void generate_wave_data() {
  // --- 1. Onda Senoidal ---
  for (int i = 0; i < NUM_SAMPLES; i++) {
    // Calcula o ângulo em radianos (0 a 2*PI)
    float angle = 2 * PI * i / NUM_SAMPLES;
    // Calcula o seno (-1 a 1), escala para 0 a 2, e mapeia para 0 a 255
    sine_wave[i] = (int)(127.5 * (1 + sin(angle)));
  }

  // --- 2. Onda Triangular ---
  int half_samples = NUM_SAMPLES / 2;
  // Rampa de subida (0 a 255)
  for (int i = 0; i < half_samples; i++) {
    triangle_wave[i] = (int)(255.0 * i / half_samples);
  }
  // Rampa de descida (255 a 0)
  for (int i = 0; i < half_samples; i++) {
    triangle_wave[half_samples + i] = (int)(255.0 * (half_samples - i) / half_samples);
  }
  
  // --- 3. Onda Dente de Serra (Sawtooth) ---
  for (int i = 0; i < NUM_SAMPLES; i++) {
    // Rampa linear de 0 a 255
    sawtooth_wave[i] = (int)(255.0 * i / NUM_SAMPLES);
  }
}

/**
 * @brief Exibe o menu de seleção no Monitor Serial.
 */
void print_menu() {
  Serial.println("\n====================================");
  Serial.println("  GERADOR DE ONDA R2R (ESP32)");
  Serial.println("  Frequência: " + String(TARGET_FREQ) + " Hz");
  Serial.println("====================================");
  Serial.println("[1] Gera onda quadrada");
  Serial.println("[2] Gera onda senoide");
  Serial.println("[3] Gera onda triangular");
  Serial.println("[4] Gera onda serra");
  Serial.println("====================================");
  Serial.print("Onda selecionada: ");
  switch(selected_wave) {
    case 1: Serial.println("Quadrada"); break;
    case 2: Serial.println("Senoidal"); break;
    case 3: Serial.println("Triangular"); break;
    case 4: Serial.println("Serra"); break;
    default: Serial.println("Nenhuma (Envie um número de 1 a 4)"); break;
  }
}

// =======================================================
// LOOP Principal
// =======================================================
void loop() {
  // 1. Verifica se o usuário enviou um novo comando
  if (Serial.available()) {
    char input = Serial.read();
    if (input >= '1' && input <= '4') {
      selected_wave = input - '0';
      print_menu();
    }
  }

  // 2. Gera a onda selecionada
  switch (selected_wave) {
    case 1:
      generate_square_wave();
      break;
    case 2:
      generate_wave(sine_wave, NUM_SAMPLES);
      break;
    case 3:
      generate_wave(triangle_wave, NUM_SAMPLES);
      break;
    case 4:
      generate_wave(sawtooth_wave, NUM_SAMPLES);
      break;
    default:
      // Se não houver seleção, mantém o DAC em 0V
      write_dac(0); 
      delay(10);
      break;
  }
}

/**
 * @brief Função genérica para gerar ondas usando o vetor de amostras.
 * * @param wave_array Ponteiro para o vetor da forma de onda.
 * @param size Tamanho do vetor (número de amostras).
 */
void generate_wave(int* wave_array, int size) {
  for (int i = 0; i < size; i++) {
    write_dac(wave_array[i]);
    // O uso de delayMicroseconds é crucial para frequências mais altas
    delayMicroseconds(DELAY_US); 
  }
}

/**
 * @brief Gera a onda quadrada (apenas 0 e 255).
 */
void generate_square_wave() {
  // Parte alta do ciclo (3.3V)
  write_dac(255);
  delayMicroseconds(DELAY_US * NUM_SAMPLES / 2); // Metade do período

  // Parte baixa do ciclo (0V)
  write_dac(0);
  delayMicroseconds(DELAY_US * NUM_SAMPLES / 2); // Metade do período
}