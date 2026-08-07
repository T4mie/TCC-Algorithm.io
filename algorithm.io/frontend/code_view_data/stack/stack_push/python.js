export const stackPushPythonLines = [
  { id: 'SIGNATURE', text: 'def push(pilha, valor):' },
  { id: 'CHECK_FULL', text: '    if pilha.topo == pilha.tamanho - 1:' },
  { id: 'OVERFLOW', text: '        raise Exception("Estouro de pilha (Overflow)")' },
  { id: 'INCREMENT_TOP', text: '    pilha.topo += 1' },
  { id: 'SET_VALUE', text: '    pilha[pilha.topo] = valor' }
];
