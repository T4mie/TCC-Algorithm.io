class InsertionSort:
    def __init__(self, linked_list):
        """
        Inicializa insertion sort com uma linked list
        Armazena passos para visualização em tempo real
        """
        self.linked_list = linked_list
        print("Linked list recebida para ordenação:", self.linked_list.to_dict())
        self.steps = []  # Cada step contém o estado da lista

    def get_data_nodes_only(self):
        """Retorna apenas os nós de dados (exclui head e tail)"""
        nodes = []
        
        current_id = self.linked_list.head
        print("ID inicial do head:", current_id)
        visited = set()
        
        while current_id and current_id not in visited:
            if current_id not in ["head", "tail"]:
                nodes.append(current_id)
                print(f"Nó de dados encontrado: {current_id} com valor {self.linked_list.nodes[current_id].value}")
            
            visited.add(current_id)
            print(f"Visitando nó: {current_id}, próximo ID: {self.linked_list.nodes[current_id].next if current_id in self.linked_list.nodes else 'N/A'}")
            
            if current_id in self.linked_list.nodes:
                current_id = self.linked_list.nodes[current_id].next
                print(f"Próximo ID atualizado para: {current_id}")
                
            else:
                break

        print("Capturando nós de dados para ordenação..." + str(nodes))
        return nodes

    def swap_nodes(self, node_id1, node_id2):
        """Troca os valores de dois nós mantendo seus IDs"""
        node1 = self.linked_list.nodes[node_id1]
        node2 = self.linked_list.nodes[node_id2]
        
        # Trocar valores
        node1.value, node2.value = node2.value, node1.value
        node1.label, node2.label = node2.label, node1.label

    def capture_state(self, comparing_indices=None, swapped_indices=None):
        """Captura o estado atual da lista para animação"""
        data_nodes = self.get_data_nodes_only()
        state = {
            "nodes": [],
            "edges": [],
            "comparing": comparing_indices or [],
            "swapped": swapped_indices or []
        }
        
        # Capturar nós
        current_id = self.linked_list.head
        visited = set()
        
        while current_id and current_id not in visited:
            node = self.linked_list.nodes[current_id]
            state["nodes"].append(node.to_dict())
            visited.add(current_id)
            current_id = node.next
        
        # Capturar edges
        for edge in self.linked_list.edges:
            state["edges"].append(edge.to_dict())
        
        return state

    def sort(self):
        """
        Executa insertion sort e captura cada passo para visualização
        Retorna lista de estados (frames) para animação
        """
        data_nodes = self.get_data_nodes_only()
        
        if len(data_nodes) <= 1:
            self.steps.append(self.capture_state())
            return self.steps

        # Capture estado inicial
        self.steps.append(self.capture_state())

        # Insertion sort nos nós de dados
        for i in range(1, len(data_nodes)):
            key_node_id = data_nodes[i]
            key_value = self.linked_list.nodes[key_node_id].value
            j = i - 1

            # Comparar e deslocar elementos maiores
            while j >= 0:
                current_node_id = data_nodes[j]
                current_value = self.linked_list.nodes[current_node_id].value

                # Capturar estado durante comparação
                self.steps.append(self.capture_state(
                    comparing_indices=[j, i]
                ))

                if current_value > key_value:
                    # Trocar
                    self.swap_nodes(current_node_id, key_node_id)
                    data_nodes[j], data_nodes[i] = data_nodes[i], data_nodes[j]
                    
                    # Capturar estado após swap
                    self.steps.append(self.capture_state(
                        swapped_indices=[j, i]
                    ))
                    
                    i = j
                    j -= 1
                else:
                    break

        # Capturar estado final
        self.steps.append(self.capture_state())
        
        return self.steps
