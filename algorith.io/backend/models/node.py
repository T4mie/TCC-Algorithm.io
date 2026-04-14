import uuid

#criação do nó
class Node:
    def __init__(self, value, position=None, label=None, node_type=None, node_id=None):
        self.id = node_id if node_id else str(uuid.uuid4())
        self.value = value
        self.next = None  # Ponteiro para o próximo nó (None = último nó)
        self.position = position or {"x": 0, "y": 0}  # Posição no ReactFlow
        self.label = label or value  # Label para exibição
        self.type = node_type or "default"  # Tipo de nó (input, output, default)
    
    def to_dict(self): #cria o objeto
        return{
            "id": self.id,
            "value": self.value,
            "next": self.next,
            "position": self.position,
            "label": self.label,
            "type": self.type,
            "data": {"label": self.label}
        }