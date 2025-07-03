# ATIVIDADE PRÁTICA - reconhecedor de estruturas em C
# onlinegdb.com/online_c_compilar

from ply import *

contexto = 0

def get_contexto():
    return contexto

# Tabela de simbolos
# {ID: {valor, tipo, contexto}}
simbolos = {}


# Palavras reservadas <palavra>:<TOKEN>
reserved = {
    'if': 'IF',
    'else': 'ELSE',
    'int': 'INT',
    'float': 'FLOAT',
    'char': 'CHAR',
    'main': 'MAIN',
    'for': 'FOR',
    'while': 'WHILE'
}

# Lista de tokens
tokens = [
    'EQUALS', 'PLUS', 'MINUS', 'TIMES', 'DIVIDE', 'POWER',
    'LPAREN', 'RPAREN', 'LT', 'LE', 'GT', 'GE', 'NE',
    'COMMA', 'SEMICOLON', 'RBRACES', 'LBRACES',
    'INTEGER', 'FLOATN', 'STRING', 'ID'
] + list(reserved.values())

# Ignorar espaços, tabs e quebras de linha
t_ignore = ' \t\r'


# Definição de Identificador com expressão regular r'<expressão>'
def t_ID(t):
    r'[a-zA-Z_][a-zA-Z0-9_]*'
    t.type = reserved.get(t.value, 'ID')
    return t

# Regras de tokens
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
t_SEMICOLON = r';'
t_LT = r'<'
t_LE = r'<='
t_GT = r'>'
t_GE = r'>='
t_NE = r'!='
t_COMMA = r','
t_FLOATN = r'((\d*\.\d+)([eE][\+-]?\d+)?|([1-9]\d*[eE][\+-]?\d+))'
t_INTEGER = r'\d+'
t_STRING = r'\".*?\"'


def t_newline(t):
    r'\n+'
    t.lexer.lineno += len(t.value)

def t_error(t):
    print(f"Illegal character '{t.value[0]}'")
    t.lexer.skip(1)

# Constroi o analisador léxico
lexer = lex.lex()

# ---------------------
# Analisador Sintático
# ---------------------

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
    '''comando : declaracoes
               | atribuicao
               | bloco_if
               | bloco_while
               | bloco_for'''

def p_operadores_comparativos(p):
    '''operadores_comparativos : LT
                               | LE
                               | GT
                               | GE
                               | NE
                               | EQUALS'''
    p[0] = p[1]

def p_declaracao_linha(p):
    '''declaracao_linha : tipo operadores_comparativos values
                        | tipo ID operadores_comparativos ID'''

def p_declaracoes(p):
    '''declaracoes : tipo ID SEMICOLON
                   | tipo ID EQUALS values SEMICOLON
                   | tipo ID EQUALS ID SEMICOLON'''
    print("reconheci declaração")
    if p[2] in simbolos:
        print(f"ERRO Semantico: Variável {p[2]} já declarada")
    else:
        simbolos[p[2]] = {'valor': None, 'tipo': p[1], 'contexto': get_contexto()}
        print(str(simbolos[p[2]]))

def p_atribuicao(p):
    '''atribuicao : ID EQUALS ID SEMICOLON
                  | ID EQUALS values SEMICOLON'''
    if p[1] not in simbolos:
        print(f"ERRO Semantico: Variável {p[1]} não declarada antes da atribuição.")
    if p[1] in simbolos and p[3] in simbolos:
        tipo_destino = simbolos[p[1]]['tipo']
        tipo_origem = simbolos[p[3]]['tipo']
        if tipo_destino != tipo_origem:
            print(f"ERRO Semantico: Tipos incompatíveis na atribuição de {p[3]} para {p[1]}: {tipo_origem} → {tipo_destino}")

    print("reconheci atribuicao")

def p_bloco_if(p):
    'bloco_if : IF LPAREN declaracoes RPAREN LBRACES corpo RBRACES SEMICOLON'
    print("reconheci IF")

def p_bloco_while(p):
    'bloco_while : WHILE LPAREN declaracoes RPAREN LBRACES corpo RBRACES SEMICOLON'
    print("reconheci WHILE")

def p_bloco_for(p):
    'bloco_for : FOR LPAREN condicao_for RPAREN LBRACES corpo RBRACES SEMICOLON'
    print("reconheci FOR")

def p_condicao_for(p):
    '''condicao_for : declaracao_linha SEMICOLON ID operadores_comparativos values
                    | declaracao_linha SEMICOLON values operadores_comparativos ID'''

def p_tipo(p):
    '''tipo : INT
            | FLOAT
            | CHAR'''
    p[0] = p[1]

def p_values(p):
    '''values : INTEGER
              | STRING
              | FLOATN
              | ID'''
    p[0] = p[1]

def p_error(p):
    if p:
        print(f"Erro de sintaxe na linha {p.lineno}, token: {p.type}, valor: {p.value}")
    else:
        print("Erro de sintaxe no final do arquivo")

parser = yacc.yacc()

# ---------------------
# Execução
# ---------------------

import logging
logging.basicConfig(
    level=logging.INFO,
    filename="parselog.txt"
)

# entrada do arquivo
with open("input_3.txt", "r") as file:
    data = file.read()

# string de teste como entrada do analisador léxico
lexer.input(data)

# Tokenização
print("Tokens:")
for tok in lexer:
     print(tok)

print("\nParsing:")
parser.parse(data, debug=logging.getLogger())
