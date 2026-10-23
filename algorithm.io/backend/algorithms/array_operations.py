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
        """Insere `value` no índice informado.

        O vetor aceita qualquer índice válido dentro da capacidade. Se o slot
        já estiver ocupado, ele é substituído; se estiver vazio, o valor é
        inserido sem exigir contiguidade. Overflow só acontece quando todos os
        slots estão preenchidos e o índice informado está vazio, o que não é
        possível ao substituir um valor repetido no mesmo slot.
        """
        capacity = len(self.nodes)

        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(code_id='CHECK_INDEX'))
        if index < 0 or index >= capacity:
            self.steps.append(self.capture_state(code_id='INVALID_INDEX'))
            raise ValueError("Índice inválido")

        self.steps.append(self.capture_state(
            highlighted=[capacity - 1] if capacity > 0 else [], code_id='CHECK_FULL'
        ))

        if self.nodes[index].value is not None:
            self.steps.append(self.capture_state(highlighted=[index], active_value=value, code_id='REPLACE_VALUE'))
            self._write_slot(index, value)
            self.steps.append(self.capture_state(highlighted=[index], active_value=value, code_id='SET_VALUE'))
            self.size = sum(1 for node in self.nodes if node.value is not None)
            self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
            return self.steps

        if all(node.value is not None for node in self.nodes):
            self.steps.append(self.capture_state(code_id='OVERFLOW'))
            raise ValueError("Vetor cheio (Overflow)")

        self.steps.append(self.capture_state(highlighted=[index], active_value=value, code_id='SET_VALUE'))
        self._write_slot(index, value)
        self.size = sum(1 for node in self.nodes if node.value is not None)
        self.steps.append(self.capture_state(active_value=value, code_id='INCREMENT_SIZE'))
        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def remove_at(self, index):
        """Remove o valor da posição `index`.

        Como o vetor admite lacunas, a remoção é feita diretamente no slot
        indicado, sem deslocar o restante dos elementos. Se o índice estiver
        fora do alcance ou o slot estiver vazio, ele é inválido.
        """
        capacity = len(self.nodes)
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(code_id='CHECK_INDEX'))
        if index < 0 or index >= capacity or self.nodes[index].value is None:
            self.steps.append(self.capture_state(code_id='INVALID_INDEX'))
            raise ValueError("Índice inválido")

        value = self.nodes[index].value
        self.steps.append(self.capture_state(highlighted=[index], active_value=value, code_id='READ_VALUE'))

        self._write_slot(index, None)
        self.steps.append(self.capture_state(highlighted=[index], active_value=value, code_id='CLEAR_LAST'))

        self.size = sum(1 for node in self.nodes if node.value is not None)
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
