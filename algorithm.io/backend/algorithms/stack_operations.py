import copy


class StackOperations:
    """Encapsula a lógica de push/pop de uma pilha baseada em vetor e a geração
    de passos para animação.

    Segue o mesmo princípio do InsertionSort: opera sobre uma cópia dos nós
    para não alterar o estado da `Stack` original antes de todos os passos
    terem sido registrados.
    """

    def __init__(self, stack):
        """Inicializa a operação a partir de uma `Stack`, copiando seus nós
        e o índice `top` para trabalhar isoladamente."""
        self.stack = stack
        self.nodes = copy.deepcopy(stack.nodes)
        self.top = stack.top
        self.steps = []

    def capture_state(self, highlighted=None, active_value=None, code_id=None):
        """Captura o estado atual da pilha para um passo da animação,
        associado à linha `code_id` do CodeView."""
        return {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.stack.edges],
            "top": self.top,
            "highlighted": highlighted or [],
            "activeValue": active_value,
            "code_id": code_id
        }

    def push(self, value):
        """Empilha `value` no topo, registrando um passo para cada etapa
        (checagem de overflow, incremento do topo, atribuição do valor).
        Levanta `ValueError` se a pilha estiver cheia."""
        size = len(self.nodes)

        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        candidate = self.top + 1
        self.steps.append(self.capture_state(
            highlighted=[candidate] if candidate < size else [],
            code_id='CHECK_FULL'
        ))

        if self.top == size - 1:
            self.steps.append(self.capture_state(code_id='OVERFLOW'))
            raise ValueError("Estouro de pilha (Overflow)")

        self.top += 1
        self.steps.append(self.capture_state(highlighted=[self.top], code_id='INCREMENT_TOP'))

        self.nodes[self.top].value = value
        self.nodes[self.top].label = f"{self.top}: {value}"
        self.steps.append(self.capture_state(highlighted=[self.top], active_value=value, code_id='SET_VALUE'))

        self.steps.append(self.capture_state(code_id='END_FUNC'))
        return self.steps

    def pop(self):
        """Remove e retorna o valor do topo da pilha, registrando um passo
        para cada etapa (checagem de underflow, leitura, limpeza do slot,
        decremento do topo). Levanta `ValueError` se a pilha estiver vazia."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(
            highlighted=[self.top] if self.top >= 0 else [],
            code_id='CHECK_EMPTY'
        ))

        if self.top == -1:
            self.steps.append(self.capture_state(code_id='UNDERFLOW'))
            raise ValueError("Estouro negativo (Underflow)")

        value = self.nodes[self.top].value
        self.steps.append(self.capture_state(highlighted=[self.top], active_value=value, code_id='READ_VALUE'))

        self.nodes[self.top].value = None
        self.nodes[self.top].label = str(self.top)
        self.steps.append(self.capture_state(highlighted=[self.top], active_value=value, code_id='CLEAR_VALUE'))

        self.top -= 1
        self.steps.append(self.capture_state(active_value=value, code_id='DECREMENT_TOP'))

        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def final_state(self):
        """Retorna o estado final (nodes/edges/top) calculado pela cópia,
        sem alterar a `Stack` original."""
        return {
            "nodes": [n.to_dict() for n in self.nodes],
            "edges": [e.to_dict() for e in self.stack.edges],
            "top": self.top
        }
