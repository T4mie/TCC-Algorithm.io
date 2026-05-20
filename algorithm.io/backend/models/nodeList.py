class ListNode:
    """Nó especial que representa a metadata da lista ligada"""
    def __init__(self, head=None, tail=None, size=0):
        self.id = "list"
        self.value = f"N={size}"
        self.position = {"x": 200, "y": 250}
        self.label = f"Lista Ligada Simples"
        self.type = "list"
        self.head = head
        self.tail = tail
        self.size = size
        self.metadata = {
            "head": head,
            "tail": tail,
            "size": size
        }

    def to_dict(self):
        return {
            "id": self.id,
            "value": self.value,
            "position": self.position,
            "label": self.label,
            "type": self.type,
            "metadata": self.metadata
        }

    def update(self, head=None, tail=None, size=None):
        """Atualiza os valores do nó Lista"""
        if head is not None:
            self.head = head
            self.metadata["head"] = head
        if tail is not None:
            self.tail = tail
            self.metadata["tail"] = tail
        if size is not None:
            self.size = size
            self.value = f"N={size}"
            self.label = f"Lista Ligada Simples"
            self.metadata["size"] = size
