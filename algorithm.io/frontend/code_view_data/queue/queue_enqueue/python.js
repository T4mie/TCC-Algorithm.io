export const queueEnqueuePythonLines = [
  { id: 'SIGNATURE', text: 'def enqueue(fila, valor):' },
  { id: 'CREATE_NODE', text: '    novo_no = No(valor)' },
  { id: 'CHECK_TAIL', text: '    if fila.tail is not None:' },
  { id: 'LINK_NEXT', text: '        fila.tail.proximo = novo_no' },
  { id: 'ELSE_TAIL', text: '    else:' },
  { id: 'SET_HEAD', text: '        fila.head = novo_no' },
  { id: 'UPDATE_TAIL', text: '    fila.tail = novo_no' }
];
