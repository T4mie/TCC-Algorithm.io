class ListNode:
    """Nó especial que representa a metadata da lista ligada (ou da fila)"""

    def __init__(self, head=None, tail=None, size=0, label="Lista Simplesmente Ligada"):
        """Cria o nó de metadata com os ponteiros head/tail e o tamanho
        atual da estrutura."""
        self.id = "list"
        self.value = f"N={size}"
        self.position = {"x": 100, "y": 20}
        self.label = label
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
        """Serializa o nó de metadata para o formato consumido pelo frontend.

        `metadata` é copiado (não referenciado) para que cada passo de uma
        simulação capture um retrato independente: como `update()` muta
        `self.metadata` in-place, snapshots anteriores que guardassem a
        mesma referência passariam a exibir retroativamente o estado final.
        """
        return {
            "id": self.id,
            "value": self.value,
            "position": self.position,
            "label": self.label,
            "type": self.type,
            "metadata": dict(self.metadata)
        }

    def update(self, head=None, tail=None, size=None):
        """Atualiza os valores do nó Lista.

        head/tail são sempre sobrescritos (incluindo None, quando a
        lista/fila fica vazia) para que a metadata nunca fique presa a um
        nó que já foi removido.
        """
        self.head = head
        self.metadata["head"] = head
        self.tail = tail
        self.metadata["tail"] = tail
        if size is not None:
            self.size = size
            self.value = f"N={size}"
            self.metadata["size"] = size
