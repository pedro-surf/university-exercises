import numpy as np
import matplotlib.pyplot as plt

# Carregar os dados
data = np.loadtxt('/content/drive/MyDrive/ECG.txt')
ecg_signal = data[:, 0]  # Sinal ECG
time = data[:, 1]  # Tempo

# Parâmetros do sinal
fs = 1000  # Frequência de amostragem (Hz)
Ts = 1 / fs  # Período de amostragem (s)
n_samples = len(ecg_signal)

# (a) Verificar offset
offset = np.mean(ecg_signal)
print(f"(a) Offset do sinal: {offset:.4f}")

# FFT do sinal
fft_values = np.fft.fft(ecg_signal) / n_samples
frequencies = np.fft.fftfreq(n_samples, Ts)
positive_frequencies = frequencies[:n_samples // 2]
positive_magnitude = np.abs(fft_values[:n_samples // 2])

# (b) Ruídos de baixa frequência (< 0.5 Hz)
low_freq_mask = positive_frequencies < 0.5
low_freq_magnitude = positive_magnitude[low_freq_mask]
low_freq_present = np.any(low_freq_magnitude > 0.01)  # Threshold arbitrário
low_freq_indices = np.where(low_freq_magnitude > 0.01)[0]
low_freq_values = positive_frequencies[low_freq_mask][low_freq_indices]
print(f"(b) Ruídos de baixa frequência presentes: {low_freq_present}")
if low_freq_present:
    print(f"    Frequências envolvidas: {low_freq_values} Hz")

# (c) Ruído da rede elétrica (60 Hz)
network_freq = 60
network_mask = (positive_frequencies > network_freq - 1) & (positive_frequencies < network_freq + 1)
network_magnitude = np.sum(positive_magnitude[network_mask])
print(f"(c) Magnitude do ruído da rede elétrica (60 Hz): {network_magnitude:.4f} (Significativo: {network_magnitude > 0.05})")

# (d) Ruídos acima de 100 Hz
high_freq_mask = positive_frequencies > 100
high_freq_magnitude = positive_magnitude[high_freq_mask]
high_freq_present = np.any(high_freq_magnitude > 0.01)  # Threshold arbitrário
print(f"(d) Ruídos acima de 100 Hz presentes: {high_freq_present}")

# Plotar o espectro para análise visual
plt.figure(figsize=(12, 6))
plt.plot(positive_frequencies, positive_magnitude, color='red', label="FFT Magnitude")
plt.axvline(60, color='blue', linestyle='--', label="60 Hz (Rede elétrica)")
plt.axvline(100, color='green', linestyle='--', label="100 Hz (Fim da banda do ECG)")
plt.title("Espectro de Frequência do ECG")
plt.xlabel("Frequência (Hz)")
plt.ylabel("Magnitude")
plt.grid()
plt.legend()
plt.show()
