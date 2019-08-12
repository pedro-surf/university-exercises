// FILE: prog_1_res_14.c
// TITLE: exercise 14
// AUTHOR: Pedro Silveira
//       Exercises
// FOR COURSE: Programming I
// DUE DATE:    March, 2019
//
// PURPOSE:
//       Basic exercises program for showing pair and multiple of 3 numbers between 0 and N (var input)
//
// OVERALL METHOD:
//       Thes list of general tasks is:
// 1. Receive input
// 2. Calculate :D 
// 3. Return numbers list
//
// FUNCTIONS: none
//
//  INCLUDED FILES:
//  stdio.h
//
// DATA FILES: none
#include <stdio.h>


int main()
{
    int i;

    int input = 1;

      while (input != 0) {
          printf("Digite o limite superior do intervalo N ou 0 para sair");
            scanf("%i", &input);
    for ( i = 0; i <= input; i++ )
    {
        if (( i % 2 == 0 ) && ( i % 3 == 0 ))
                { printf("\n i = %i, ", i); }
        }
    }
  return 0;

}
