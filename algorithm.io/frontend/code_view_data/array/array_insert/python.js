export const arrayInsertPythonLines = [
  { id: 'SIGNATURE', text: 'def insert(vetor, indice, valor):' },
  { id: 'CHECK_INDEX', text: '    if indice < 0 or indice >= len(vetor):' },
  { id: 'INVALID_INDEX', text: '        raise ValueError("Índice inválido")' },
  { id: 'CHECK_FULL', text: '    if all(slot is not None for slot in vetor):' },
  { id: 'OVERFLOW', text: '        raise ValueError("Vetor cheio (Overflow)")' },
  { id: 'REPLACE_VALUE', text: '    vetor[indice] = valor' },
  { id: 'SET_VALUE', text: '    vetor[indice] = valor' },
  { id: 'INCREMENT_SIZE', text: '    tamanho = sum(1 for slot in vetor if slot is not None)' }
];
