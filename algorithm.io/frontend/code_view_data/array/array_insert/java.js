export const arrayInsertJavaLines = [
  { id: 'SIGNATURE', text: 'public void insert(int indice, int valor) {' },
  { id: 'CHECK_INDEX', text: '    if (indice < 0 || indice >= capacidade) {' },
  { id: 'INVALID_INDEX', text: '        throw new RuntimeException("Índice inválido");' },
  { id: 'END_CHECK_INDEX', text: '    }' },
  { id: 'CHECK_FULL', text: '    if (todosOsSlotsEstaoPreenchidos() && vetor[indice] == null) {' },
  { id: 'OVERFLOW', text: '        throw new RuntimeException("Vetor cheio (Overflow)");' },
  { id: 'END_CHECK_FULL', text: '    }' },
  { id: 'REPLACE_VALUE', text: '    vetor[indice] = valor;' },
  { id: 'SET_VALUE', text: '    vetor[indice] = valor;' },
  { id: 'INCREMENT_SIZE', text: '    tamanho = contarSlotsPreenchidos();' },
  { id: 'END_FUNC', text: '}' }
];
