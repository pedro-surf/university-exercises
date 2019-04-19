// FILE: 11.c
// LIST: first
// EXERCISE 11
// AUTHOR: Pedro Silveira
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
// PURPOSE:
// 	criar e inicializar uma matriz A 3 x 3 e calcular sua determinante
#include <stdio.h>
#include <stdlib.h>
int main()
{
	int a[4][2] = { 0 };
	int b[2][3] = { 0 };
	int c[4][3] = { 0 };
    int getvalue = 0;
	int i, j = 0;

	printf("Inicializando... \n");
   printf("Matriz A:");
   for ( i = 0; i < 4; i++ ) {
	   printf("\n");
       for ( j=0; j < 2; j++ ) {
        getvalue =  rand() % (30);
        a[i][j] = getvalue;
            printf("| %i | ", a[i][j]);
        getvalue = 0;
	}
   }
    printf("\n Matriz B:");
      for ( i = 0; i < 2; i++ ) {
	   printf("\n");
       for ( j=0; j < 3; j++ ) {
        getvalue =  rand() % (20);
        b[i][j] = getvalue;
            printf(" | %i | ", b[i][j]);
        getvalue = 0;
	}
}
c[0][0] = (a[0][0]*b[0][0]) + (a[0][1]*b[1][0]);
c[0][1] = (a[0][0]*b[0][1]) + (a[0][1]*b[1][1]);
c[0][2] = (a[0][0]*b[0][2]) + (a[0][1]*b[1][2]);

c[1][0] = (a[1][0]*b[0][0]) + (a[1][1]*b[1][0]);
c[1][1] = (a[1][0]*b[0][1]) + (a[1][1]*b[1][1]);
c[1][2] = (a[1][0]*b[0][2]) + (a[1][1]*b[1][2]);

c[2][0] = (a[2][0]*b[0][0]) + (a[2][1]*b[1][0]);
c[2][1] = (a[2][0]*b[0][1]) + (a[2][1]*b[1][1]);
c[2][2] = (a[2][0]*b[0][2]) + (a[2][1]*b[1][2]);

c[3][0] = (a[3][0]*b[0][0]) + (a[3][1]*b[1][0]);
c[3][1] = (a[3][0]*b[0][1]) + (a[3][1]*b[1][1]);
c[3][2] = (a[3][0]*b[0][2]) + (a[3][1]*b[1][2]);
    printf("\n Matriz C produto das anteriores:");
      for ( i = 0; i < 4; i++ ) {
	   printf("\n");
       for ( j=0; j < 3; j++ ) {
            printf(" | %i | ", c[i][j]);
      
	}
}
   
return 0;
}
