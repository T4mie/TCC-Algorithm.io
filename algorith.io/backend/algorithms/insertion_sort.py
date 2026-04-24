class InsertionSort:    
    def __init__(self, vector):
        self.vector = vector
        self.nodes = vector.nodes
        self.steps = []

    def get_data_nodes_only(self):
        """Retorna indices de nós que possuem valores"""
        return [i for i, node in enumerate(self.nodes) if node.value is not None]
    
    # def swap_nodes(self, index1, index2):
    #     """Troca os valores entre dois nós (útil para outras estruturas de dados)"""
    #     node1 = self.nodes[index1]
    #     node2 = self.nodes[index2]
    #     node1.value, node2.value = node2.value, node1.value
    #     node1.label, node2.label = node2.label, node1.label
    
    def capture_state(self, comparing_indices=None, swapped_indices=None):
        """Captura o estado atual do vetor para animação"""
        state = {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.vector.edges],
            "comparing": comparing_indices or [],
            "swapped": swapped_indices or []
        }
        return state
        
    def sort(self):
        """Insertion sort clássico: compara e desloca elementos"""
        data_indices = self.get_data_nodes_only()
        
        if len(data_indices) <= 1:
            self.steps.append(self.capture_state())
            return self.steps

        # Capture estado inicial
        self.steps.append(self.capture_state())

        # Insertion sort - elementos ordenados estão em data_indices[0..i]
        for i in range(1, len(data_indices)):
            key_index = data_indices[i]  # Indice do elemento a ser inserido
            key_value = self.nodes[key_index].value
            key_label = self.nodes[key_index].label
            
            j = i - 1
            # Comparar com elementos anteriores e deslocá-los
            while j >= 0:
                current_index = data_indices[j]
                current_value = self.nodes[current_index].value
                
                # Capturar estado durante comparação
                self.steps.append(self.capture_state(
                    comparing_indices=[j, i]
                ))
                
                if current_value > key_value:
                    # Deslocar: copiar valor de posição j para posição j+1
                    shift_target = data_indices[j + 1]
                    self.nodes[shift_target].value = current_value
                    self.nodes[shift_target].label = self.nodes[current_index].label
                    
                    # Capturar estado após deslocamento
                    self.steps.append(self.capture_state(
                        swapped_indices=[j, j + 1]
                    ))
                    
                    j -= 1
                else:
                    break
        
            # Inserir a chave na posição correta
            insert_target = data_indices[j + 1]
            self.nodes[insert_target].value = key_value
            self.nodes[insert_target].label = key_label

        # Capturar estado final
        self.steps.append(self.capture_state())
        
        return self.steps