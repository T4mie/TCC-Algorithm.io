export const sllRemoveFirstPythonLines = [
  { id: 'SIGNATURE', text: 'def remove_first(lista):' },
  { id: 'CHECK_EMPTY', text: '    if lista.head is None:' },
  { id: 'EMPTY', text: '        raise ValueError("Lista vazia")' },
  { id: 'READ_VALUE', text: '    valor = lista.head.valor' },
  { id: 'ADVANCE_HEAD', text: '    lista.head = lista.head.proximo' },
  { id: 'REMOVE_NODE', text: '    if lista.head is None: lista.tail = None' },
  { id: 'END_FUNC', text: '    return valor' }
];
