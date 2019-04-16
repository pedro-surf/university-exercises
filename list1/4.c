// FILE: prog_1_res_15.c
// EXERCISES LIST: first
// EXERCISE NUM: 4
// AUTHOR: Pedro Silveira
//       
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
//
// PURPOSE:
// criar vetor com 10 elementos do tipo int
// achar a soma dos elementos pares
// achar a soma dos elementos que se encontram nas posições com
// índice par ( c[0], c[2], c[4])


//
// OVERALL METHOD:
// 1. Give c array random values
// 2. Get and display pair values sum
// 3. Get and display sum of values in pair indexes
//
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
	int c[10];
	int i;
	
   for ( i = 0; i < 10; i++ ) {
   c[i] = rand() % 20;
   if (c[i] % 2 == 0) {
	pairsum = pairsum + c[i];
	}
   if (i % 2 == 0) {
	pairpositionedsum = pairpositionedsum + c[i];
	}	
   }
  printf("Soma dos pares = %i \n", pairsum);
  printf("Soma dos posicionados em indice par = %i", pairpositionedsum);

	
 
}
