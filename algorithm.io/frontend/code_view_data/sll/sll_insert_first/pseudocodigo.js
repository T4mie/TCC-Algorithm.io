export const sllInsertFirstPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'INSERIR_INICIO(Lista, valor)' },
  { id: 'CREATE_NODE', text: '    novoNo = criarNo(valor)' },
  { id: 'CHECK_HEAD', text: '    se Lista.head != nulo' },
  { id: 'LINK_NEXT', text: '        novoNo.proximo = Lista.head' },
  { id: 'ELSE_HEAD', text: '    senão' },
  { id: 'SET_TAIL', text: '        Lista.tail = novoNo' },
  { id: 'UPDATE_HEAD', text: '    Lista.head = novoNo' }
];
