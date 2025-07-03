RECONHECEDOR DE ESTRUTURAS EM C - USANDO PLY (Python Lex-Yacc)

Projeto da disciplina de Compiladores. Implementa um compilador simples para estruturas básicas da linguagem C,
utilizando as bibliotecas `ply.lex` e `ply.yacc` em Python.

## Requisitos:
- Python 3 instalado
- Biblioteca PLY instalada (pip install ply)

## Arquivos:
- parser.py        → Código-fonte do compilador
- input_moodle.txt        → Códigos C para testar
- parselog.txt e .out     → Arquivos de log gerados pelo parser

## Como executar:
1. Certifique-se de que todos os arquivos estão no mesmo diretório.
2. Execute o comando:

    python parser.py

3. A saída mostrará os tokens reconhecidos e as mensagens de parsing e análise semântica.

➡️ Estruturas suportadas:
- Função `main()`
- Declarações de variáveis `int`, `float`, `char`
- Atribuições e comparações
- Blocos `if`, `while`, `for`

## Verificações semânticas:
  - Variável declarada duas vezes
  - Variável usada antes de ser declarada
  - Atribuições entre tipos incompatíveis  

Disponível em https://github.com/pedro-surf/university-exercises