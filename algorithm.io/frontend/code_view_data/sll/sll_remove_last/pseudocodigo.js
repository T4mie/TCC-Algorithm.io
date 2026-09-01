export const sllRemoveLastPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'REMOVER_FIM(Lista)' },
  { id: 'CHECK_EMPTY', text: '    se Lista.tail == nulo' },
  { id: 'EMPTY', text: '        erro "Lista vazia"' },
  { id: 'READ_VALUE', text: '    valor = Lista.tail.valor' },
  { id: 'CHECK_SINGLE', text: '    se Lista.head == Lista.tail' },
  { id: 'CLEAR_LIST', text: '        Lista.head = Lista.tail = nulo' },
  { id: 'ELSE_SINGLE', text: '    senão' },
  { id: 'INIT_PREV', text: '        anterior = Lista.head' },
  { id: 'WHILE_COND', text: '        enquanto anterior.proximo != Lista.tail' },
  { id: 'ADVANCE_PREV', text: '            anterior = anterior.proximo' },
  { id: 'UPDATE_TAIL', text: '        anterior.proximo = nulo; Lista.tail = anterior' },
  { id: 'END_FUNC', text: '    retorna valor' }
];
