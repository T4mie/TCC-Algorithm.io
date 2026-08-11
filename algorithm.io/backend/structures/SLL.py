from models.node import Node
from models.nodeList import ListNode
from models.edge import Edge


class SLL:
    """Uma representação de lista simplesmente encadeada com nós e arestas.

    Esta classe mantém o estado da lista em memória e produz uma
    representação serializável por `to_dict` que o frontend pode consumir.
    """

    def __init__(self):
        """Inicializa uma lista encadeada vazia."""
        self.nodes = {}
        self.edges = []
        self.head = None
        self.tail = None
        self.size = 0
        self.node_counter = 0
        self.list_node = ListNode(head=None, tail=None, size=0)

    def clear(self):
        """Reseta a lista para o estado inicial, como se nunca tivesse sido usada."""
        self.nodes = {}
        self.edges = []
        self.head = None
        self.tail = None
        self.size = 0
        self.node_counter = 0
        self.list_node = ListNode(head=None, tail=None, size=0)

    def add_node_last(self, value, position=None, label=None, node_type=None, node_id=None, metadata=None):
        """Insere um novo nó no final da lista (tail) e atualiza head/tail/size
        e as edges correspondentes. Retorna o nó criado."""
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
        """Insere um novo nó no início da lista (head) e atualiza head/tail/size
        e as edges correspondentes. Retorna o nó criado."""
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
        """Serializa a lista para o formato consumido pelo frontend, com os
        nós ordenados a partir do head (nó de metadata incluído primeiro)."""
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

    def remove_first(self):
        """Remove o nó do início (head) da lista."""
        if self.head is None:
            raise ValueError("A lista está vazia")
        removed_id = self.head
        self.delete_node(removed_id)
        return removed_id

    def remove_last(self):
        """Remove o nó do final (tail) da lista."""
        if self.tail is None:
            raise ValueError("A lista está vazia")
        removed_id = self.tail
        self.delete_node(removed_id)
        return removed_id

    # ===== MÉTODOS AUXILIARES (NÃO USAR DIRETAMENTE POR ENQUANTO) =====

    def get_node(self, node_id):
        """Retorna o nó com o id informado, ou `None` se não existir."""
        return self.nodes.get(node_id)

    def get_all_nodes(self):
        """Retorna todos os nós da lista, na ordem interna do dicionário
        (não necessariamente a ordem da cadeia head -> tail)."""
        return list(self.nodes.values())

    def get_all_edges(self):
        """Retorna todas as edges da lista."""
        return self.edges

    def delete_node(self, node_id):
        """Remove o nó `node_id` da lista, reencadeando o nó anterior (se
        houver) e atualizando head/tail/size e as edges de metadata.
        Levanta `ValueError` se o nó não existir."""
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

        # Recriar as edges de head/tail apontando para os nós atuais: o nó
        # removido pode ter sido o head e/ou o tail, e a edge antiga que
        # apontava para ele já foi removida acima sem uma nova ser criada.
        self.edges = [e for e in self.edges if not (e.source == "list" and e.type in ("head", "tail"))]
        if self.head is not None:
            self.edges.append(Edge("list", self.head, "head"))
        if self.tail is not None:
            self.edges.append(Edge("list", self.tail, "tail"))

        self.size -= 1

        # Atualizar o objeto Lista
        self.list_node.update(head=self.head, tail=self.tail, size=self.size)
