export const arrayRemoveJavaLines = [
  { id: 'SIGNATURE', text: 'public int remove(int indice) {' },
  { id: 'CHECK_INDEX', text: '    if (indice < 0 || indice >= tamanho) {' },
  { id: 'INVALID_INDEX', text: '        throw new RuntimeException("Índice inválido");' },
  { id: 'END_CHECK_INDEX', text: '    }' },
  { id: 'READ_VALUE', text: '    int valor = vetor[indice];' },
  { id: 'INIT_I', text: '    int i = indice;' },
  { id: 'WHILE_COND', text: '    while (i < tamanho - 1) {' },
  { id: 'SHIFT_LEFT', text: '        vetor[i] = vetor[i + 1];' },
  { id: 'INCREMENT_I', text: '        i++;' },
  { id: 'END_WHILE', text: '    }' },
  { id: 'CLEAR_LAST', text: '    vetor[tamanho - 1] = null;' },
  { id: 'DECREMENT_SIZE', text: '    tamanho--;' },
  { id: 'END_FUNC', text: '    return valor;' },
  { id: 'END_FUNC_BRACE', text: '}' }
];
