export const javaLines = [
  { id: 'SIGNATURE', text: 'public static void insertionSort(int[] A) {' },
  { id: 'INIT_SIZE', text: '    int n = A.length;' },
  { id: 'INIT_LOOP', text: '    for (int j = 1; j < n; j++) {' },
  { id: 'SET_KEY', text: '        int chave = A[j];' },
  { id: 'INIT_I', text: '        int i = j - 1;' },
  { id: 'WHILE_COND', text: '        while (i >= 0 && A[i] > chave) {' },
  { id: 'SHIFT', text: '            A[i + 1] = A[i];' },
  { id: 'DECREMENT_I', text: '            i = i - 1;' },
  { id: 'END_WHILE', text: '        }' },
  { id: 'INSERT', text: '        A[i + 1] = chave;' },
  { id: 'END_FOR', text: '    }' },
  { id: 'END_FUNC', text: '}' }
];