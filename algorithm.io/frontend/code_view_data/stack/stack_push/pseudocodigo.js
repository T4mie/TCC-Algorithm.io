export const stackPushPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'PUSH(S, valor)' },
  { id: 'CHECK_FULL', text: '    se S.topo == S.tamanho - 1' },
  { id: 'OVERFLOW', text: '        erro "Estouro de pilha (Overflow)"' },
  { id: 'INCREMENT_TOP', text: '    S.topo = S.topo + 1' },
  { id: 'SET_VALUE', text: '    S[S.topo] = valor' }
];
