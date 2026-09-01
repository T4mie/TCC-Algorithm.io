export const sllInsertFirstJavaLines = [
  { id: 'SIGNATURE', text: 'public void insertFirst(char valor) {' },
  { id: 'CREATE_NODE', text: '    No novoNo = new No(valor);' },
  { id: 'CHECK_HEAD', text: '    if (head != null) {' },
  { id: 'LINK_NEXT', text: '        novoNo.proximo = head;' },
  { id: 'END_CHECK_HEAD', text: '    } else {' },
  { id: 'SET_TAIL', text: '        tail = novoNo;' },
  { id: 'END_ELSE_HEAD', text: '    }' },
  { id: 'UPDATE_HEAD', text: '    head = novoNo;' },
  { id: 'END_FUNC', text: '}' }
];
