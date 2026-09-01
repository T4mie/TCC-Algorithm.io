export const sllInsertFirstPythonLines = [
  { id: 'SIGNATURE', text: 'def insert_first(lista, valor):' },
  { id: 'CREATE_NODE', text: '    novo_no = No(valor)' },
  { id: 'CHECK_HEAD', text: '    if lista.head is not None:' },
  { id: 'LINK_NEXT', text: '        novo_no.proximo = lista.head' },
  { id: 'ELSE_HEAD', text: '    else:' },
  { id: 'SET_TAIL', text: '        lista.tail = novo_no' },
  { id: 'UPDATE_HEAD', text: '    lista.head = novo_no' }
];
