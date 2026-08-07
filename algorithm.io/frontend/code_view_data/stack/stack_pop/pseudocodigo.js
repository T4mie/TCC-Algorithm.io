export const stackPopPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'POP(S)' },
  { id: 'CHECK_EMPTY', text: '    se S.topo == -1' },
  { id: 'UNDERFLOW', text: '        erro "Estouro negativo (Underflow)"' },
  { id: 'READ_VALUE', text: '    valor = S[S.topo]' },
  { id: 'CLEAR_VALUE', text: '    S[S.topo] = vazio' },
  { id: 'DECREMENT_TOP', text: '    S.topo = S.topo - 1' },
  { id: 'END_FUNC', text: '    retorna valor' }
];
