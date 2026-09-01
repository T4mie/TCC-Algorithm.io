export const sllRemoveLastJavaLines = [
  { id: 'SIGNATURE', text: 'public char removeLast() {' },
  { id: 'CHECK_EMPTY', text: '    if (tail == null) {' },
  { id: 'EMPTY', text: '        throw new RuntimeException("Lista vazia");' },
  { id: 'END_CHECK_EMPTY', text: '    }' },
  { id: 'READ_VALUE', text: '    char valor = tail.valor;' },
  { id: 'CHECK_SINGLE', text: '    if (head == tail) {' },
  { id: 'CLEAR_LIST', text: '        head = tail = null;' },
  { id: 'ELSE_SINGLE', text: '    } else {' },
  { id: 'INIT_PREV', text: '        No anterior = head;' },
  { id: 'WHILE_COND', text: '        while (anterior.proximo != tail) {' },
  { id: 'ADVANCE_PREV', text: '            anterior = anterior.proximo;' },
  { id: 'END_WHILE', text: '        }' },
  { id: 'UPDATE_TAIL', text: '        anterior.proximo = null; tail = anterior;' },
  { id: 'END_ELSE_SINGLE', text: '    }' },
  { id: 'END_FUNC', text: '    return valor;' },
  { id: 'END_FUNC_BRACE', text: '}' }
];
