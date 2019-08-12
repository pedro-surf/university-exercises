// FILE: 8.c
// LIST: first
// EXERCISE NUMBER: 8
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
	float a[3][3] = { 0 };
	float b[3][3] = { 0 };
	float c[3][3] = { 0 };
    float getinputvalue = 0;
	int  i = 0, j = 0;
	float avg = 0, sum = 0;

	printf("Inicializando... Digite os valores da matriz A \n");

   for ( i = 0; i < 3; i++ ) {
       for ( j=0; j < 3; j++ ) {
        getinputvalue = rand() % (40);
         a[i][j] = getinputvalue;
          printf("\n Valor atrib a A[%i][%i]: %.1f ,", i, j, getinputvalue);
        getinputvalue = 0;
	}
   }
   for (i = 0; i < 3; i++) {
     for (j = 0; j < 3; j++) {
	 sum = sum + a[i][j];
	 c[j][i] = a[i][j];
   }
	}
	avg = sum / 9;
    printf("\n Media dos elem de A = %.1f", avg);
    
    printf("\n Matriz C:");
	for (i = 0; i < 3; i++) {
		printf("\n");
		for (j = 0; j < 3; j++) {
			 printf("   C[%i][%i]: %.1f", i, j, c[i][j]);
			 if (a[i][j] > avg) {
				 b[i][j] = a[i][j];
				 }
   }
	}
	
	printf("\n Matriz B:");
	for (i = 0; i < 3; i++) {
		printf("\n");
		for (j = 0; j < 3; j++) {
		printf(" B[%i][%i] = %.1f ", i, j, b[i][j]);
		}
	}
return 0;
}
