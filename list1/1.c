// FILE: prog_1_res_15.c
// EXERCISES LIST: first
// EXERCISE NUM: 1
// AUTHOR: Pedro Silveira
//
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
//
// PURPOSE:
//       The list of general tasks is:
//      Programa recebe as escolhas dos 10 eleitores e calcula os votos para 5 candidatos.
// 	Modifique programa permitindo:
// 	receber a quantidade de votos a ser analisada
// 	receber os votos para 7 candidatos
// 	calcular a percentagem de votos de cada candidato e votos nulos

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


int main()
{
	int el;
	int i, j;
	int votedcandidate;
	int votedindex, arrayindex;
// Inicializando o vetor c onde cada candidato ocupa uma posiçao para até 7 candidatos
	int c[7] = { 0 };
	 printf("Digite o número de eleitores ");
	 scanf("%i", &el);
// Conta os votos para cada candidato
	for (i = 1; i <= el; i++) {
	   printf("Selecione o numero do candidato  para o eleitor nro: %i ", i);
	   scanf("%i", &votedcandidate);
	   while (votedcandidate > 7 || votedcandidate < 1) {
	        printf("Candidato inválido \n");
		  printf("Selecione o numero do candidato de 1 até 5 para o eleitor nro: %i ", i);
	        scanf("%i", &votedcandidate);
	   }
	   votedindex = votedcandidate - 1;
	   c[votedindex]++;
	   votedcandidate = 0;
	   

 	}
 	for ( j = 1; j < 8; j++ ) {
		arrayindex = j-1;
 	 printf("\n Candidato %i :", j);
 	 int indexcount = c[arrayindex];
 	 printf("Votos: %i \n", indexcount);
		
 	 }
	return 0;
    }

