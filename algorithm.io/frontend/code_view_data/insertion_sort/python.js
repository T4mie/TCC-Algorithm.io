export const pythonLines = [
  { id: 'SIGNATURE', text: 'def insertion_sort(A):' },
  { id: 'INIT_SIZE', text: '    n = len(A)' },
  { id: 'INIT_LOOP', text: '    for j in range(1, n):' },
  { id: 'SET_KEY', text: '        chave = A[j]' },
  { id: 'INIT_I', text: '        i = j - 1' },
  { id: 'WHILE_COND', text: '        while i >= 0 and A[i] > chave:' },
  { id: 'SHIFT', text: '            A[i + 1] = A[i]' },
  { id: 'DECREMENT_I', text: '            i = i - 1' },
  { id: 'INSERT', text: '        A[i + 1] = chave' }
];