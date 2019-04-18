// FILE: 7.c
// LIST: first
// EXERCISE NUMBER: 7
// AUTHOR: Pedro Silveira
// PURPOSE:
// criar uma matriz A (4x4)
// achar o elemento máximo dessa matriz e a sua posição

// OVERALL METHOD:
// 1. Initialize c array with 7 elements
// 2. Iterate through it and assign random values to each index
// 3. Return maximum value, minimum value and index of minimum
#include <stdio.h>
#include <stdlib.h>

int main()
{
	int a[4][4] = { 0 };
    int getrandomvalue = 0;
	int  max = 0, i = 0, j = 0;

	printf("Inicializando... \n");

   for ( i = 0; i < 4; i++ ) {
       for ( j=0; j < 4; j++ ) {
        getrandomvalue =  rand() % (50); // obter numero aleartorio
        a[i][j] = getrandomvalue;
            printf("\n A[%i][%i]: %i ,", i, j, a[i][j]);
        getrandomvalue = 0;
	}
   }
   for (i = 0; i < 4; i++) {
     for (j = 0; j < 4; j++) {
        // printf("\n A[%i][%i] = %i ", i, j, a[i][j]);
	 if (a[i][j] > max) {
	     max = a[i][j];
        }
   }
	}
    printf("\n Maximo encontrado: %i", max);
return 0;
}
