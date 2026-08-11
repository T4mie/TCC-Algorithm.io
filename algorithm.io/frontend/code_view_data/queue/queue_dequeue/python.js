export const queueDequeuePythonLines = [
  { id: 'SIGNATURE', text: 'def dequeue(fila):' },
  { id: 'CHECK_EMPTY', text: '    if fila.head is None:' },
  { id: 'EMPTY', text: '        raise Exception("Fila vazia")' },
  { id: 'READ_VALUE', text: '    valor = fila.head.valor' },
  { id: 'ADVANCE_HEAD', text: '    fila.head = fila.head.proximo' },
  { id: 'REMOVE_NODE', text: '    if fila.head is None: fila.tail = None' },
  { id: 'END_FUNC', text: '    return valor' }
];
