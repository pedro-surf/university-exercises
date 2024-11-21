import numpy as np
import matplotlib.pyplot as plt

# Discretização do tempo
dt = 0.001  # 1 ms
T = 2       # Período dos sinais
t = np.arange(0, T, dt)

# Definição dos sinais
def signal_a(t):
    return np.where((t >= 0) & (t < 1), 1, 0)

def signal_b(t):
    return np.where((t >= 0) & (t < 1), 4 * t - 2, -4 * t + 6)

def signal_c(t):
    return 3 * t - 1

def signal_d(t):
    return np.where((t >= 0) & (t < 1), 1 + np.sin(2 * np.pi * t), 0)

# Lista de sinais
signals = [signal_a, signal_b, signal_c, signal_d]
signal_names = ["Signal A", "Signal B", "Signal C", "Signal D"]

# Função para calcular coeficientes de Fourier
def fourier_coefficients(signal, t, T, N_terms):
    a0 = (1 / T) * np.sum(signal(t) * dt)
    an = np.array([2 / T * np.sum(signal(t) * np.cos(2 * np.pi * n * t / T) * dt) for n in range(1, N_terms + 1)])
    bn = np.array([2 / T * np.sum(signal(t) * np.sin(2 * np.pi * n * t / T) * dt) for n in range(1, N_terms + 1)])
    Cn = np.sqrt(an**2 + bn**2)
    theta_n = np.arctan2(bn, an)
    return a0, an, bn, Cn, theta_n

# Função para reconstruir o sinal
def reconstruct_signal(a0, an, bn, t, T, N_terms):
    reconstructed = a0 + sum(an[n-1] * np.cos(2 * np.pi * n * t / T) + bn[n-1] * np.sin(2 * np.pi * n * t / T)
                             for n in range(1, N_terms + 1))
    return reconstructed

# Parâmetros de reconstrução
N_values = [3, 5, 10, 25, 50, 100]

# Processamento para cada sinal
for i, signal in enumerate(signals):
    print(f"Processing {signal_names[i]}")
    a0, an, bn, Cn, theta_n = fourier_coefficients(signal, t, T, max(N_values))
    
    # Reconstrução e plot para diferentes números de termos
    plt.figure(figsize=(12, 8))
    plt.plot(t, signal(t), label="Original Signal", linewidth=2)
    
    for N in N_values:
        reconstructed = reconstruct_signal(a0, an[:N], bn[:N], t, T, N)
        plt.plot(t, reconstructed, label=f"Reconstructed (N={N})", alpha=0.7)

    plt.title(f"{signal_names[i]} - Original and Reconstructed Signals")
    plt.xlabel("Time (s)")
    plt.ylabel("x(t)")
    plt.legend()
    plt.grid()
    plt.show()

    # Espectro Compacto
    plt.figure(figsize=(10, 6))
    freqs = np.arange(1, len(Cn) + 1) / T
    plt.stem(freqs[:25], Cn[:25], use_line_collection=True)
    plt.title(f"{signal_names[i]} - Fourier Coefficients Spectrum")
    plt.xlabel("Frequency (Hz)")
    plt.ylabel("Cn")
    plt.grid()
    plt.show()
