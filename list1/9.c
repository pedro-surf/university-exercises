// FILE: 9.c
// LIST: first
// EXERCISE NUMBER: 9
// AUTHOR: Pedro Silveira
// PURPOSE:
// criar uma matriz 3 x 3 A com elementos do tipo float;
// criar uma matriz B com elementos da matriz A que estão acima
// da media (os outros elementos devem ser iguais a 0);
// cria uma matriz C com elementos da matriz A com suas posições invertidas em relação a diagonal principal:
// OVERALL METHOD:
// 1. Initialize c array with 7 elements
// 2. Iterate through it and assign random values to each index
// 3. Return maximum value, minimum value and index of minimum
#include <stdio.h>
#include <stdlib.h>

int main()
{
	int vector[10] = { 0, 4, 7, 3, 8, 2, 1, 8, 9, 4};
	
	int n = 0;
	int repeatedvalues[n+1];
	int i, j, k, l, repeatedpos, getrepeated;
	
	for (i = 0; i < 10; i++) {printf("Vector[%i]: %i \n", i, vector[i]);}
	
	for (i = 0; i < 10; i++) {
	 for (j = 0; j < 10; j++) {
		if ((vector[j] == vector[i]) && (j != i) && (getrepeated != vector[j])) {	
			printf("\n Valor repetido: %i", vector[j]);
			getrepeated = vector[j];
			
    }

	
		}
	}
	printf("\nRepeated values vector[%i]: %i|", repeatedpos, repeatedvalues[n]);
	
return 0;
}
      
