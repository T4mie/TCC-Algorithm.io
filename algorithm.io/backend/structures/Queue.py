from models.node import Node
from models.nodeList import ListNode
from models.edge import Edge


class Queue:
    """Representa uma fila em memória usando um modelo semelhante ao SLL."""

    def __init__(self):
        """Inicializa uma fila vazia."""
        self.nodes = {}
        self.edges = []
        self.head = None
        self.tail = None
        self.size = 0
        self.node_counter = 0
        self.list_node = ListNode(head=None, tail=None, size=0, label="Fila")

    def clear(self):
        """Reseta a fila para o estado inicial, como se nunca tivesse sido usada."""
        self.nodes = {}
        self.edges = []
        self.head = None
        self.tail = None
        self.size = 0
        self.node_counter = 0
        self.list_node = ListNode(head=None, tail=None, size=0, label="Fila")

    def enqueue(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        """Insere um novo nó no final da fila e atualiza head/tail/size e as
        edges correspondentes. Retorna o nó criado."""
        new_id = f"q{self.node_counter}"
        self.node_counter += 1
        node = Node(value, position=position, label=label, node_type=node_type, node_id=new_id, metadata=metadata)

        is_first_node = self.head is None

        if self.tail is not None:
            previous_node = self.nodes[self.tail]
            previous_node.next = node.id
            self.edges.append(Edge(self.tail, node.id, "next"))

        if self.head is None:
            self.head = node.id

        self.nodes[node.id] = node
        self.tail = node.id
        self.size += 1

        # Atualizar o objeto Fila
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)

        # Se é o primeiro nó, criar edges do list_node para head e tail
        if is_first_node:
            self.edges.append(Edge("list", node.id, "head"))
            self.edges.append(Edge("list", node.id, "tail"))
        else:
            # Atualizar a edge do tail para o novo nó
            self.edges = [
                e for e in self.edges
                if not (e.source == "list" and e.type == "tail")
            ]
            self.edges.append(Edge("list", node.id, "tail"))

        return node

    def dequeue(self):
        """Remove e retorna o nó do início da fila, atualizando head/tail/size
        e as edges correspondentes. Levanta `ValueError` se a fila estiver
        vazia."""
        if self.head is None:
            raise ValueError("A fila está vazia")

        removed_id = self.head
        removed_node = self.nodes.pop(removed_id)

        # Novo head
        self.head = removed_node.next
        self.size -= 1

        # Remove todas as edges relacionadas ao nó removido
        self.edges = [
            e for e in self.edges
            if e.source != removed_id and e.target != removed_id
        ]

        if self.head is None:
            self.tail = None
            # Fila vazia: remove qualquer edge de head/tail remanescente
            self.edges = [
                e for e in self.edges
                if not (e.source == "list" and e.type in ("head", "tail"))
            ]
        else:
            # Atualiza a edge "head"
            self.edges = [
                e for e in self.edges
                if not (e.source == "list" and e.type == "head")
            ]
            self.edges.append(
                Edge("list", self.head, "head")
            )

            # Atualiza a edge "tail"
            self.edges = [
                e for e in self.edges
                if not (e.source == "list" and e.type == "tail")
            ]
            self.edges.append(
                Edge("list", self.tail, "tail")
            )

        # Atualizar o objeto Fila
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)

        return removed_node

    def to_dict(self):
        """Serializa a fila para o formato consumido pelo frontend, com os
        nós ordenados a partir do head (nó de metadata incluído primeiro)."""
        ordered_nodes = [self.list_node.to_dict()]
        current_id = self.head
        seen = set()

        while current_id and current_id in self.nodes and current_id not in seen:
            node = self.nodes[current_id]
            ordered_nodes.append(node.to_dict())
            seen.add(current_id)
            current_id = node.next

        for node in self.nodes.values():
            if node.id not in seen:
                ordered_nodes.append(node.to_dict())

        return {
            "nodes": ordered_nodes,
            "edges": [edge.to_dict() for edge in self.edges]
        }
