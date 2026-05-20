export const pseudocodigoLines = [
  { id: 'SIGNATURE', text: 'INSERTION-SORT(A, n)' },
  { id: 'INIT_LOOP', text: 'for j = 2 to n' },
  { id: 'SET_KEY', text: '    chave = A[j]' },
  { id: 'COMMENT', text: '    // Insere A[j] na sequencia ordenada A[1..j-1]' },
  { id: 'INIT_I', text: '    i = j - 1' },
  { id: 'WHILE_COND', text: '    while i > 0 and A[i] > chave' },
  { id: 'SHIFT', text: '        A[i + 1] = A[i]' },
  { id: 'DECREMENT_I', text: '        i = i - 1' },
  { id: 'INSERT', text: '    A[i + 1] = chave' }
];