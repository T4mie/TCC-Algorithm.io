from models.node import Node
from models.edge import Edge


class ArrayVector:
    """Representa um vetor de capacidade fixa com tamanho lógico contíguo.

    Diferente de `Vector` (usado como scratch pad do Insertion Sort, onde
    qualquer posição pode ser preenchida isoladamente), aqui os elementos
    ocupam sempre as posições `0..size-1` de forma contígua: inserir desloca
    os elementos seguintes uma posição à direita, remover desloca os
    seguintes uma posição à esquerda.
    """

    def __init__(self):
        """Inicializa um vetor vazio (sem capacidade definida)."""
        self.nodes = []
        self.edges = []
        self.size = 0

    def clear(self):
        """Reseta o vetor para o estado inicial, como se nunca tivesse sido criado."""
        self.nodes = []
        self.edges = []
        self.size = 0

    def create_array(self, capacity, position=None):
        """Cria um vetor vazio com `capacity` posições (slots), descartando o
        conteúdo anterior. Retorna a lista de nós criados."""
        if len(self.nodes) != 0:
            self.nodes.clear()
            self.edges.clear()

        for i in range(capacity):
            node = Node(value=None, position=position, label=str(i), node_type='list', node_id=str(i))
            self.nodes.append(node)

        for j in range(len(self.nodes) - 1):
            self.edges.append(Edge(self.nodes[j].id, self.nodes[j + 1].id, "next"))

        self.size = 0
        return self.nodes

    def get_array_data_type(self):
        """Retorna o tipo de dados do vetor: 'int', 'string', ou None se vazio"""
        for node in self.nodes[:self.size]:
            if node.value is not None:
                if isinstance(node.value, int):
                    return 'int'
                elif isinstance(node.value, str):
                    return 'string'
        return None

    def to_dict(self):
        """Serializa o vetor (nós, edges e o tamanho lógico `size`) para o
        formato consumido pelo frontend."""
        return {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.edges],
            "size": self.size
        }
