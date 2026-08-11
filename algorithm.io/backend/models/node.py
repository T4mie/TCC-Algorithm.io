class Node:
    """Representa um nó genérico usado pelas estruturas de dados (SLL, fila,
    pilha, vetor) e serializado para o frontend renderizar."""

    def __init__(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        """Cria um nó com `value` e metadados opcionais de exibição
        (posição, rótulo, tipo). `label` e `type` recebem valores padrão
        quando não informados."""
        self.id = node_id
        self.value = value
        self.position = position
        self.label = label if label is not None else str(value)
        self.type = node_type if node_type is not None else "default"
        self.metadata = metadata or {}
        self.next = None

    def to_dict(self):
        """Serializa o nó para o formato consumido pelo frontend."""
        return {
            "id": self.id,
            "value": self.value,
            "position": self.position,
            "label": self.label,
            "type": self.type,
            "metadata": self.metadata,
            "next": self.next
        }
