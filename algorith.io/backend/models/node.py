import uuid

#criação do nó
class Node:
    def __init__(self, value):
        self.id = str(uuid.uuid4())
        self.value = value
        self.next = None  # Ponteiro para o próximo nó (None = último nó)
    
    def to_dict(self): #cria o objeto
        return{
            "id": self.id,
            "value": self.value,
            "next": self.next
        }