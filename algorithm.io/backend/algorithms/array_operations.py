import copy


class ArrayOperations:
    """Encapsula a lógica de inserir/remover por índice em um vetor de
    capacidade fixa, com deslocamento real dos elementos, e a geração de
    passos para animação.

    Segue o mesmo princípio do StackOperations: opera sobre uma cópia dos
    nós para não alterar o estado do `ArrayVector` original antes de todos
    os passos terem sido registrados (só é persistido quando a simulação é
    encerrada, via `/update_array`).
    """

    def __init__(self, array):
        """Inicializa a operação a partir de um `ArrayVector`, copiando seus
        nós e o tamanho lógico `size` para trabalhar isoladamente."""
        self.array = array
        self.nodes = copy.deepcopy(array.nodes)
        self.size = array.size
        self.steps = []

    def capture_state(self, highlighted=None, active_value=None, code_id=None):
        """Captura o estado atual do vetor para um passo da animação,
        associado à linha `code_id` do CodeView."""
        return {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.array.edges],
            "size": self.size,
            "highlighted": highlighted or [],
            "activeValue": active_value,
            "code_id": code_id
        }

    def _write_slot(self, index, value):
        """Escreve `value` no nó de índice `index`, atualizando seu rótulo."""
        self.nodes[index].value = value
        self.nodes[index].label = f"{index}: {value}" if value is not None else str(index)

    def insert_at(self, index, value):
        """Insere `value` na posição `index`, deslocando os elementos de
        `index..size-1` uma posição à direita. Registra um passo por etapa
        (checagem de índice, checagem de overflow, cada deslocamento,
        escrita do valor, incremento do tamanho). Levanta `ValueError` se o
        índice for inválido ou o vetor estiver cheio."""
        capacity = len(self.nodes)

        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(code_id='CHECK_INDEX'))
        if index < 0 or index > self.size:
            self.steps.append(self.capture_state(code_id='INVALID_INDEX'))
            raise ValueError("Índice inválido")

        self.steps.append(self.capture_state(
            highlighted=[capacity - 1] if capacity > 0 else [], code_id='CHECK_FULL'
        ))
        if self.size == capacity:
            self.steps.append(self.capture_state(code_id='OVERFLOW'))
            raise ValueError("Vetor cheio (Overflow)")

        i = self.size
        self.steps.append(self.capture_state(highlighted=[i] if i < capacity else [], code_id='INIT_I'))

        while i > index:
            self.steps.append(self.capture_state(highlighted=[i - 1, i], code_id='WHILE_COND'))
            self._write_slot(i, self.nodes[i - 1].value)
            self.steps.append(self.capture_state(highlighted=[i - 1, i], code_id='SHIFT_RIGHT'))
            i -= 1
            self.steps.append(self.capture_state(highlighted=[i], code_id='DECREMENT_I'))
        self.steps.append(self.capture_state(highlighted=[i], code_id='WHILE_COND'))

        self._write_slot(index, value)
        self.steps.append(self.capture_state(highlighted=[index], active_value=value, code_id='SET_VALUE'))

        self.size += 1
        self.steps.append(self.capture_state(active_value=value, code_id='INCREMENT_SIZE'))
        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def remove_at(self, index):
        """Remove o valor na posição `index`, deslocando os elementos de
        `index+1..size-1` uma posição à esquerda. Registra um passo por
        etapa (checagem de índice, leitura do valor, cada deslocamento,
        limpeza do último slot, decremento do tamanho). Levanta `ValueError`
        se o índice for inválido."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(code_id='CHECK_INDEX'))
        if index < 0 or index >= self.size:
            self.steps.append(self.capture_state(code_id='INVALID_INDEX'))
            raise ValueError("Índice inválido")

        value = self.nodes[index].value
        self.steps.append(self.capture_state(highlighted=[index], active_value=value, code_id='READ_VALUE'))

        i = index
        self.steps.append(self.capture_state(highlighted=[i], active_value=value, code_id='INIT_I'))

        while i < self.size - 1:
            self.steps.append(self.capture_state(highlighted=[i, i + 1], active_value=value, code_id='WHILE_COND'))
            self._write_slot(i, self.nodes[i + 1].value)
            self.steps.append(self.capture_state(highlighted=[i, i + 1], active_value=value, code_id='SHIFT_LEFT'))
            i += 1
            self.steps.append(self.capture_state(highlighted=[i], active_value=value, code_id='INCREMENT_I'))
        self.steps.append(self.capture_state(highlighted=[i], active_value=value, code_id='WHILE_COND'))

        self._write_slot(self.size - 1, None)
        self.steps.append(self.capture_state(highlighted=[self.size - 1], active_value=value, code_id='CLEAR_LAST'))

        self.size -= 1
        self.steps.append(self.capture_state(active_value=value, code_id='DECREMENT_SIZE'))
        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def final_state(self):
        """Retorna o estado final (nodes/edges/size) calculado pela cópia,
        sem alterar o `ArrayVector` original."""
        return {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.array.edges],
            "size": self.size
        }
