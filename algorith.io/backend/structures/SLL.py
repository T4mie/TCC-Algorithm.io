from models.node import Node
from models.edge import Edge
import uuid

class SLL:
    def __init__(self):
        self.nodes = {}
        self.edges = []
        self.head = None
        self.tail = None

    def _initialize_head(self, first_node):
        """Cria nós especiais head apontando para o primeiro nó"""
        head_node = Node(value="head", node_id="head", node_type="head", label="Head", position={"x": -200, "y": 0})
        
        self.nodes["head"] = head_node
        
        # head aponta para o primeiro nó
        head_node.next = first_node.id
        self.edges.append(Edge("head", first_node.id, "next"))
        

    def _initialize_tail(self, first_node):
        """Cria nó especial tail apontando para o primeiro nó"""
        tail_node = Node(value="tail", node_id="tail", node_type="tail", label="Tail", position={"x": 200, "y": 0})
        
        self.nodes["tail"] = tail_node

        # tail aponta para o primeiro nó (inicialmente)
        tail_node.next = first_node.id
        self.edges.append(Edge("tail", first_node.id, "next"))

    def add_node_last(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        node = Node(value, position=position, label=label, node_type=node_type, node_id=str(uuid.uuid4()), metadata=metadata)

        is_first_node = self.head is None

        if self.tail is not None:
            previous_node = self.nodes[self.tail]
            previous_node.next = node.id
            self.edges.append(Edge(self.tail, node.id, "next"))

        if self.head is None:
            self.head = node.id

        self.nodes[node.id] = node
        self.tail = node.id

        if is_first_node:
            self._initialize_head(node)
            self._initialize_tail(node)
        else:
            # Atualizar o nó "tail" especial para apontar para o novo nó ao final
            self.nodes["tail"].next = node.id
            # Remover a edge antiga do tail e adicionar a nova
            self.edges = [e for e in self.edges if not (e.source == "tail")]
            self.edges.append(Edge("tail", node.id, "next"))

        return node

    def add_node_first(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        node = Node(value, position=position, label=label, node_type=node_type, node_id=str(uuid.uuid4()), metadata=metadata)

        is_first_node = self.head is None

        if self.head is not None:
            first_node = self.nodes[self.head]
            node.next = first_node.id
            self.edges.append(Edge(node.id, first_node.id, "next"))

        if self.tail is None:
            self.tail = node.id

        self.nodes[node.id] = node
        self.head = node.id

        if is_first_node:
            self._initialize_head(node)
            self._initialize_tail(node)
        else:
            # Atualizar o nó "head" especial para apontar para o novo nó no início
            self.nodes["head"].next = node.id
            # Remover a edge antiga do head e adicionar a nova
            self.edges = [e for e in self.edges if not (e.source == "head")]
            self.edges.append(Edge("head", node.id, "next"))

        return node

    def to_dict(self):
        ordered_nodes = []
        current_id = self.head
        seen = set()

        while current_id and current_id in self.nodes and current_id not in seen:
            node = self.nodes[current_id]
            ordered_nodes.append(node.to_dict())
            seen.add(current_id)
            current_id = node.next

        for node in self.nodes.values():
            if node.id not in seen:
                ordered_nodes.append(node.to_dict())

        return {
            "nodes": ordered_nodes,
            "edges": [edge.to_dict() for edge in self.edges]
        }

    def get_node(self, node_id):
        return self.nodes.get(node_id)

    def get_all_nodes(self):
        return list(self.nodes.values())

    def get_all_edges(self):
        return self.edges

    def delete_node(self, node_id):
        if node_id not in self.nodes:
            raise ValueError("Nó não existe")

        node = self.nodes[node_id]
        previous_node_id = None

        for n in self.nodes.values():
            if n.next == node_id:
                previous_node_id = n.id
                break

        if self.head == node_id:
            self.head = node.next

        if previous_node_id:
            self.nodes[previous_node_id].next = node.next

        if self.tail == node_id:
            self.tail = previous_node_id

        del self.nodes[node_id]
        self.edges = [e for e in self.edges if e.source != node_id and e.target != node_id]
