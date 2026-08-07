export const stackPopJavaLines = [
  { id: 'SIGNATURE', text: 'public int pop() {' },
  { id: 'CHECK_EMPTY', text: '    if (topo == -1) {' },
  { id: 'UNDERFLOW', text: '        throw new RuntimeException("Estouro negativo (Underflow)");' },
  { id: 'END_CHECK_EMPTY', text: '    }' },
  { id: 'READ_VALUE', text: '    int valor = pilha[topo];' },
  { id: 'CLEAR_VALUE', text: '    pilha[topo] = 0;' },
  { id: 'DECREMENT_TOP', text: '    topo--;' },
  { id: 'END_FUNC', text: '    return valor;' }
];
