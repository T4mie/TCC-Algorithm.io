export const arrayInsertPythonLines = [
  { id: 'SIGNATURE', text: 'def insert(vetor, indice, valor):' },
  { id: 'CHECK_INDEX', text: '    if indice < 0 or indice > vetor.tamanho:' },
  { id: 'INVALID_INDEX', text: '        raise ValueError("Índice inválido")' },
  { id: 'CHECK_FULL', text: '    if vetor.tamanho == vetor.capacidade:' },
  { id: 'OVERFLOW', text: '        raise ValueError("Vetor cheio (Overflow)")' },
  { id: 'INIT_I', text: '    i = vetor.tamanho' },
  { id: 'WHILE_COND', text: '    while i > indice:' },
  { id: 'SHIFT_RIGHT', text: '        vetor[i] = vetor[i - 1]' },
  { id: 'DECREMENT_I', text: '        i -= 1' },
  { id: 'SET_VALUE', text: '    vetor[indice] = valor' },
  { id: 'INCREMENT_SIZE', text: '    vetor.tamanho += 1' }
];
