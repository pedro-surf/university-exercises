import numpy as np
import matplotlib.pyplot as plt

# **1. Carregar os dados do arquivo .txt**
# Substitua 'ecg_data.txt' pelo nome do seu arquivo
data = np.loadtxt('ecg_data.txt')

# Separar as colunas: ECG (primeira coluna) e tempo (segunda coluna)
ecg_signal = data[:, 0]
time = data[:, 1]

# **2. Informações do sinal**
fs = 1000  # Frequência de amostragem (Hz)
Ts = 1 / fs  # Período de amostragem (segundos/amostra)
signal_duration = time[-1] - time[0]  # Duração do sinal em segundos

print(f"Período de amostragem: {Ts} segundos")
print(f"Duração do sinal: {signal_duration} segundos")

# **3. Plotar o sinal de ECG(t) para o intervalo de 0 a 5 segundos**
plt.figure(figsize=(12, 6))
plt.plot(time, ecg_signal, label='ECG(t)', color='blue')
plt.xlim(0, 5)
plt.xlabel('Tempo (s)')
plt.ylabel('Amplitude')
plt.title('Sinal ECG(t)')
plt.legend()
plt.grid(True)
plt.show()

# **4. FFT do ECG(t)**
# Número de amostras no sinal
n_samples = len(ecg_signal)

# FFT: Transformada de Fourier
fft_values = np.fft.fft(ecg_signal)
fft_magnitude = np.abs(fft_values) / n_samples  # Normalizar pela quantidade de amostras
frequencies = np.fft.fftfreq(n_samples, Ts)  # Vetor de frequências

# Apenas a metade positiva do espectro (frequências reais)
positive_frequencies = frequencies[:n_samples // 2]
positive_magnitude = fft_magnitude[:n_samples // 2]

# Plotar a FFT
plt.figure(figsize=(12, 6))
plt.plot(positive_frequencies, positive_magnitude, color='red')
plt.xlabel('Frequência (Hz)')
plt.ylabel('Magnitude')
plt.title('Espectro de Frequências do ECG(t)')
plt.grid(True)
plt.show()
