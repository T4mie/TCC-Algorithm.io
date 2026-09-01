export const arrayInsertJavaLines = [
  { id: 'SIGNATURE', text: 'public void insert(int indice, int valor) {' },
  { id: 'CHECK_INDEX', text: '    if (indice < 0 || indice > tamanho) {' },
  { id: 'INVALID_INDEX', text: '        throw new RuntimeException("Índice inválido");' },
  { id: 'END_CHECK_INDEX', text: '    }' },
  { id: 'CHECK_FULL', text: '    if (tamanho == capacidade) {' },
  { id: 'OVERFLOW', text: '        throw new RuntimeException("Vetor cheio (Overflow)");' },
  { id: 'END_CHECK_FULL', text: '    }' },
  { id: 'INIT_I', text: '    int i = tamanho;' },
  { id: 'WHILE_COND', text: '    while (i > indice) {' },
  { id: 'SHIFT_RIGHT', text: '        vetor[i] = vetor[i - 1];' },
  { id: 'DECREMENT_I', text: '        i--;' },
  { id: 'END_WHILE', text: '    }' },
  { id: 'SET_VALUE', text: '    vetor[indice] = valor;' },
  { id: 'INCREMENT_SIZE', text: '    tamanho++;' },
  { id: 'END_FUNC', text: '}' }
];
