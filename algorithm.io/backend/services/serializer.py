class ReactFlowSerializer:
    """Converte uma estrutura de dados (nós + edges) para o formato esperado
    pelo React Flow no frontend."""

    @staticmethod
    def serialize(structure):
        """Serializa `structure` (que expõe `nodes` como dict e `edges` como
        lista) em um dicionário com listas de nós e edges já em `to_dict`."""
        return {
            "nodes": [
                {
                    "id": node.id,
                    "value": node.value,
                    "label": node.label,
                    "position": node.position,
                    "type": node.type,
                    "metadata": node.metadata
                }
                for node in structure.nodes.values()
            ],
            "edges": [
                edge.to_dict()
                for edge in structure.edges
            ]
        }
