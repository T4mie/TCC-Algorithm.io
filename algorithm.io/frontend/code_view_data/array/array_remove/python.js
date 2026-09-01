export const arrayRemovePythonLines = [
  { id: 'SIGNATURE', text: 'def remove(vetor, indice):' },
  { id: 'CHECK_INDEX', text: '    if indice < 0 or indice >= vetor.tamanho:' },
  { id: 'INVALID_INDEX', text: '        raise ValueError("Índice inválido")' },
  { id: 'READ_VALUE', text: '    valor = vetor[indice]' },
  { id: 'INIT_I', text: '    i = indice' },
  { id: 'WHILE_COND', text: '    while i < vetor.tamanho - 1:' },
  { id: 'SHIFT_LEFT', text: '        vetor[i] = vetor[i + 1]' },
  { id: 'INCREMENT_I', text: '        i += 1' },
  { id: 'CLEAR_LAST', text: '    vetor[vetor.tamanho - 1] = None' },
  { id: 'DECREMENT_SIZE', text: '    vetor.tamanho -= 1' },
  { id: 'END_FUNC', text: '    return valor' }
];
