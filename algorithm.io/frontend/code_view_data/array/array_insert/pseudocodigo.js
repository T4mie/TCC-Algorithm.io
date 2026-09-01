export const arrayInsertPseudocodigoLines = [
  { id: 'SIGNATURE', text: 'INSERIR(Vetor, indice, valor)' },
  { id: 'CHECK_INDEX', text: '    se indice < 0 ou indice > Vetor.tamanho' },
  { id: 'INVALID_INDEX', text: '        erro "Índice inválido"' },
  { id: 'CHECK_FULL', text: '    se Vetor.tamanho == Vetor.capacidade' },
  { id: 'OVERFLOW', text: '        erro "Vetor cheio (Overflow)"' },
  { id: 'INIT_I', text: '    i = Vetor.tamanho' },
  { id: 'WHILE_COND', text: '    enquanto i > indice' },
  { id: 'SHIFT_RIGHT', text: '        Vetor[i] = Vetor[i-1]' },
  { id: 'DECREMENT_I', text: '        i = i - 1' },
  { id: 'SET_VALUE', text: '    Vetor[indice] = valor' },
  { id: 'INCREMENT_SIZE', text: '    Vetor.tamanho = Vetor.tamanho + 1' }
];
