// FILE: 9.c
// LIST: first
// EXERCISE NUMBER: 9
// AUTHOR: Pedro Silveira
// PURPOSE:
// criar um segundo vetor contendo os valores repetidos de um primeiro vetor
// OVERALL METHOD:
// Initiate vectors, compare and push to 2nd vector if not repeated
#include <stdio.h>
int main()
{
	int vector[10] = { 1, 3, 7, 3, 8, 2, 1, 10, 9, 0};
	int repeatedvalues[5] = { 0 };
	int i, j;
	int k = 0;
	//print vector values
	for (i = 0; i < 10; i++) {printf("Vector[%i]: %i \n", i, vector[i]);}
	//iterate through vector looking for repeated values
	for (i = 0; i < 9; i++) {
	 for (j = i+1; j < 10; j++) {
		if ((vector[i] == vector[j]) && (repeatedvalues[k] == 0)) {	   
				repeatedvalues[k] = vector[i]; 
				printf("\nAdded repeated num to position %i (value: %i)", k, vector[i]);
				k++;
		}
	}
   }
for (k = 0; k < 5; k++) {printf("\nRepeated Values[%i]: %i", k, repeatedvalues[k]);}
printf("\n \nEnd !\n");
return 0;
}
