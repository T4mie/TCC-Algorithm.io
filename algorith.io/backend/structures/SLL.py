from models.node import Node
from models.nodeList import ListNode
from models.edge import Edge

class SLL:
    def __init__(self):
        
        self.nodes = {}
        self.edges = []
        if len(self.nodes) != 0:
            self.nodes.clear()
            self.edges.clear()
        self.head = None
        self.tail = None
        self.size = 0
        self.node_counter = 0
        self.list_node = ListNode(head=None, tail=None, size=0)
        

    def add_node_last(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        new_id = f"n{self.node_counter}"
        self.node_counter += 1
        node = Node(value, position=position, label=label, node_type=node_type, node_id=new_id, metadata=metadata)

        is_first_node = self.head is None

        if self.tail is not None:
            previous_node = self.nodes[self.tail]
            previous_node.next = node.id
            self.edges.append(Edge(self.tail, node.id, "next"))

        if self.head is None:
            self.head = node.id

        self.nodes[node.id] = node
        self.tail = node.id
        self.size += 1

        # Atualizar o objeto Lista
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)
        
        # Se é o primeiro nó, criar edges do list_node para head e tail
        if is_first_node:
            self.edges.append(Edge("list", node.id, "head"))
            self.edges.append(Edge("list", node.id, "tail"))
        else:
            # Atualizar a edge do tail para o novo nó
            self.edges = [e for e in self.edges if not (e.source == "list" and e.type == "tail")]
            self.edges.append(Edge("list", node.id, "tail"))

        return node

    def add_node_first(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        new_id = f"n{self.node_counter}"
        self.node_counter += 1
        node = Node(value, position=position, label=label, node_type=node_type, node_id=new_id, metadata=metadata)

        is_first_node = self.head is None

        if self.head is not None:
            first_node = self.nodes[self.head]
            node.next = first_node.id
            self.edges.append(Edge(node.id, first_node.id, "next"))

        if self.tail is None:
            self.tail = node.id

        self.nodes[node.id] = node
        self.head = node.id
        self.size += 1

        # Atualizar o objeto Lista
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)

        # Se é o primeiro nó, criar edges do list_node para head e tail
        if is_first_node:
            self.edges.append(Edge("list", node.id, "head"))
            self.edges.append(Edge("list", node.id, "tail"))
        else:
            # Atualizar a edge do head para o novo nó
            self.edges = [e for e in self.edges if not (e.source == "list" and e.type == "head")]
            self.edges.append(Edge("list", node.id, "head"))

        return node

    def to_dict(self):
        ordered_nodes = [self.list_node.to_dict()]  # Incluir o objeto Lista primeiro
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
        
        self.size -= 1
        
        # Atualizar o objeto Lista
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)
