// FILE: 6.c
// LIST: first
// EXERCISE 5
// AUTHOR: Pedro Silveira
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
// PURPOSE:
// 	criar e inicializar uma matriz A 3 x 3
// 	achar a soma dos elementos pares.
// OVERALL METHOD:
// 1. Assinalar valores aleartorios às matrizes
// 2. Buscar numeros pares iterando as matrizes
// 3. Somar os pares

#include <stdio.h>
#include <stdlib.h>
int main()
{
	int a[3][3], b[3][3] = { 0 };
    int getrandomvalue, number = 0;
	int  sum = 0, i = 0, j = 0;

	printf("Inicializando... \n");

   for ( i = 0; i < 3; i++ ) {
       for ( j=0; j < 3; j++ ) {
        getrandomvalue =  rand() % (50);
        a[i][j] = getrandomvalue;
            printf("\n A[%i][%i]: %i ,", i, j, a[i][j]);
        getrandomvalue = 0;
        getrandomvalue =  rand() % (30);
        b[i][j] = getrandomvalue;
            printf("B[%i][%i]: %i \n", i, j, b[i][j]);
        getrandomvalue = 0;
	}
   }
   i = 0;
   j = 0;
   while (i < 3 && j < 3) {
	 if (a[i][j] % 2 == 0) {
	     number = a[i][j];
	     printf("\n Numero par em A[%i][%i]: %i", i, j, number);
        sum = sum + number;
	 }
	 if (b[i][j] % 2 == 0) {
	     number = b[i][j];
	         printf("\n Numero par em B[%i][%i]: %i", i, j, number);
        sum = sum + number;
	 }
	 i++;
	 j++;
	}
    printf("\n Soma: %i", sum);
return 0;
}
