import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import simps
from fpdf import FPDF

# Parâmetros de tempo e frequência
T = 1  # Período do sinal em segundos
delta_t = 0.001  # Intervalo de tempo em segundos (1 ms)
t = np.arange(0, T, delta_t)  # Vetor de tempo
N_terms = [3, 5, 10, 25, 50, 100]  # Número de termos a serem calculados
f_max = 25  # Frequência máxima em Hz para o espectro

# Função exemplo (sinal base)
def signal(t):
    return np.sin(2 * np.pi * t) + 0.5 * np.cos(4 * np.pi * t)

x_t = signal(t)

# Funções para cálculo dos coeficientes de Fourier
def fourier_coefficients(x_t, t, T, num_terms):
    a0 = (2 / T) * simps(x_t, t)  # Cálculo de a0
    an = []
    bn = []
    omega0 = 2 * np.pi / T  # Frequência fundamental

    for n in range(1, num_terms + 1):
        an_n = (2 / T) * simps(x_t * np.cos(n * omega0 * t), t)
        bn_n = (2 / T) * simps(x_t * np.sin(n * omega0 * t), t)
        an.append(an_n)
        bn.append(bn_n)

    return a0, np.array(an), np.array(bn)

# Função para reconstruir o sinal
def reconstruct_signal(t, a0, an, bn, num_terms):
    omega0 = 2 * np.pi / T
    reconstruction = a0 / 2
    for n in range(1, num_terms + 1):
        reconstruction += an[n-1] * np.cos(n * omega0 * t) + bn[n-1] * np.sin(n * omega0 * t)
    return reconstruction

# Função para calcular Cn e θn para a série compacta
def compact_coefficients(an, bn):
    Cn = np.sqrt(an**2 + bn**2)
    theta_n = np.arctan2(bn, an)
    return Cn, theta_n

# Cálculo dos coeficientes e reconstrução para cada N_terms
for num_terms in N_terms:
    a0, an, bn = fourier_coefficients(x_t, t, T, num_terms)
    x_reconstructed = reconstruct_signal(t, a0, an, bn, num_terms)
    
    # Plota o sinal original e reconstruído
    plt.figure(figsize=(10, 4))
    plt.plot(t, x_t, label="Sinal Original")
    plt.plot(t, x_reconstructed, label=f"Sinal Reconstruído com {num_terms} termos")
    plt.xlabel("Tempo (s)")
    plt.ylabel("Amplitude")
    plt.legend()
    plt.title(f"Sinal Original vs Reconstruído com {num_terms} termos")
    plt.show()

    # Cálculo dos coeficientes compactos
    Cn, theta_n = compact_coefficients(an, bn)
    
    # Plota o espectro da série compacta
    plt.figure(figsize=(10, 4))
    plt.stem(range(1, len(Cn) + 1), Cn, basefmt=" ", use_line_collection=True)
    plt.xlabel("Frequência (Hz)")
    plt.ylabel("Amplitude")
    plt.title(f"Espectro da Série Compacta com {num_terms} termos")
    plt.xlim(0, f_max)
    plt.show()

# Gerar PDF com relatório (usando FPDF)
pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", "B", 16)
pdf.cell(0, 10, "Relatório de Série de Fourier", ln=True, align="C")

# Adicionar mais detalhes no relatório aqui

pdf.output("Relatorio_Serie_Fourier.pdf")
