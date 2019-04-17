// FILE: 2.c
// LIST: first
// EXERCISE NUMBER: 2
// AUTHOR: Pedro Silveira
//       
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
//
// PURPOSE:
// criar um vetor com 7 elementos
// achar o maior valor
// achar o menor elemento e sua respectiva posição

// OVERALL METHOD:
// 1. Initialize c array with 7 elements
// 2. Iterate through it and assign random values to each index
// 3. Return maximum value, minimum value and index of minimum
//
// FUNCTIONS: rand -- gets a random value, default interval call set to 70
// INCLUDED FILES: stdio.h, stdlib.h
// DATA FILES: none
#include <stdio.h>
#include <stdlib.h>

int main()
{
	int c[7] = { 0 };
	int i, randomvalue;
	int minposition, max, min;

	printf("Inicializando... \n");
   for ( i = 0; i < 7; i++ ) {
	if (c[i] == 0) {
		randomvalue = rand() % 70;
		c[i] = randomvalue;
		
	}
	min = 70;
   printf("Valor na posicao	%i: %i\n", i, c[i]);
   }
   for ( i = 0; i < 7; i++) {
  	if (c[i] > max) {
   	max = c[i];
  	}
  	if (c[i] < min) {
		min = c[i];
       minposition = i;
	 }
   }
	
  printf("\n Maior numero: %i \n Menor numero: %i ", max, min);
  printf("\n Posiçao do menor numero: %i \n \n", minposition);
  
return 0;
}
