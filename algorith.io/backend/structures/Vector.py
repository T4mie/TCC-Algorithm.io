from models.node import Node
from models.edge import Edge

class Vector:
    def __init__(self):
        self.nodes = []
        self.edges = []

    def create_vector(self, size, position=None):
        if len(self.nodes) != 0:
            self.nodes.clear()
            self.edges.clear()

        for i in range(size):
            node = Node(value=None, position=position, label=None, node_type=None, node_id=str(i))
            self.nodes.append(node)
        
        for j in range(len(self.nodes) - 1):
            self.nodes[j].next = self.nodes[j+1].id
            self.edges.append(Edge(self.nodes[j].id, self.nodes[j+1].id, "next"))
            
        return self.nodes
            
    def insert_value(self,node_id,value):
        self.nodes[int(node_id)].value = value
        
    def read_value(self,node_id):
        return self.nodes[int(node_id)].value

    def to_dict(self):
        return {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.edges]
        }
        
# Não utilizar por enquanto

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
