export const queueDequeuePseudocodigoLines = [
  { id: 'SIGNATURE', text: 'DESENFILEIRAR(F)' },
  { id: 'CHECK_EMPTY', text: '    se F.head == nulo' },
  { id: 'EMPTY', text: '        erro "Fila vazia"' },
  { id: 'READ_VALUE', text: '    valor = F.head.valor' },
  { id: 'ADVANCE_HEAD', text: '    F.head = F.head.proximo' },
  { id: 'REMOVE_NODE', text: '    se F.head == nulo, F.tail = nulo' },
  { id: 'END_FUNC', text: '    retorna valor' }
];
