from models.node import Node
from models.edge import Edge

class Stack:

    """Representa uma pilha em memória usando um modelo semelhante ao Vector."""

    def __init__(self):
        self.nodes = []
        self.edges = []
        self.top = -1

    def clear(self):
        """Reseta a pilha para o estado inicial, como se nunca tivesse sido criada."""
        self.nodes = []
        self.edges = []
        self.top = -1

    def create_stack(self, size, position=None):
        if len(self.nodes) != 0:
            self.nodes.clear()
            self.edges.clear()

        for i in range(size):
            node = Node(value=None, position=position, label=str(i), node_type='list', node_id=str(i))
            self.nodes.append(node)

        for j in range(len(self.nodes) - 1):
            self.edges.append(Edge(self.nodes[j].id, self.nodes[j+1].id, "next"))

        self.top = -1
        return self.nodes

    def get_stack_data_type(self):
        """Retorna o tipo de dados da pilha: 'int', 'string', ou None se vazia"""
        for node in self.nodes:
            if node.value is not None:
                if isinstance(node.value, int):
                    return 'int'
                elif isinstance(node.value, str):
                    return 'string'
        return None

    def to_dict(self):
        return {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.edges],
            "top": self.top
        }
