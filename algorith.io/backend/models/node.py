import uuid

class Node:
    def __init__(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        self.id = node_id if node_id else str(uuid.uuid4())
        self.value = value
        self.position = position
        self.label = label if label is not None else str(value)
        self.type = node_type if node_type is not None else "default"
        self.metadata = metadata or {}
        self.next = None

    def to_dict(self):
        return {
            "id": self.id,
            "value": self.value,
            "position": self.position,
            "label": self.label,
            "type": self.type,
            "metadata": self.metadata,
            "next": self.next
        }
