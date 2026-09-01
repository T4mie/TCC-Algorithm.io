export const sllRemoveLastPythonLines = [
  { id: 'SIGNATURE', text: 'def remove_last(lista):' },
  { id: 'CHECK_EMPTY', text: '    if lista.tail is None:' },
  { id: 'EMPTY', text: '        raise ValueError("Lista vazia")' },
  { id: 'READ_VALUE', text: '    valor = lista.tail.valor' },
  { id: 'CHECK_SINGLE', text: '    if lista.head == lista.tail:' },
  { id: 'CLEAR_LIST', text: '        lista.head = lista.tail = None' },
  { id: 'ELSE_SINGLE', text: '    else:' },
  { id: 'INIT_PREV', text: '        anterior = lista.head' },
  { id: 'WHILE_COND', text: '        while anterior.proximo != lista.tail:' },
  { id: 'ADVANCE_PREV', text: '            anterior = anterior.proximo' },
  { id: 'UPDATE_TAIL', text: '        anterior.proximo = None; lista.tail = anterior' },
  { id: 'END_FUNC', text: '    return valor' }
];
