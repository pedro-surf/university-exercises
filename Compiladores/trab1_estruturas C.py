# ATIVIDADE PRÁTICA - reconhecedor de estruturas em C

from ply import *

# Palavras reservadas <palavra>:<TOKEN>
reserved = {
    'if' : 'IF',
    'else' : 'ELSE',
    'for': 'FOR',
    'while': 'WHILE',
    'do': 'DO',
    'this': 'THIS',
    'typeof': 'TYPEOF',
    'keyof': 'KEYOF',
    'var': 'VARIABLE',
    'const': 'CONSTANT',
    'let': 'LET', # Variavel com escopo de bloco
    'function': 'FUNCTION',
    'async': 'ASYNC',
    'try': 'TRY',
    'catch': 'CATCH',
    'finally': 'FINALLY',
    '&&' : 'AND',
    '||': 'OR',
    '=': 'ATTRIBUTION',
    '==': 'SHALLOW_EQUALS',
    'true': 'TRUE',
    'false': 'FALSE',
    'null': 'NULL',
    'undefined': 'UNDEFINED',
    '?': 'TERNARY_IF',
    ':': 'TERNARY_ELSE',
    '&': 'BITWISE',
    '.': 'PROPERTY',
    'Object': 'OBJECT',
    'Number': 'NUMBER',
    'Boolean': 'BOOLEAN',
    'Array': 'ARRAY',
    'String': 'STRING',
    'require': 'REQUIRE',
    'from': 'FROM',
    'export': 'EXPORT',
    'import': 'IMPORT'
}

# Demais TOKENS
tokens = [
    'EQUALS', 'PLUS', 'MINUS', 'TIMES', 'DIVIDE', 'POWER',
    'LPAREN', 'RPAREN', 'LT', 'LE', 'GT', 'GE', 'NE',
    'COMMA', 'SEMI', 'INTEGER', 'FLOAT',
    'ID', 'NEWLINE', 'SEMICOLON', 'RBRACES', 'LBRACES',
    'LBRACKETS', 'RBRACKETS', 'INCREMENT', 'DECREMENT'
] + list(reserved.values())

t_ignore = ' \t'

def t_REM(t):
    r'REM .*'
    return t

# Definição de Identificador com expressão regular r'<expressão>'
def t_ID(t):
    r'[a-zA-Z][a-zA-Z0-9]*'
    t.type = reserved.get(t.value,'ID')    # Check for reserved words
    return t

t_EQUALS = r'==='
t_AND = r'\&\&'
t_OR = r'\|\|'
t_BITWISE = r'\&'
t_SHALLOW_EQUALS = r'=='
t_ATTRIBUTION = r'='
t_TERNARY_IF = r'\?'
t_TERNARY_ELSE = r'\:'
t_PROPERTY = r'\.'
t_INCREMENT = r'\+\+'
t_DECREMENT = r'--'
t_PLUS = r'\+'
t_MINUS = r'-'
t_TIMES = r'\*'
t_POWER = r'\^'
t_DIVIDE = r'/'
t_LPAREN = r'\('
t_RPAREN = r'\)'
t_RBRACES = r'\}'
t_LBRACES = r'\{'
t_RBRACKETS = r'\]'
t_LBRACKETS = r'\['
t_SEMICOLON = r'\;'
t_LT = r'<'
t_LE = r'<='
t_GT = r'>'
t_GE = r'>='
t_NE = r'!='
t_COMMA = r'\,'
t_SEMI = r';'
t_INTEGER = r'\d+'
t_FLOAT = r'((\d*\.\d+)(E[\+-]?\d+)?|([1-9]\d*E[\+-]?\d+))'
t_STRING = r'\".*?\"'

def t_NEWLINE(t):
    r'\n'
    t.lexer.lineno += 1
    pass

def t_error(t):
    print("Illegal character %s" % t.value[0])
    t.lexer.skip(1)

# Constroi o analisador léxico
lexer = lex.lex()

# string de teste
data = '''
var decorate = (this && this.decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
'''

# string de teste como entrada do analisador léxico
lexer.input(data)

# Tokenização
for tok in lexer:
     print(tok)
