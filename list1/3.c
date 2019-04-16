// FILE: prog_1_res_15.c
// EXERCISES LIST: first
// EXERCISE NUM: 1
// AUTHOR: Pedro Silveira
//       
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
//
// PURPOSE:
// criar vetor com 10 elementos do tipo float
// calcular o valor médio dos elementos
// imprimir os elementos do vetor que estão acima da média com suas
respectivas posições.

//
// OVERALL METHOD:
// 1. Give c array random values
// 2. Calculate average
// 3. Get values above average and display them
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
	float c[10];
	float average, total = 0;
	int i;
	
   for ( i = 0; i < 10; i++ ) {
   c[i] = rand() % 20;
   total = total + c[i];
   }

   average = total / 10;
	
   printf("Elementos acima da media: \n");
  for ( i = 0; i < 10; i++ ) {
  	   if (c[i] > average) {
  		printf("Elemento nro %i: ", i);
		printf("%f:", c[i]);
  	   } 
  }
	
 
}
