export const arrayRemovePythonLines = [
  { id: 'SIGNATURE', text: 'def remove(vetor, indice):' },
  { id: 'CHECK_INDEX', text: '    if indice < 0 or indice >= len(vetor) or vetor[indice] is None:' },
  { id: 'INVALID_INDEX', text: '        raise ValueError("Índice inválido")' },
  { id: 'READ_VALUE', text: '    valor = vetor[indice]' },
  { id: 'CLEAR_LAST', text: '    vetor[indice] = None' },
  { id: 'DECREMENT_SIZE', text: '    tamanho = sum(1 for slot in vetor if slot is not None)' },
  { id: 'END_FUNC', text: '    return valor' }
];
