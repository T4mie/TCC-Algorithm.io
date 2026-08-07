export const stackPopPythonLines = [
  { id: 'SIGNATURE', text: 'def pop(pilha):' },
  { id: 'CHECK_EMPTY', text: '    if pilha.topo == -1:' },
  { id: 'UNDERFLOW', text: '        raise Exception("Estouro negativo (Underflow)")' },
  { id: 'READ_VALUE', text: '    valor = pilha[pilha.topo]' },
  { id: 'CLEAR_VALUE', text: '    pilha[pilha.topo] = None' },
  { id: 'DECREMENT_TOP', text: '    pilha.topo -= 1' },
  { id: 'END_FUNC', text: '    return valor' }
];
