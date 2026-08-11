export const queueEnqueuePseudocodigoLines = [
  { id: 'SIGNATURE', text: 'ENFILEIRAR(F, valor)' },
  { id: 'CREATE_NODE', text: '    novoNo = criarNo(valor)' },
  { id: 'CHECK_TAIL', text: '    se F.tail != nulo' },
  { id: 'LINK_NEXT', text: '        F.tail.proximo = novoNo' },
  { id: 'ELSE_TAIL', text: '    senão' },
  { id: 'SET_HEAD', text: '        F.head = novoNo' },
  { id: 'UPDATE_TAIL', text: '    F.tail = novoNo' }
];
