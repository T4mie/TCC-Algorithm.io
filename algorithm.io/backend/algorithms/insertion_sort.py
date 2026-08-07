import copy


class InsertionSort:
    """Encapsula a lógica de Insertion Sort e a geração de passos para animação.

    A classe não altera o estado do vetor original diretamente. Em vez disso,
    ela trabalha sobre uma cópia dos nós e produz um histórico de passos
    (`steps`) que a interface utiliza para renderizar a animação.
    """

    def __init__(self, vector):
        # Mantemos referência ao vetor original, mas operamos sobre
        # uma cópia profunda dos nós para não alterar o estado do
        # `storageVector` antes de termos todos os steps registrados.
        self.vector = vector
        self.original_nodes = copy.deepcopy(vector.nodes)
        self.nodes = copy.deepcopy(vector.nodes)
        self.steps = []

    def capture_state(self, comparing_indices=None, swapped_indices=None, key_value=None, code_id=None,
                       i_value=None, j_value=None):
        """Captura o estado atual do vetor para animação

        Agora aceita `code_id` indicando qual linha do pseudocódigo/implementação
        corresponde a este passo — isso permite highlight 1:1 no CodeView.

        `i_value`/`j_value` expõem os índices de controle do laço (mesmo
        princípio do `top` na pilha), para o painel de variáveis importantes
        do frontend (n, i, j, chave).
        """
        state = {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.vector.edges],
            "comparing": comparing_indices or [],
            "swapped": swapped_indices or [],
            "activeKey": key_value,
            "code_id": code_id,
            "n": len(self.nodes),
            "iValue": i_value,
            "jValue": j_value
        }
        return state
        
    def sort(self):
        """Insertion sort atualizado: inclui espaços vazios na ordenação e mapeia 100% dos steps"""
        
        # Estado inicial do algoritmo para animação.
        # A depuração de valores diretos deve ser feita com logging externo,
        # não com prints embutidos neste método.
        
        all_indices = list(range(len(self.nodes)))
        
        if len(all_indices) <= 1:
            self.steps.append(self.capture_state(code_id='END_FUNC'))
            return self.steps

        # estado inicial
        self.steps.append(self.capture_state(code_id='SIGNATURE'))
        
        # Etapa faltante para acender a linha 'n = len(A)' (Python/Java)
        self.steps.append(self.capture_state(code_id='INIT_SIZE'))

        for i in range(1, len(all_indices)):
            key_index = all_indices[i]
            key_value = self.nodes[key_index].value

            self.steps.append(self.capture_state(code_id='INIT_LOOP', i_value=i))
            self.steps.append(self.capture_state(comparing_indices=[i], key_value=key_value, code_id='SET_KEY', i_value=i))

            j = i - 1

            self.steps.append(self.capture_state(code_id='INIT_I', key_value=key_value, i_value=i, j_value=j))

            # Usamos while True para garantir que o WHILE_COND seja capturado
            # MESMO quando a condição j >= 0 falhar.
            # ... (seu código antes do while)
            while True:
                # Dispara o highlight na linha do while
                self.steps.append(self.capture_state(comparing_indices=[j] if j >= 0 else [], key_value=key_value, code_id='WHILE_COND', i_value=i, j_value=j))

                if j < 0:
                    break

                current_index = all_indices[j]
                current_value = self.nodes[current_index].value

                # --- INÍCIO DA COMPARAÇÃO BLINDADA ---
                is_current_greater = False

                if current_value is None and key_value is not None:
                    is_current_greater = True
                elif current_value is not None and key_value is not None:
                    try:
                        # Tenta converter explicitamente para número (trata "14" > "9")
                        is_current_greater = float(current_value) > float(key_value)
                    except (ValueError, TypeError):
                        # Fallback seguro: se não for número, compara como string
                        is_current_greater = str(current_value) > str(key_value)
                # --- FIM DA COMPARAÇÃO BLINDADA ---

                if is_current_greater:
                    shift_target = all_indices[j + 1]
                    self.nodes[shift_target].value = current_value

                    # Agora SIM o SHIFT e DECREMENT_I serão marcados
                    self.steps.append(self.capture_state(swapped_indices=[j + 1], key_value=key_value, code_id='SHIFT', i_value=i, j_value=j))
                    self.steps.append(self.capture_state(key_value=key_value, code_id='DECREMENT_I', i_value=i, j_value=j))
                    j -= 1
                else:
                    break

            insert_target = all_indices[j + 1]
            self.nodes[insert_target].value = key_value
            self.steps.append(self.capture_state(key_value=None, code_id='INSERT', i_value=i, j_value=j))

        # passo final
        self.steps.append(self.capture_state(comparing_indices=[], swapped_indices=[], key_value=None, code_id='END_FUNC'))

        # Não mutamos `storageVector` aqui — apenas retornamos os steps
        # gerados a partir da cópia. A aplicação do estado final no storage
        # deve ser uma ação explícita, se desejada.
        return self.steps

    def final_state(self):
        """Retorna o estado final (nodes/edges) calculado pela cópia

        Útil para o servidor retornar o estado final ao cliente sem
        modificar o `storageVector` global.
        """
        return {
            "nodes": [n.to_dict() for n in self.nodes],
            "edges": [e.to_dict() for e in self.vector.edges]
        }