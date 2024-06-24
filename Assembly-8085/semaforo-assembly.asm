; logica do jump carry:
; se reg === A, Z = 1
; se reg > A, C = 1
; senão, Z e C = 0
;
;
; Tabela display 7 segmentos do simulador 
; 0 -> 77
; 1 -> 44
; 2 -> 3E
; 3 -> 6E
; 4 -> 4D
; 5 -> 6B
; 6 -> 7B
; 7 -> 47
; 8 -> 7F 
; 9 -> 4F
;
; ESTADO
; C representará o estado atual:
; 1 -> semaforo X fechado, 3 abre
; 2 -> semaforo Y fechado, 4 abre
; 3 -> ambos fecham, 1 e 2 abrem
;
; SAÍDAS
; Pedestre: semáforo aberto quando led ativo
; Carros: semáforo fechado quando led ativo
; porta - variável
; 01 - pedestre 1
; 02 - pedestre 2
; 03 - pedestre 3
; 04 - pedestre 4
; 06 - veiculos X
; 07 - veiculos Y
;
; ENTRADAS
; porta - variável
; 01 - força a abrir pedestre 1
; 02 - força a abrir pedestre 2
; 03 - força a abrir pedestre 3
; 04 - força a abrir pedestre 4

.define

duracao		3CH ; (60 por padrão)
segundo		01H;

.org 0100H

inicio:	
		MVI B,segundo
		MVI C,01H ; semaforo carro 1
		MVI A,44H ; mostrar 2 no display 7 seg.
		OUT 00H
		MVI A,FFH ; auxiliar para acender os LEDs
		OUT 06H
		OUT 03H
		MVI A,00H ; apagar todos os outros LEDs
		OUT 01H
		OUT 02H
		OUT 04H
		OUT 07H
		MVI E,duracao

timer:	IN 01H ; rotina: variaveis de entrada - botões semaforos de pedestre
		CMP B ; (semáforo pedestre 1)
		JZ ativarPedestre1
		IN 02H ; (semáforo pedestre 2)
		CMP B
		JZ ativarPedestre2
		IN 03H ; (semáforo pedestre 3)
		CMP B
		JZ ativarPedestre3
		IN 04H ; (semáforo pedestre 4)
		CMP B
		JZ ativarPedestre4
		MOV A,E ;   setar o timer em 60, ou duracao escolhida, ou valor armazenado
		SUB B
		MOV E, A ;  armazenar o contador
		CMP B
		JNC timer 
		MOV A,C  ;   	// mover o estado atual para o acc
		CMP B
		JZ ativar2 ; se A === 1, ativar estado 2 
		CPI 03H
		JNZ ativar3 ; se A !== 3, então A = 2, ativar estado 3
		JMP inicio ; senão, A === 3, voltar para o inicio (estado 1)

ativar2:	MVI C,02H ; estado 2
			MVI E,duracao ; resetar timer
			MVI A,3EH ; mostrar 2 no display 7 seg.
			OUT 00H
			MVI A,FFH ; ligar LEDs estado 2
			OUT 07H
			OUT 04H
			MVI A,00H; resetar LEDs estado 1
			OUT 03H
			OUT 06H
			JMP timer

ativar3:	MVI C,03H  ; estado 3 (pedestres)
			MVI E,duracao
			MVI A,6EH ; mostrar 3 no display 7 seg.
			OUT 00H
			MVI A,FFH ; ligar todos LEDs
			OUT 06H
			OUT 07H ; fechar os de veiculos primeiro
			OUT 01H
			OUT 02H
			OUT 03H
			OUT 04H
			JMP timer

ativarPedestre1:
		JMP ativar3

ativarPedestre2:
		JMP ativar3

ativarPedestre3:
		JMP inicio

ativarPedestre4:
		JMP ativar2


FIM:		HLT

