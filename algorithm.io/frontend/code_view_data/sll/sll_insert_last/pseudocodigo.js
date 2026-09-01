export const sllInsertLastPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'INSERIR_FIM(Lista, valor)' },
  { id: 'CREATE_NODE', text: '    novoNo = criarNo(valor)' },
  { id: 'CHECK_TAIL', text: '    se Lista.tail != nulo' },
  { id: 'LINK_NEXT', text: '        Lista.tail.proximo = novoNo' },
  { id: 'ELSE_TAIL', text: '    senão' },
  { id: 'SET_HEAD', text: '        Lista.head = novoNo' },
  { id: 'UPDATE_TAIL', text: '    Lista.tail = novoNo' }
];
