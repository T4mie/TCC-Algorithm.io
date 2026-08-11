class Edge:
    """Representa uma ligação (aresta) entre dois nós, usada pelo frontend
    (React Flow) para desenhar as conexões entre elementos das estruturas."""

    def __init__(self, source_id, target_id, edge_type="next"):
        """Cria uma edge de `source_id` para `target_id` com o tipo informado
        (ex.: 'next', 'head', 'tail')."""
        self.source = source_id
        self.target = target_id
        self.type = edge_type

    def to_dict(self):
        """Serializa a edge para o formato consumido pelo frontend."""
        return {
            "source": self.source,
            "target": self.target,
            "type": self.type
        }
