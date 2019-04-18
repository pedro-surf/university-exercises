// FILE: 4.c
// LIST: first
// EXERCISE 4	
// AUTHOR: Pedro Silveira      
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
// PURPOSE:
// 	Criar vetores a, b e c com 10 elementos do tipo int;
// Os valores dos elementos de a podem ser fornecidos pelo usuário
// ou pre definidos.
// O vetor b deve conter os elementos positivos de a
// O vetor c deve conter os elementos negativos de a
//
// OVERALL METHOD:
// 1. Give a array random values
// 2. Assign positive values to array b and negative values to array c
//
// FUNCTIONS: in algorithm scope
//  INCLUDED FILES: stdio.h, stdlib.h
// DATA FILES: none
#include <stdio.h>
#include <stdlib.h>


int main()
{	
	int len = 4;
	int a[len];
	int b[10], c[10] = { 0 };
	int i, inputvalue;
	int j, k = 0;
	printf("Inicializando... \n");
   for ( i = 0; i < len; i++ ) {
	printf("\n Digite valor inteiro \n");
	scanf("%i", &inputvalue);
     a[i] = inputvalue;
	printf("\n Valor assinalado à A[%i] : %i", i, inputvalue);  
    }	
    for ( i = 0; i < len; i++) {
     if (a[i] > 0) {
		while (b[k] != 0) { k++; }
		b[k] = a[i];
		 printf("\n++ vetor B[%i]:: %i", k, b[k]);	
     } else if (a[i] < 0) {
		 int getnegative = a[i];
		  while(c[j] != 0) { j++; }
		  c[j] = getnegative;
		  printf("\n-- vetor C[%i]:: %i", j, c[j]);
		 }
   }
   printf("\n \n конец (fim) =) \n");
return 0;
}
