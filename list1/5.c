// FILE: 5.c
// LIST: first
// EXERCISE 5
// AUTHOR: Pedro Silveira      
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
// PURPOSE:
// 	Criar vetores a, b com 5 elementos do tipo int e vetor c com 10
// elementos;
// Os valores dos elementos de a e b podem ser fornecidos pelo
// usuário ou pre definidos.
// O vetor c deve conter os elementos de a e b de forma intercalada.
//
// OVERALL METHOD:
// 1. 
// 2. 
// 3. 
// FUNCTIONS: in algorithm scope
//
//  INCLUDED FILES:
//  stdio.h
//
// DATA FILES: none
#include <stdio.h>
#include <stdlib.h>


int main()
{
	int a[5], b[5];
	int c[10]; = { 0 };
	int i, getrandomvalue;
	int pairsum, pairpositionedsum = 0;
// Inicializando vetores A e B
	printf("Inicializando... \n");
   for ( i = 0; i < 5; i++ ) {
	 getrandomvalue =  rand() % (7* i);
	{ a[i], b[i] } = getrandomvalue;
	 getrandomvalue = 0;
	}

   while (j < 10) {
	 for ( i = 0; j < 5; i++ ) {
	c[j] = a[i];
	c[j+1] = b[i];
	 j+2;
	  }
	}
	
return 0;
}
