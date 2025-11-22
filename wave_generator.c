#include <math.h>
#include <stdint.h>
#include <Arduino.h>

#define NUM_BITS 8
#define NUM_SAMPLES 256

// Pinos que simulam a saída R-2R (D0...D7)
int dacPins[NUM_BITS] = { 13, 12, 14, 27, 26, 25, 33, 32 };

uint8_t waveSquare[NUM_SAMPLES];
uint8_t waveSine[NUM_SAMPLES];
uint8_t waveTri[NUM_SAMPLES];
uint8_t waveSaw[NUM_SAMPLES];

uint8_t* currentWave = waveSquare;

void generateWaves() {
  // Quadrada
  for (int i = 0; i < NUM_SAMPLES; i++) {
    waveSquare[i] = (i < NUM_SAMPLES / 2) ? 255 : 0;
  }

  // Seno
  for (int i = 0; i < NUM_SAMPLES; i++) {
    waveSine[i] = (uint8_t)((sin(2 * M_PI * i / NUM_SAMPLES) + 1) * 127.5);
  }

  // Triangular
  for (int i = 0; i < NUM_SAMPLES; i++) {
    if (i < NUM_SAMPLES / 2)
      waveTri[i] = (uint8_t)(i * 2);
    else
      waveTri[i] = (uint8_t)(255 - (i - 128) * 2);
  }

  // Serra
  for (int i = 0; i < NUM_SAMPLES; i++) {
    waveSaw[i] = (uint8_t)i;
  }
}

void outputToDAC(uint8_t value) {
  for (int b = 0; b < NUM_BITS; b++) {
    digitalWrite(dacPins[b], (value >> b) & 1);
  }
}

void setup() {
  Serial.begin(115200);

  for (int i = 0; i < NUM_BITS; i++) {
    pinMode(dacPins[i], OUTPUT);
  }

  generateWaves();

  Serial.println("MENU:");
  Serial.println("[1] Quadrada");
  Serial.println("[2] Senoide");
  Serial.println("[3] Triangular");
  Serial.println("[4] Serra");
  Serial.println("----------------------");
}

int sampleDelay = 50;   // delay em micros entre samples (ajustado pela frequência)
bool waitingFreq = false;

void loop() {

  // Se estamos aguardando o usuário digitar a frequência
  if (waitingFreq && Serial.available()) {
    int freq = Serial.parseInt();  // lê número digitado
    if (freq > 0) {
      // Tempo por amostra = (1/freq) / NUM_SAMPLES  (em segundos)
      // Converter para microsegundos:
      sampleDelay = (1.0 / freq) * 1e6 / NUM_SAMPLES;

      Serial.print("Frequência definida: ");
      Serial.print(freq);
      Serial.println(" Hz");

      waitingFreq = false;
    }
  }

  if (!waitingFreq && Serial.available()) {
    char c = Serial.read();

    if (c == '1') currentWave = waveSquare;
    if (c == '2') currentWave = waveSine;
    if (c == '3') currentWave = waveTri;
    if (c == '4') currentWave = waveSaw;

    if (c >= '1' && c <= '4') {
      Serial.print("Forma de onda selecionada: ");
      Serial.println(c);

      Serial.println("Digite a frequência desejada em Hz (ex: 1000): ");
      waitingFreq = true;
    }
  }

  if (!waitingFreq) {
    for (int i = 0; i < NUM_SAMPLES; i++) {
      outputToDAC(currentWave[i]);
      delayMicroseconds(sampleDelay);
    }
  }
}
