; logica do jump carry:
; se reg === A, Z = 1
; se reg > A, C = 1
; senão, Z e C = 0

.define

duracao		3CH ; (60 por padrão)
segundo		01H;
; semaforo ativo será representado no reg. C
; C representará o estado atual:
; 1 -> semaforo X fechado, 3 abre
; 2 -> semaforo Y fechado, 4 abre
; 3 -> ambos fecham, 1 e 2 abrem

.org 0100H

inicio:	MVI A,duracao
		MVI B,segundo
		MVI C,01H ; semaforo carro 1

timer:	SUB B
		CMP B
		JNC timer 
		MOV A,C
		CMP B
		JZ ativar2 ; se A === 1, ativar semáforo 2 
		CPI 03H
		JNZ ativar3 ; se A !== 3, então A = 2, ativar semáforo 3
		JMP inicio ; senão, A === 3, voltar para o inicio (semaforo 1)

ativar2:	MVI A,duracao
		MVI C,02H ; semaforo carro 2
		JMP timer

ativar3:	MVI A,duracao
		MVI C,03H  ; semaforo pedestre
		JMP timer

ativar

FIM:		HLT

