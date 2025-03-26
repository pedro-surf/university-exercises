import numpy as np
import matplotlib.pyplot as plt
from scipy.signal import TransferFunction, bode

# Função para calcular e plotar o diagrama de Bode
def plot_bode(numerator, denominator, title):
    # Criação da função de transferência
    system = TransferFunction(numerator, denominator)
    
    # Frequências (log-scale) e resposta em Bode
    w, mag, phase = bode(system)
    
    # Frequência em Hz (w está em rad/s)
    freq_hz = w / (2 * np.pi)
    
    # Plot - Magnitude
    plt.figure(figsize=(10, 6))
    plt.subplot(2, 1, 1)
    plt.semilogx(freq_hz, mag, label="Magnitude (dB)")
    plt.title(title)
    plt.ylabel("Magnitude (dB)")
    plt.grid(True, which="both", linestyle="--", linewidth=0.5)
    plt.axhline(-3, color="red", linestyle="--", label="-3 dB (Corte)")
    plt.legend()
    
    # Plot - Fase
    plt.subplot(2, 1, 2)
    plt.semilogx(freq_hz, phase, label="Phase (degrees)")
    plt.ylabel("Phase (degrees)")
    plt.xlabel("Frequency (Hz)")
    plt.grid(True, which="both", linestyle="--", linewidth=0.5)
    plt.legend()
    
    # Exibir o gráfico
    plt.tight_layout()
    plt.show()

# Funções de transferência dadas
systems = [
    {"numerator": [62831], "denominator": [1, 62831], "title": "H(s) = 62831 / (s + 62831)"},
    {"numerator": [3947840], "denominator": [1, 889, 394784], "title": "H(s) = 3947840 / (s^2 + 889s + 394784)"},
    {"numerator": [1, 0], "denominator": [1, 942], "title": "H(s) = s / (s + 942)"},
    {"numerator": [1, 0, 0, 0], "denominator": [1, 37.7, 710.6, 6690], "title": "H(s) = s^3 / (s^3 + 37.7s^2 + 710.6s + 6690)"},
    {"numerator": [626126, 0], "denominator": [1, 626126, 394784176], "title": "H(s) = 626126s / (s^2 + 626126s + 394784176)"},
    {"numerator": [1, 0, 395477191], "denominator": [1, 625900, 395477191], "title": "H(s) = (s^2 + 395477191) / (s^2 + 625900s + 395477191)"},
    {"numerator": [1, 0, 142129], "denominator": [1, 38, 142129], "title": "H(s) = ((s^2 + 142129) / (s^2 + 38s + 142129))^3"}
]

# Plotar diagramas de Bode para cada função de transferência
for system in systems:
    plot_bode(system["numerator"], system["denominator"], system["title"])
