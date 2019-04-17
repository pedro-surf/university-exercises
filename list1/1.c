// FILE: 1.c
// LIST:  first
// EXERCISE NUMBER: 1
// AUTHOR: Pedro Silveira
// FOR COURSE: Programming I
// DUE DATE:    April, 2019
// PURPOSE:
//      Programa recebe as escolhas dos 10 eleitores e calcula os votos para 5 candidatos.
// 	Modifique programa permitindo:
// 	receber a quantidade de votos a ser analisada
// 	receber os votos para 7 candidatos
// 	calcular a percentagem de votos de cada candidato e votos nulos
// OVERALL METHOD:
// 1. Receive votes from {{el}} electors
// 2. Add votes for matching selected candidate
// 3. Return count of votes for each candidate
//
// FUNCTIONS: inside main func
//  INCLUDED FILES:
//  stdio.h
// DATA FILES: none
#include <stdio.h>

int main()
{
	int i, el, votedcandidate;
	int votedindex, arrayindex;
// Inicializando o vetor c onde cada candidato ocupa uma posiçao para até 7 candidatos
	int c[7] = { 0 };
	 printf("Digite o número de eleitores ");
	 scanf("%i", &el);
// Conta os votos para cada candidato
	for (i = 1; i <= el; i++) {
	   printf("eleitor %i : Selecione o numero do seu candidato :: ", i);
	   scanf("%i", &votedcandidate);
	   while (votedcandidate > 7 || votedcandidate < 1) {
	        printf("Candidato inválido \n");
		  printf(" eleitor %i : Selecione o numero do seu candidato :: ", i);
	        scanf("%i", &votedcandidate);
	   }
	   votedindex = votedcandidate - 1;
	   c[votedindex]++;
	   votedcandidate = 0;
 	}
 	for ( i = 1; i < 8; i++ ) {
		arrayindex = i-1;
		if (c[arrayindex] > 0) {
 	 printf("\n Candidato %i :", i);
 	 printf("Votos: %i \n", c[arrayindex]);	
		}
 	 }
	return 0;
    }

