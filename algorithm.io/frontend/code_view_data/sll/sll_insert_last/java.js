export const sllInsertLastJavaLines = [
  { id: 'SIGNATURE', text: 'public void insertLast(char valor) {' },
  { id: 'CREATE_NODE', text: '    No novoNo = new No(valor);' },
  { id: 'CHECK_TAIL', text: '    if (tail != null) {' },
  { id: 'LINK_NEXT', text: '        tail.proximo = novoNo;' },
  { id: 'END_CHECK_TAIL', text: '    } else {' },
  { id: 'SET_HEAD', text: '        head = novoNo;' },
  { id: 'END_ELSE_TAIL', text: '    }' },
  { id: 'UPDATE_TAIL', text: '    tail = novoNo;' },
  { id: 'END_FUNC', text: '}' }
];
