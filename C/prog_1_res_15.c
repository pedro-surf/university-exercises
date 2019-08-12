// FILE: prog_1_res_15.c
// TITLE: exercise 15
// AUTHOR: Pedro Silveira
//       Exercises
// FOR COURSE: Programming I
// DUE DATE:    March, 2019
//
// PURPOSE:
//       Basic exercises program for calculating five students grade's average.
//
// OVERALL METHOD:
//       Thes list of general tasks is:
// 1. Receive grades
// 2. Calculate :D 
// 3. Return count of approved and disapproved students as well as approved's average.
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
    float grade;
    float average;
    float total = 0;
    float i = 0;
    int input;
    int students = 5;
    int aprovados = 0;
    int reprovados = 0;

      while (i < students) {
          printf("Digite as notas");
            scanf("%i", &input);
            if ( (input < 0) || (input > 10) ) {
            printf("Nota invalida");
            }
            else {grade = input;}
            if ( input >= 6) {
                    aprovados++;
                    total = total + input;
            }
            else { reprovados++; }
            i++;


        }
        average = (total / students);
         printf("estudantes aprovados: %d \n", aprovados);
          printf("estudantes reprovados: %d \n", reprovados);
        printf("media dos aprovados: %f \n", average);
    }

