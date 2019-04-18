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
	int a[5], b[5] = { 0 };
	int c[10] = { 0 };
	int j = 0;
	int i, getrandomvalue;

	printf("Inicializando... \n ");
   for ( i = 0; i < 5; i++ ) {
	 getrandomvalue =  rand() % 60; // obter número aleartorio
	 a[i] = getrandomvalue; // assinalar este numero à posição i do vetor a
	 c[2 * i] = a[i];
	 getrandomvalue = 0;
     getrandomvalue =  rand() % 70;
     b[i] = getrandomvalue;
     c[(2 * i) + 1] = b[i];

	}

    	for (i = 0; i < 5; i++ ) {
	printf("A[%i]: %i ", i, a[i]);
		printf("B[%i]: %i, \n ", i, b[i]);
	}
	printf("\n Vetor C com elementos intercalados: \n");
	for (j = 0; j < 10; j++ ) {
	printf("C[%i]: [%i], ", j, c[j]);
	}

return 0;
}
