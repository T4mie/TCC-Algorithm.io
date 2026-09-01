import copy


class MergeSort:
    """Encapsula a lógica de Merge Sort e a geração de passos para animação.

    Diferente do Insertion Sort (in-place, poucas variáveis de controle), o
    Merge Sort é recursivo e usa um buffer auxiliar para mesclar duas
    metades já ordenadas. Cada passo capturado carrega, além do vetor
    completo, os limites `left`/`mid`/`right` da chamada atual (para desenhar
    a divisão recursiva) e o conteúdo do buffer de mesclagem (`leftArr`/
    `rightArr`) com os ponteiros `i`/`j`/`k` sendo comparados.
    """

    def __init__(self, vector):
        """Inicializa o sorter a partir de um `Vector`, copiando seus nós
        para não alterar o `storageMergeSort` original antes de termos todos
        os passos registrados."""
        self.vector = vector
        self.nodes = copy.deepcopy(vector.nodes)
        self.steps = []

    def capture_state(self, left=None, right=None, mid=None, left_arr=None, right_arr=None,
                       i=None, j=None, k=None, highlighted=None, code_id=None):
        """Captura o estado atual do vetor e da chamada de recursão/mesclagem
        em andamento para um passo da animação, associado à linha `code_id`
        do CodeView."""
        return {
            "nodes": [node.to_dict() for node in self.nodes],
            "edges": [edge.to_dict() for edge in self.vector.edges],
            "n": len(self.nodes),
            "left": left,
            "right": right,
            "mid": mid,
            "leftArr": left_arr,
            "rightArr": right_arr,
            "i": i,
            "j": j,
            "k": k,
            "highlighted": highlighted or [],
            "code_id": code_id
        }

    @staticmethod
    def _is_le(a, b):
        """Compara dois valores tratando `None` (posições ainda vazias do
        vetor) como o maior valor possível, para que fiquem sempre ao final
        — mesma convenção usada pelo InsertionSort."""
        if a is None:
            return b is None
        if b is None:
            return True
        try:
            return float(a) <= float(b)
        except (TypeError, ValueError):
            return str(a) <= str(b)

    def sort(self):
        """Executa o Merge Sort sobre a cópia dos nós, registrando um passo
        por chamada de divisão e por etapa da mesclagem."""
        n = len(self.nodes)
        if n <= 1:
            self.steps.append(self.capture_state(left=0, right=max(n - 1, 0), code_id='DONE'))
            return self.steps

        self._merge_sort(0, n - 1)
        self.steps.append(self.capture_state(left=0, right=n - 1, highlighted=list(range(n)), code_id='DONE'))
        return self.steps

    def _merge_sort(self, left, right):
        """Divide recursivamente o intervalo `[left, right]` até restarem
        subintervalos de um único elemento, depois mescla cada par de metades."""
        self.steps.append(self.capture_state(
            left=left, right=right, highlighted=list(range(left, right + 1)), code_id='CALL'
        ))

        self.steps.append(self.capture_state(left=left, right=right, code_id='CHECK_BASE'))
        if left >= right:
            self.steps.append(self.capture_state(left=left, right=right, highlighted=[left], code_id='BASE_CASE'))
            return

        mid = (left + right) // 2
        self.steps.append(self.capture_state(left=left, right=right, mid=mid, code_id='CALC_MID'))

        self.steps.append(self.capture_state(left=left, right=right, mid=mid, code_id='RECURSE_LEFT'))
        self._merge_sort(left, mid)

        self.steps.append(self.capture_state(left=left, right=right, mid=mid, code_id='RECURSE_RIGHT'))
        self._merge_sort(mid + 1, right)

        self.steps.append(self.capture_state(left=left, right=right, mid=mid, code_id='CALL_MERGE'))
        self._merge(left, mid, right)

    def _merge(self, left, mid, right):
        """Mescla as duas metades já ordenadas `[left, mid]` e `[mid+1, right]`
        de volta em `self.nodes[left..right]`, usando os buffers auxiliares
        `left_arr`/`right_arr`."""
        self.steps.append(self.capture_state(
            left=left, right=right, mid=mid,
            highlighted=list(range(left, right + 1)), code_id='MERGE_SIGNATURE'
        ))

        left_arr = [self.nodes[idx].value for idx in range(left, mid + 1)]
        self.steps.append(self.capture_state(
            left=left, right=right, mid=mid, left_arr=list(left_arr),
            highlighted=list(range(left, mid + 1)), code_id='COPY_LEFT'
        ))

        right_arr = [self.nodes[idx].value for idx in range(mid + 1, right + 1)]
        self.steps.append(self.capture_state(
            left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
            highlighted=list(range(mid + 1, right + 1)), code_id='COPY_RIGHT'
        ))

        i = j = 0
        k = left
        self.steps.append(self.capture_state(
            left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
            i=i, j=j, k=k, code_id='INIT_POINTERS'
        ))

        def write(index, value):
            self.nodes[index].value = value
            self.nodes[index].label = f"{index}: {value}" if value is not None else str(index)

        while True:
            self.steps.append(self.capture_state(
                left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                i=i, j=j, k=k, code_id='WHILE_MAIN'
            ))
            if not (i < len(left_arr) and j < len(right_arr)):
                break

            self.steps.append(self.capture_state(
                left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                i=i, j=j, k=k, code_id='COMPARE'
            ))

            if self._is_le(left_arr[i], right_arr[j]):
                write(k, left_arr[i])
                i += 1
                self.steps.append(self.capture_state(
                    left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                    i=i, j=j, k=k, highlighted=[k], code_id='TAKE_LEFT'
                ))
            else:
                write(k, right_arr[j])
                j += 1
                self.steps.append(self.capture_state(
                    left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                    i=i, j=j, k=k, highlighted=[k], code_id='TAKE_RIGHT'
                ))

            k += 1
            self.steps.append(self.capture_state(
                left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                i=i, j=j, k=k, code_id='INCREMENT_K'
            ))

        while True:
            self.steps.append(self.capture_state(
                left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                i=i, j=j, k=k, code_id='WHILE_LEFT_REMAINING'
            ))
            if i >= len(left_arr):
                break
            write(k, left_arr[i])
            i += 1
            k += 1
            self.steps.append(self.capture_state(
                left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                i=i, j=j, k=k, highlighted=[k - 1], code_id='COPY_REMAINING_LEFT'
            ))

        while True:
            self.steps.append(self.capture_state(
                left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                i=i, j=j, k=k, code_id='WHILE_RIGHT_REMAINING'
            ))
            if j >= len(right_arr):
                break
            write(k, right_arr[j])
            j += 1
            k += 1
            self.steps.append(self.capture_state(
                left=left, right=right, mid=mid, left_arr=list(left_arr), right_arr=list(right_arr),
                i=i, j=j, k=k, highlighted=[k - 1], code_id='COPY_REMAINING_RIGHT'
            ))

        self.steps.append(self.capture_state(
            left=left, right=right, mid=mid, highlighted=list(range(left, right + 1)), code_id='MERGE_DONE'
        ))

    def final_state(self):
        """Retorna o estado final (nodes/edges) calculado pela cópia, sem
        alterar o `storageMergeSort` original."""
        return {
            "nodes": [n.to_dict() for n in self.nodes],
            "edges": [e.to_dict() for e in self.vector.edges]
        }
