from models.node import Node
from models.nodeList import ListNode
from models.edge import Edge


class Queue:
    """Representa uma fila em memória usando um modelo semelhante ao SLL."""

    def __init__(self):
        self.nodes = {}
        self.edges = []
        if len(self.nodes) != 0:
                self.nodes.clear()
                self.edges.clear()
        self.head = None
        self.tail = None
        self.size = 0
        self.node_counter = 0
        self.list_node = ListNode(head=None, tail=None, size=0)

    def enqueue(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        new_id = f"q{self.node_counter}"
        self.node_counter += 1
        node = Node(value, position=position, label=label, node_type=node_type, node_id=new_id, metadata=metadata)

        if self.tail is not None:
            previous_node = self.nodes[self.tail]
            previous_node.next = node.id
            self.edges.append(Edge(self.tail, node.id, "next"))

        if self.head is None:
            self.head = node.id
        if self.size == 1:
            self.edges.append(Edge("list", node.id, "head"))
            self.edges.append(Edge("list", node.id, "tail"))
        else:
            self.edges = [
                e for e in self.edges
                if not (e.source == "list" and e.type == "tail")
            ]

            self.edges.append(
                Edge("list", node.id, "tail")
            )
        self.nodes[node.id] = node
        self.tail = node.id
        self.size += 1

        # Atualizar o objeto Lista
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)
        return node

    def dequeue(self):
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
        else:
            # Atualiza a edge "head"
            self.edges = [
                e for e in self.edges
                if not (e.source == "list" and e.type == "head")
            ]

            self.edges.append(
                Edge("list", self.head, "head")
            )

        # Atualiza também o tail caso a fila fique vazia
            self.edges = [
            e for e in self.edges
            if not (
                e.source == "list"
                and e.type == "tail"
                and self.tail is None
            )
        ]

        if self.tail:
            self.edges = [
                e for e in self.edges
                if not (e.source == "list" and e.type == "tail")
            ]
            self.edges.append(
                Edge("list", self.tail, "tail")
            )

            self.list_node.update(
                head=self.head,
                tail=self.tail,
                size=self.size
            )

        return removed_node

    def to_dict(self):
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
