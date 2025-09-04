import heapq  # usado para a fila de prioridade (priority queue)

# Movimentos possíveis do '*' (linha, coluna)
moves = {
    'up': (-1, 0),
    'down': (1, 0),
    'left': (0, -1),
    'right': (0, 1)
}

def find_distance(matrix, digit, objetivo_matrix):
    """
    Calcula a distância de Manhattan entre o dígito na matriz atual e na matriz objetivo.
    """
    current = find_digit(matrix, digit)
    objetivo = find_digit(objetivo_matrix, digit)
    if current is None or objetivo is None:
        return 0
    return abs(current[0] - objetivo[0]) + abs(current[1] - objetivo[1])

def move_blank(matrix, direction):
    """
    Move o '*' na direção especificada, se possível, e retorna a nova matriz.
    Caso não seja possível mover (borda), retorna None.
    """
    x, y = find_digit(matrix, '*')
    dx, dy = moves[direction]
    new_x, new_y = x + dx, y + dy
    # Verifica limites
    if 0 <= new_x < len(matrix) and 0 <= new_y < len(matrix[0]):
        # Faz a troca
        matrix[x][y], matrix[new_x][new_y] = matrix[new_x][new_y], matrix[x][y]
        return matrix
    return None

def find_digit(matrix, digit):
    """
    Retorna a posição (linha, coluna) de um dígito na matriz.
    """
    for i, row in enumerate(matrix):
        for j, val in enumerate(row):
            if val == digit:
                return i, j
    return None

def copy_matrix(matrix):
    """
    Cria uma cópia da matriz (lista de listas).
    """
    return [row[:] for row in matrix]


def calc_f(state, objetivo, g):
    """
    Função de avaliação f(n) = g(n) + h(n).
      - g(n): custo até o estado atual (número de movimentos)
      - h(n): soma das distâncias de Manhattan de todos os dígitos
    """
    h = sum(find_distance(state, str(d), objetivo) for d in range(1, 9))
    return g + h

def a_star_puzzle(inicio, objetivo):
    """
    Algoritmo A* para resolver o puzzle 8.
    Retorna a lista de estados desde o início até o objetivo.
    """
    heap = []
    # Inicializa a fila de prioridade com (f, g, estado, caminho)
    heapq.heappush(heap, (calc_f(inicio, objetivo, 0), 0, inicio, []))
    visited = set()

    while heap:
        # Pega o estado com menor f
        f, g, state, path = heapq.heappop(heap)

        # Se chegamos ao objetivo, retorna o caminho completo
        if state == objetivo:
            return path + [state]

        # Representa o estado como tupla imutável para guardar em "visited"
        state_tuple = tuple(tuple(row) for row in state)
        if state_tuple in visited:
            continue
        visited.add(state_tuple)

        # Expande os vizinhos (possíveis movimentos do '*')
        for direction in moves:
            new_state = move_blank(copy_matrix(state), direction)
            if new_state:
                heapq.heappush(
                    heap,
                    (
                        calc_f(new_state, objetivo, g + 1),  # f = g+h
                        g + 1,                                      # custo g
                        new_state,                                  # novo estado
                        path + [state]                              # caminho atualizado
                    )
                )

    # Se não houver solução
    return None


# --- Exemplo de uso ---
if __name__ == "__main__":
    inicio = [
        ['8', '1', '2'],
        ['7', '4', '3'],
        ['6', '*', '5']
    ]
    objetivo = [
        ['1', '2', '3'],
        ['8', '*', '4'],
        ['7', '6', '5']
    ]

    solution = a_star_puzzle(inicio, objetivo)

    if solution:
        for idx, step in enumerate(solution):
            print(f"Step {idx}:")
            for row in step:
                print(row)
            print("---")
    else:
        print("No solution found.")
