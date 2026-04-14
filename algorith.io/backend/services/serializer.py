class ReactFlowSerializer:
    @staticmethod
    def serialize(structure):
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
