class InsertionSort:    
    def __init__(self, vector):
        self.vector = vector
        self.nodes = vector.nodes
        self.steps = []

    def capture_state(self, comparing_indices=None, swapped_indices=None, key_value=None):
        """Captura o estado atual do vetor para animação"""
        state = {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.vector.edges],
            "comparing": comparing_indices or [],
            "swapped": swapped_indices or [],
            "activeKey": key_value
        }
        return state
        
    def sort(self):
        """Insertion sort atualizado: inclui espaços vazios na ordenação"""
        
        # Pegamos TODOS os índices
        all_indices = list(range(len(self.nodes)))
        
        if len(all_indices) <= 1:
            self.steps.append(self.capture_state())
            return self.steps

        self.steps.append(self.capture_state())

        for i in range(1, len(all_indices)):
            key_index = all_indices[i]
            key_value = self.nodes[key_index].value
            
            self.steps.append(self.capture_state(comparing_indices=[i], key_value=key_value))

            j = i - 1
            while j >= 0:
                current_index = all_indices[j]
                current_value = self.nodes[current_index].value
                
                self.steps.append(self.capture_state(
                    comparing_indices=[j],
                    key_value=key_value
                ))
                
                # Lógica de comparação segura contra 'None' (vazio)
                # Considerando o 'vazio' como o MAIOR valor para enviá-lo ao final.
                is_current_greater = False
                
                if current_value is None and key_value is not None:
                    # Se o valor atual é vazio e a chave é um número, o vazio é "maior" e deve ser empurrado para a direita
                    is_current_greater = True 
                elif current_value is not None and key_value is not None:
                    # Se ambos são números, compara normalmente
                    is_current_greater = current_value > key_value
                # Se key_value é None, is_current_greater continua False, pois a chave já é o "maior" possível
                
                if is_current_greater:
                    shift_target = all_indices[j + 1]
                    self.nodes[shift_target].value = current_value
                    
                    self.steps.append(self.capture_state(
                        swapped_indices=[j + 1],
                        key_value=key_value
                    ))
                    
                    j -= 1
                else:
                    break
        
            insert_target = all_indices[j + 1]
            self.nodes[insert_target].value = key_value

        self.steps.append(self.capture_state(
            comparing_indices=[], 
            swapped_indices=[], 
            key_value=None
        ))
        
        return self.steps