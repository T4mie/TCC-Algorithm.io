class InsertionSort:    
    def __init__(self, vector):
        self.vector = vector
        self.nodes = vector.nodes
        self.steps = []

    def capture_state(self, comparing_indices=None, swapped_indices=None, key_value=None, code_id=None):
        """Captura o estado atual do vetor para animação

        Agora aceita `code_id` indicando qual linha do pseudocódigo/implementação
        corresponde a este passo — isso permite highlight 1:1 no CodeView.
        """
        state = {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.vector.edges],
            "comparing": comparing_indices or [],
            "swapped": swapped_indices or [],
            "activeKey": key_value,
            "code_id": code_id
        }
        return state
        
    def sort(self):
        """Insertion sort atualizado: inclui espaços vazios na ordenação"""
        
        # Pegamos TODOS os índices
        all_indices = list(range(len(self.nodes)))
        
        if len(all_indices) <= 1:
            self.steps.append(self.capture_state(code_id='END_FUNC'))
            return self.steps

        # estado inicial (assinatura / tamanho)
        self.steps.append(self.capture_state(code_id='SIGNATURE'))

        for i in range(1, len(all_indices)):
            key_index = all_indices[i]
            key_value = self.nodes[key_index].value

            # início do laço para j = 2..n (INIT_LOOP) e atribuição da chave (SET_KEY)
            self.steps.append(self.capture_state(code_id='INIT_LOOP'))
            self.steps.append(self.capture_state(comparing_indices=[i], key_value=key_value, code_id='SET_KEY'))

            j = i - 1

            # registrar i inicial
            self.steps.append(self.capture_state(code_id='INIT_I', key_value=key_value))

            while j >= 0:
                current_index = all_indices[j]
                current_value = self.nodes[current_index].value
                # condição do while / comparação
                self.steps.append(self.capture_state(comparing_indices=[j], key_value=key_value, code_id='WHILE_COND'))
                
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
                
                # DEBUG: log para verificar por que SHIFT/DECREMENT_I não aparecem
                import sys
                print(f"[DEBUG i={i} j={j}] current_value={current_value} key_value={key_value} is_current_greater={is_current_greater}", file=sys.stderr)
                
                if is_current_greater:
                    shift_target = all_indices[j + 1]
                    self.nodes[shift_target].value = current_value
                    # valor deslocado para a direita (SHIFT) e depois decremento de i
                    self.steps.append(self.capture_state(swapped_indices=[j + 1], key_value=key_value, code_id='SHIFT'))
                    self.steps.append(self.capture_state(key_value=key_value, code_id='DECREMENT_I'))
                    j -= 1
                else:
                    break
        
            insert_target = all_indices[j + 1]
            # inserir chave na posição correta
            self.nodes[insert_target].value = key_value
            self.steps.append(self.capture_state(key_value=None, code_id='INSERT'))

        # passo final
        self.steps.append(self.capture_state(comparing_indices=[], swapped_indices=[], key_value=None, code_id='END_FUNC'))
        
        return self.steps