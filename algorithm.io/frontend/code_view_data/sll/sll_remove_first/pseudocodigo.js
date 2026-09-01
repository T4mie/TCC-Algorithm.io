export const sllRemoveFirstPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'REMOVER_INICIO(Lista)' },
  { id: 'CHECK_EMPTY', text: '    se Lista.head == nulo' },
  { id: 'EMPTY', text: '        erro "Lista vazia"' },
  { id: 'READ_VALUE', text: '    valor = Lista.head.valor' },
  { id: 'ADVANCE_HEAD', text: '    Lista.head = Lista.head.proximo' },
  { id: 'REMOVE_NODE', text: '    se Lista.head == nulo, Lista.tail = nulo' },
  { id: 'END_FUNC', text: '    retorna valor' }
];
