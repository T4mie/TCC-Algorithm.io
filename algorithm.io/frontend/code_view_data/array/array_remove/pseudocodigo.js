export const arrayRemovePseudocodigoLines = [
  { id: 'SIGNATURE', text: 'REMOVER(Vetor, indice)' },
  { id: 'CHECK_INDEX', text: '    se indice < 0 ou indice >= Vetor.tamanho' },
  { id: 'INVALID_INDEX', text: '        erro "Índice inválido"' },
  { id: 'READ_VALUE', text: '    valor = Vetor[indice]' },
  { id: 'INIT_I', text: '    i = indice' },
  { id: 'WHILE_COND', text: '    enquanto i < Vetor.tamanho - 1' },
  { id: 'SHIFT_LEFT', text: '        Vetor[i] = Vetor[i+1]' },
  { id: 'INCREMENT_I', text: '        i = i + 1' },
  { id: 'CLEAR_LAST', text: '    Vetor[Vetor.tamanho - 1] = vazio' },
  { id: 'DECREMENT_SIZE', text: '    Vetor.tamanho = Vetor.tamanho - 1' },
  { id: 'END_FUNC', text: '    retorna valor' }
];
