export const sllInsertLastPythonLines = [
  { id: 'SIGNATURE', text: 'def insert_last(lista, valor):' },
  { id: 'CREATE_NODE', text: '    novo_no = No(valor)' },
  { id: 'CHECK_TAIL', text: '    if lista.tail is not None:' },
  { id: 'LINK_NEXT', text: '        lista.tail.proximo = novo_no' },
  { id: 'ELSE_TAIL', text: '    else:' },
  { id: 'SET_HEAD', text: '        lista.head = novo_no' },
  { id: 'UPDATE_TAIL', text: '    lista.tail = novo_no' }
];
