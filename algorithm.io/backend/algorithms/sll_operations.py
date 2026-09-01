import copy

from models.node import Node
from models.edge import Edge


class SLLOperations:
    """Encapsula a lógica de inserir/remover no início e no fim de uma lista
    simplesmente ligada, e a geração de passos para animação.

    Segue o mesmo princípio do QueueOperations/StackOperations: opera sobre
    uma cópia dos nós/edges/list_node para não alterar o estado da `SLL`
    original antes de todos os passos terem sido registrados.
    """

    def __init__(self, sll):
        """Inicializa a operação a partir de uma `SLL`, copiando seu estado
        (nós, edges, head/tail/size, list_node) para trabalhar isoladamente."""
        self.nodes = copy.deepcopy(sll.nodes)
        self.edges = copy.deepcopy(sll.edges)
        self.head = sll.head
        self.tail = sll.tail
        self.size = sll.size
        self.node_counter = sll.node_counter
        self.list_node = copy.deepcopy(sll.list_node)
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
        """Captura o estado atual da lista (incluindo o nó de metadata) para
        um passo da animação, associado à linha `code_id` do CodeView."""
        return {
            "nodes": [self.list_node.to_dict()] + [n.to_dict() for n in self._ordered_nodes()],
            "edges": [e.to_dict() for e in self.edges],
            "highlighted": highlighted or [],
            "activeValue": active_value,
            "code_id": code_id
        }

    def insert_last(self, value, position=None, label=None):
        """Insere um novo nó no final da lista (tail), registrando um passo
        para cada etapa (criação do nó, checagem do tail, encadeamento,
        atualização de head/tail). Retorna a lista de passos gerados."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        new_id = f"n{self.node_counter}"
        self.node_counter += 1
        node = Node(value, position=position, label=label or str(value), node_type='SLL', node_id=new_id)
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

    def insert_first(self, value, position=None, label=None):
        """Insere um novo nó no início da lista (head), registrando um passo
        para cada etapa (criação do nó, checagem do head, encadeamento,
        atualização de head/tail). Retorna a lista de passos gerados."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        new_id = f"n{self.node_counter}"
        self.node_counter += 1
        node = Node(value, position=position, label=label or str(value), node_type='SLL', node_id=new_id)
        self.nodes[node.id] = node
        self.steps.append(self.capture_state(highlighted=[node.id], active_value=value, code_id='CREATE_NODE'))

        self.steps.append(self.capture_state(
            highlighted=[self.head] if self.head else [],
            active_value=value,
            code_id='CHECK_HEAD'
        ))

        is_first_node = self.head is None

        if self.head is not None:
            first_node = self.nodes[self.head]
            node.next = first_node.id
            self.edges.append(Edge(node.id, first_node.id, "next"))
            self.steps.append(self.capture_state(
                highlighted=[node.id, first_node.id], active_value=value, code_id='LINK_NEXT'
            ))
        else:
            self.tail = node.id
            self.steps.append(self.capture_state(
                highlighted=[node.id], active_value=value, code_id='SET_TAIL'
            ))

        self.head = node.id
        self.size += 1
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)

        if is_first_node:
            self.edges.append(Edge("list", node.id, "head"))
            self.edges.append(Edge("list", node.id, "tail"))
        else:
            self.edges = [e for e in self.edges if not (e.source == "list" and e.type == "head")]
            self.edges.append(Edge("list", node.id, "head"))

        self.steps.append(self.capture_state(highlighted=[node.id], active_value=value, code_id='UPDATE_HEAD'))
        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def remove_first(self):
        """Remove o nó do início da lista, registrando um passo para cada
        etapa (checagem de lista vazia, leitura do valor, avanço do head,
        remoção do nó). Levanta `ValueError` se a lista estiver vazia."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(
            highlighted=[self.head] if self.head else [],
            code_id='CHECK_EMPTY'
        ))

        if self.head is None:
            self.steps.append(self.capture_state(code_id='EMPTY'))
            raise ValueError("A lista está vazia")

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

    def remove_last(self):
        """Remove o nó do final da lista. Como a lista é simplesmente ligada
        (sem ponteiro para o nó anterior), é preciso percorrê-la a partir do
        head até encontrar o nó que aponta para o tail, registrando um passo
        por iteração. Levanta `ValueError` se a lista estiver vazia."""
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        self.steps.append(self.capture_state(
            highlighted=[self.tail] if self.tail else [],
            code_id='CHECK_EMPTY'
        ))

        if self.tail is None:
            self.steps.append(self.capture_state(code_id='EMPTY'))
            raise ValueError("A lista está vazia")

        removed_id = self.tail
        value = self.nodes[removed_id].value

        self.steps.append(self.capture_state(highlighted=[removed_id], active_value=value, code_id='READ_VALUE'))

        self.steps.append(self.capture_state(
            highlighted=[self.head, self.tail], active_value=value, code_id='CHECK_SINGLE'
        ))

        if self.head == self.tail:
            self.head = None
            self.tail = None
        else:
            prev = self.head
            self.steps.append(self.capture_state(highlighted=[prev], active_value=value, code_id='INIT_PREV'))

            while self.nodes[prev].next != removed_id:
                self.steps.append(self.capture_state(highlighted=[prev], active_value=value, code_id='WHILE_COND'))
                prev = self.nodes[prev].next
                self.steps.append(self.capture_state(highlighted=[prev], active_value=value, code_id='ADVANCE_PREV'))
            self.steps.append(self.capture_state(highlighted=[prev], active_value=value, code_id='WHILE_COND'))

            self.nodes[prev].next = None
            self.tail = prev
            self.steps.append(self.capture_state(highlighted=[prev], active_value=value, code_id='UPDATE_TAIL'))

        del self.nodes[removed_id]
        self.edges = [e for e in self.edges if e.source != removed_id and e.target != removed_id]
        self.edges = [e for e in self.edges if not (e.source == "list" and e.type in ("head", "tail"))]
        if self.head is not None:
            self.edges.append(Edge("list", self.head, "head"))
        if self.tail is not None:
            self.edges.append(Edge("list", self.tail, "tail"))

        if self.head is None:
            self.steps.append(self.capture_state(active_value=value, code_id='CLEAR_LIST'))

        self.size -= 1
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)

        self.steps.append(self.capture_state(active_value=value, code_id='END_FUNC'))
        return self.steps

    def final_state(self):
        """Retorna o estado final (nodes/edges) calculado pela cópia, sem
        alterar a `SLL` original."""
        return {
            "nodes": [self.list_node.to_dict()] + [n.to_dict() for n in self._ordered_nodes()],
            "edges": [e.to_dict() for e in self.edges]
        }
