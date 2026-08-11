export const queueDequeueJavaLines = [
  { id: 'SIGNATURE', text: 'public int dequeue() {' },
  { id: 'CHECK_EMPTY', text: '    if (head == null) {' },
  { id: 'EMPTY', text: '        throw new RuntimeException("Fila vazia");' },
  { id: 'END_CHECK_EMPTY', text: '    }' },
  { id: 'READ_VALUE', text: '    int valor = head.valor;' },
  { id: 'ADVANCE_HEAD', text: '    head = head.proximo;' },
  { id: 'REMOVE_NODE', text: '    if (head == null) { tail = null; }' },
  { id: 'END_FUNC', text: '    return valor;' },
  { id: 'END_BRACE', text: '}' }
];
