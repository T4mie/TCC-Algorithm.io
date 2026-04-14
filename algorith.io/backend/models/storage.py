from models.node import Node
from models.edge import Edge

class Storage:
    def __init__(self):
        self.nodes = {}  # Dicionário: {node_id: Node}
        self.edges = []  # Lista de edges
        self.tail = None  # node_id do último nó (tail) da lista ligada
        self.head = None  # node_id do primeiro nó (head) da lista ligada

    def add_node_last(self, value, position=None, label=None, node_type=None, node_id=None):
    # Cria um novo nó e o adiciona à lista ligada
        node = Node(value, position=position, label=label, node_type=node_type, node_id=node_id)

        # Se houver um nó anterior, atualizar seu ponteiro next
        if self.tail is not None:
            # Busca no dicionário de nós a partir do node_id do tail
            # para obter atual útimo nó
            previous_node = self.nodes[self.tail]

            # seta o ponteiro next do nó anterior para o novo nó
            previous_node.next = node.id

            # Cria uma edge do nó anterior para o novo nó
            edge = Edge(self.tail, node.id, "next")
            self.edges.append(edge)

        # Adicionar no dicionario o novo nó (com next = None por padrão)
        self.nodes[node.id] = node
        # Atualizar o tail para o novo nó
        self.tail = node.id

        return node
    
    def add_node_first(self, value, position=None, label=None, node_type=None, node_id=None):
    # Cria um novo nó e o adiciona no início da lista ligada
        node = Node(value, position=position, label=label, node_type=node_type, node_id=node_id)

        # Se houver um nó na head, o novo nó aponta para ele
        if self.head is not None:
            # Busca no dicionário de nós a partir do node_id do head
            # para obter o atual primeiro nó
            first_node = self.nodes[self.head]

            # seta o ponteiro next do novo nó para o primeiro nó
            node.next = first_node.id

            # Cria uma edge do novo nó para o primeiro nó
            edge = Edge(node.id, first_node.id, "next")
            self.edges.append(edge)
        
        # Se a lista está vazia, atualizar tail também
        if self.tail is None:
            self.tail = node.id

        # Adicionar no dicionario o novo nó
        self.nodes[node.id] = node
        # Atualizar o head para o novo nó
        self.head = node.id

        return node

    def to_dict(self):
        """Retorna toda a lista ligada como dicionário"""
        return {
            "nodes": [node.to_dict() for node in self.nodes.values()],
            "edges": [edge.to_dict() for edge in self.edges]
        }

#  -- por enquanto nao utilizado ----------------------------------------------------------------------

    def get_node(self, node_id):
        """Retorna um nó específico"""
        return self.nodes.get(node_id)
    
    def get_all_nodes(self):
        """Retorna todos os nós"""
        return list(self.nodes.values())
    
    def get_all_edges(self):
        """Retorna todas as ligações"""
        return self.edges
    
    def delete_node(self, node_id):
        """Deleta um nó e suas ligações"""
        if node_id not in self.nodes:
            raise ValueError("Nó não existe")
        
        node = self.nodes[node_id]
        
        # Encontrar o nó que aponta para este (nó anterior)
        previous_node_id = None
        for n in self.nodes.values():
            if n.next == node_id:
                previous_node_id = n.id
                break
        
        # Se há nó anterior, atualizar seu ponteiro para pular o deletado
        if previous_node_id:
            self.nodes[previous_node_id].next = node.next
        
        # Se é o tail, atualizar tail
        if self.tail == node_id:
            self.tail = previous_node_id
        
        # Remove o nó
        del self.nodes[node_id]
        
        # Remove todas as edges conectadas a este nó
        self.edges = [e for e in self.edges 
                     if e.source != node_id and e.target != node_id]
    

