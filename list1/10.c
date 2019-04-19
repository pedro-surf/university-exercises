// FILE: 10.c
// LIST: first
// EXERCISE 10
// AUTHOR: Pedro Silveira
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
// PURPOSE:
// 	criar e inicializar uma matriz A 3 x 3 e calcular sua determinante
#include <stdio.h>
#include <stdlib.h>
int main()
{
	int a[3][3] = { 0 };
    int getvalue = 0;
	int i, j, det = 0;

	printf("Inicializando... \n");

   for ( i = 0; i < 3; i++ ) {
	   printf("\n");
       for ( j=0; j < 3; j++ ) {
        getvalue =  rand() % (50);
        a[i][j] = getvalue;
            printf("A[%i][%i]: %i ,", i, j, a[i][j]);
        getvalue = 0;
	}
   }
   det = ((a[0][0]*a[1][1]*a[2][2]) + (a[0][1]*a[1][2]*a[2][0]) + (a[0][2] * a[1][0] * a[2][1])) 
   - ((a[0][2]*a[1][1]*a[2][0])  + (a[0][0]*a[1][2]*a[2][1]) + (a[1][0]*a[0][1]*a[2][2]));
   printf("\nDeterminante = %i", det);
      printf("\nFim do programa.\n");
return 0;
}
