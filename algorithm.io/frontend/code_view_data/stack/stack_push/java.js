export const stackPushJavaLines = [
  { id: 'SIGNATURE', text: 'public void push(int valor) {' },
  { id: 'CHECK_FULL', text: '    if (topo == tamanho - 1) {' },
  { id: 'OVERFLOW', text: '        throw new RuntimeException("Estouro de pilha (Overflow)");' },
  { id: 'END_CHECK_FULL', text: '    }' },
  { id: 'INCREMENT_TOP', text: '    topo++;' },
  { id: 'SET_VALUE', text: '    pilha[topo] = valor;' },
  { id: 'END_FUNC', text: '}' }
];
