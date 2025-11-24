#include <zephyr/kernel.h>
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    char selection;   
    printf("--- Zephyr Menu Inicial (%s) ---\n", CONFIG_BOARD_TARGET);

    while (1) {
        printf("\nSelecione uma opcao:\n");
        printf("  [0] Testar LED 0\n");
        printf("  [1] Testar LED 1\n");
        printf("  [q] Sair\n");
        printf("Escolha: ");

        // Lendo entrada do console. Note o espaco antes de %c.
        if (scanf(" %c", &selection) == 1) {
            if (selection == '0' || selection == '1') {
                printf("Opcao selecionada: LED %c. (Sem funcionalidade por enquanto)\n", selection);
            } else if (selection == 'q') {
                printf("Saindo do Menu. O sistema continuara rodando...\n");
            } else {
                printf("Opcao invalida. Tente novamente.\n");
            }
        }
        
        // Pequeno atraso para evitar polling excessivo
        k_msleep(500);
    }
    
    return 0;
}