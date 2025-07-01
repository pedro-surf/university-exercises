# ATIVIDADE PRÁTICA - reconhecedor de estruturas em C
# onlinegdb.com/online_c_compilar

from ply import *

contexto = 0

def get_contexto():
    return contexto

# Tabela de simbolos
# {ID {valor, tipo, contexto}}
simbolos = {}


# Palavras reservadas <palavra>:<TOKEN>
reserved = {
    'if' : 'IF',
    'else' : 'ELSE',
    'int' : 'INT',
    'float' : 'FLOAT',
    'main': 'MAIN'
}

# Demais TOKENS
tokens = [
    'EQUALS', 'PLUS', 'MINUS', 'TIMES', 'DIVIDE', 'POWER',
    'LPAREN', 'RPAREN', 'LT', 'LE', 'GT', 'GE', 'NE',
    'COMMA', 'SEMI', 'INTEGER', 'FLOATN', 'STRING',
    'ID', 'SEMICOLON', 'RBRACES', 'LBRACES'
] + list(reserved.values())

t_ignore = ' \t\n'

def t_REM(t):
    r'REM .*'
    return t

# Definição de Identificador com expressão regular r'<expressão>'
def t_ID(t):
    r'[a-zA-Z][a-zA-Z0-9]*'
    t.type = reserved.get(t.value,'ID')    # Check for reserved words
    return t

t_EQUALS = r'='
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_POWER = r'\^'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_RBRACES = r'\}'
t_LBRACES = r'\{'
t_SEMICOLON = r'\;'
t_LT = r'<'
t_LE = r'<='
t_GT = r'>'
t_GE = r'>='
t_NE = r'!='
t_COMMA = r'\,'
t_SEMI = r';'
t_INTEGER = r'\d+'
t_FLOATN = r'((\d*\.\d+)(E[\+-]?\d+)?|([1-9]\d*E[\+-]?\d+))'
t_STRING = r'\".*?\"'

def t_error(t):
    print("Illegal character %s" % t.value[0])
    t.lexer.skip(1)

# Constroi o analisador léxico
lexer = lex.lex()

def p_inicio(p):
    'inicio : INT MAIN LPAREN RPAREN blocoprincipal'
    print("reconheci bloco inicial")
    print(simbolos)

def p_blocoprincipal(p):
    'blocoprincipal : LBRACES corpo RBRACES SEMICOLON'
    print("reconheci bloco principal")

def p_corpo(p):
    '''corpo : comando
              | corpo comando'''

def p_comando(p):
    '''comando : declaracoes | bloco_if | bloco_while '''

def p_operadores_comparativos(p):
    'operadores_comparativos : LT | LE | GT | GE | NE | EQUALS'

def p_declaracao_linha(p):
    '''declaracao_linha : TI operadores_comparativos values
        | tipos ID operadores_comparativos ID'''

def p_declaracoes(p):
    '''declaracoes : tipo ID SEMICOLON
                    | tipo ID EQUALS declaracoes SEMICOLON
                    | tipo declaracao_linha SEMICOLON
                    | tipo ID EQUALS values operadores_comparativos values
                    | tipo ID EQUALS ID operadores_comparativos values
                    | tipo ID EQUALS ID operadores_comparativos ID'''
    print("reconheci declaração")
    ## analise semântica:
    print(str(p))
    if(p[2] in simbolos):
        if(p[1] != simbolos[p[2]].tipo):
            print("ERRO Semantico: Tipo incompatível para a variável " + p[2] + ": " + simbolos[p[2]].tipo +" esperado, recebeu: " + p[1])
        else:
            print("ERRO Semantico: Variável " + p[2] + " já declarada")
    else:
        simbolos[p[2]] = {'valor': None, 'tipo': p[1], 'contexto':get_contexto()}
        print(str(simbolos[p[2]]))

def p_atribuicao(p):
    'atribuicao : ID EQUALS ID | ID EQUALS values | ID PLUS PLUS | ID MINUS MINUS'
    print("reconheci atribuicao")

def p_bloco_for(p):
    'for : FOR LPAREN p_condicao_for RPAREN LBRACES declaracoes RBRACES SEMICOLON'
    print("reconheci FOR")

def p_condicao_for(p):
    '''condicao_for : declaracao_linha SEMICOLON ID operadores_comparativos VALUES
        | declaracao_linha SEMICOLON VALUES operadores_comparativos ID
    '''

def p_if(p):
    'if : IF LPAREN declaracoes RPAREN LBRACES declaracoes RBRACES SEMICOLON'
    print("reconheci IF")

def p_while(p):
    'while : WHILE LPAREN declaracoes RPAREN LBRACES declaracoes RBRACES SEMICOLON'
    print("reconheci WHILE")

def p_tipos(p):
    '''tipos : INT
            | CHAR
            | FLOAT'''
    p[0] = p[1]

def p_values(p):
    '''values : INTEGER
            | STRING
            | FLOATN'''
    p[0] = p[1]


import ply.yacc as yacc
yacc.yacc()

import logging
logging.basicConfig(
    level=logging.INFO,
    filename="parselog.txt"
)

# entrada do arquivo
file = open("input.txt",'r')
data = file.read()

# string de teste como entrada do analisador léxico
lexer.input(data)

# Tokenização
for tok in lexer:
     print(tok)

yacc.parse(data, debug=logging.getLogger())
