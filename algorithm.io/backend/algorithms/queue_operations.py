import copy

from models.node import Node
from models.edge import Edge


class QueueOperations:
    """Encapsula a lógica de enqueue/dequeue de uma fila baseada em nós
    encadeados e a geração de passos para animação.

    Segue o mesmo princípio do StackOperations: opera sobre uma cópia dos
    nós/edges/list_node para não alterar o estado da `Queue` original antes
    de todos os passos terem sido registrados. Diferente da pilha (um vetor
    indexado), a fila é um dicionário de nós por id, então `highlighted`
    carrega ids de nó em vez de índices.
    """

    def __init__(self, queue):
        """Inicializa a operação a partir de uma `Queue`, copiando seu estado
        (nós, edges, head/tail/size, list_node) para trabalhar isoladamente."""
        self.nodes = copy.deepcopy(queue.nodes)
        self.edges = copy.deepcopy(queue.edges)
        self.head = queue.head
        self.tail = queue.tail
        self.size = queue.size
        self.node_counter = queue.node_counter
        self.list_node = copy.deepcopy(queue.list_node)
        self.steps = []

    def _ordered_nodes(self):
        """Percorre a cadeia a partir do head e anexa quaisquer nós órfãos
        (ex.: um nó recém-criado que ainda não foi encadeado)."""
        ordered = []
        seen = set()
        current_id = self.head
        while current_id and current_id in self.nodes and current_id not in seen:
            node = self.nodes[current_id]
            ordered.append(node)
            seen.add(current_id)
            current_id = node.next

        for node in self.nodes.values():
            if node.id not in seen:
                ordered.append(node)

        return ordered

    def capture_state(self, highlighted=None, active_value=None, code_id=None):
        """Captura o estado atual da fila (incluindo o nó de metadata) para
        um passo da animação, associado à linha `code_id` do CodeView."""
        return {
            "nodes": [self.list_node.to_dict()] + [n.to_dict() for n in self._ordered_nodes()],
            "edges": [e.to_dict() for e in self.edges],
            "highlighted": highlighted or [],
            "activeValue": active_value,
            "code_id": code_id
        }

    def enqueue(self, value, position=None, label=None):
        """Insere um novo nó no final da fila, registrando um passo para cada
        etapa (criação do nó, checagem do tail, encadeamento, atualização de
        head/tail). Retorna a lista de passos gerados."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        new_id = f"q{self.node_counter}"
        self.node_counter += 1
        node = Node(value, position=position, label=label or str(value), node_id=new_id)
        self.nodes[node.id] = node
        self.steps.append(self.capture_state(highlighted=[node.id], active_value=value, code_id='CREATE_NODE'))

        self.steps.append(self.capture_state(
            highlighted=[self.tail] if self.tail else [],
            active_value=value,
            code_id='CHECK_TAIL'
        ))

        is_first_node = self.head is None

        if self.tail is not None:
            previous_node = self.nodes[self.tail]
            previous_node.next = node.id
            self.edges.append(Edge(self.tail, node.id, "next"))
            self.steps.append(self.capture_state(
                highlighted=[previous_node.id, node.id], active_value=value, code_id='LINK_NEXT'
            ))
        else:
            self.head = node.id
            self.steps.append(self.capture_state(
                highlighted=[node.id], active_value=value, code_id='SET_HEAD'
            ))

        self.tail = node.id
        self.size += 1
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)

        if is_first_node:
            self.edges.append(Edge("list", node.id, "head"))
            self.edges.append(Edge("list", node.id, "tail"))
        else:
            self.edges = [e for e in self.edges if not (e.source == "list" and e.type == "tail")]
            self.edges.append(Edge("list", node.id, "tail"))

        self.steps.append(self.capture_state(highlighted=[node.id], active_value=value, code_id='UPDATE_TAIL'))
        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def dequeue(self):
        """Remove o nó do início da fila, registrando um passo para cada
        etapa (checagem de fila vazia, leitura do valor, avanço do head,
        remoção do nó). Levanta `ValueError` se a fila estiver vazia."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(
            highlighted=[self.head] if self.head else [],
            code_id='CHECK_EMPTY'
        ))

        if self.head is None:
            self.steps.append(self.capture_state(code_id='EMPTY'))
            raise ValueError("A fila está vazia")

        removed_id = self.head
        removed_node = self.nodes[removed_id]
        value = removed_node.value

        self.steps.append(self.capture_state(highlighted=[removed_id], active_value=value, code_id='READ_VALUE'))

        self.head = removed_node.next
        self.size -= 1

        self.steps.append(self.capture_state(
            highlighted=[self.head] if self.head else [],
            active_value=value,
            code_id='ADVANCE_HEAD'
        ))

        del self.nodes[removed_id]
        self.edges = [e for e in self.edges if e.source != removed_id and e.target != removed_id]

        if self.head is None:
            self.tail = None
            self.edges = [e for e in self.edges if not (e.source == "list" and e.type in ("head", "tail"))]
        else:
            self.edges = [e for e in self.edges if not (e.source == "list" and e.type == "head")]
            self.edges.append(Edge("list", self.head, "head"))
            self.edges = [e for e in self.edges if not (e.source == "list" and e.type == "tail")]
            self.edges.append(Edge("list", self.tail, "tail"))

        self.list_node.update(head=self.head, tail=self.tail, size=self.size)

        self.steps.append(self.capture_state(active_value=value, code_id='REMOVE_NODE'))
        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def final_state(self):
        """Retorna o estado final (nodes/edges) calculado pela cópia, sem
        alterar a `Queue` original."""
        return {
            "nodes": [self.list_node.to_dict()] + [n.to_dict() for n in self._ordered_nodes()],
            "edges": [e.to_dict() for e in self.edges]
        }
