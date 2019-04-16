// FILE: prog_1_res_15.c
// EXERCISES LIST: first
// EXERCISE NUM: 1
// AUTHOR: Pedro Silveira
//       
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
//
// PURPOSE:
// criar um vetor com 7 elementos
// achar o maior e sua respectiva posição
// achar o menor elemento e sua respectiva posição

//
// OVERALL METHOD:
// 1. Receive votes from {{el}} electors 
// 2. Calculate votes for each of all {{m}} candidates
// 3. Return count of approved and disapproved students as well as approved's average.
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
	int c[7];
	int i;
	int minposition;
        int max, min;
   for ( i = 0; i < 7; i++ ) {
   c[i] = rand() % 20;
   }
   for ( i = 0; i < 7; i++) {
  	if (c[i] > max) {
   	max = c[i];
  	}
  	if (c[i] < min) {
   	min = c[i];
        i = minposition;
	}
   }
	
  printf("Maior numero: %i", max);
  printf("\n Menor numero: %i", min);
  printf("\n Posiçao do menor numero no vetor: %i", minposition);
 
}
