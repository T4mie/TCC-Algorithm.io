export const sllRemoveFirstJavaLines = [
  { id: 'SIGNATURE', text: 'public char removeFirst() {' },
  { id: 'CHECK_EMPTY', text: '    if (head == null) {' },
  { id: 'EMPTY', text: '        throw new RuntimeException("Lista vazia");' },
  { id: 'END_CHECK_EMPTY', text: '    }' },
  { id: 'READ_VALUE', text: '    char valor = head.valor;' },
  { id: 'ADVANCE_HEAD', text: '    head = head.proximo;' },
  { id: 'REMOVE_NODE', text: '    if (head == null) tail = null;' },
  { id: 'END_FUNC', text: '    return valor;' },
  { id: 'END_FUNC_BRACE', text: '}' }
];
