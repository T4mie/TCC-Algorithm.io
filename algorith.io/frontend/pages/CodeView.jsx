import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export default function CodeView() {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const viewType = params.get('type'); // 'vector' when opened from the vector view

  const [lang, setLang] = useState('pseudocódigo');

  const pseudocódigo = `INSERTION-SORT(A, n)
for j = 2 to n
    chave = A[j]
    // Insere A[j] na sequencia ordenada A[1..j-1]
    i = j - 1
    while i > 0 and A[i] > chave
        A[i + 1] = A[i]
        i = i - 1
    A[i + 1] = chave`;

  const javaCode = `public static void insertionSort(int[] A) {
    int n = A.length;
    for (int j = 1; j < n; j++) {
        int chave = A[j];
        int i = j - 1;
        while (i >= 0 && A[i] > chave) {
            A[i + 1] = A[i];
            i = i - 1;
        }
        A[i + 1] = chave;
    }
}`;

  const pythonCode = `def insertion_sort(A):
    n = len(A)
    for j in range(1, n):
        chave = A[j]
        i = j - 1
        while i >= 0 and A[i] > chave:
            A[i + 1] = A[i]
            i = i - 1
        A[i + 1] = chave`;

  let codeToShow = '';
  if (viewType === 'vector') {
    if (lang === 'pseudocódigo') codeToShow = pseudocódigo;
    else if (lang === 'java') codeToShow = javaCode;
    else if (lang === 'python') codeToShow = pythonCode;
  }

  const buttonStyle = (active) => ({
    background: active ? '#0f766e' : '#111',
    color: active ? '#fff' : '#cfcfcf',
    border: '1px solid #222',
    padding: '6px 10px',
    borderRadius: 4,
    cursor: 'pointer'
  });

  return (
    <div style={{
      padding: '16px',
      height: '100vh',
      boxSizing: 'border-box',
      backgroundColor: '#0b0b0b',
      color: '#e6e6e6',
      fontFamily: 'Menlo, Monaco, "Courier New", monospace'
    }}>
      <h1 style={{ margin: 0, paddingBottom: 12, color: '#ffffff' }}>Code View</h1>
      <div style={{
        marginTop: 8,
        backgroundColor: '#000000',
        color: '#00ff88',
        borderRadius: 6,
        padding: 12,
        minHeight: 'calc(100vh - 84px)',
        overflow: 'auto',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6)'
      }}>
        {viewType === 'vector' ? (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button style={buttonStyle(lang === 'pseudocódigo')} onClick={() => setLang('pseudocódigo')}>pseudocódigo</button>
              <button style={buttonStyle(lang === 'java')} onClick={() => setLang('java')}>Java</button>
              <button style={buttonStyle(lang === 'python')} onClick={() => setLang('python')}>Python</button>
            </div>
            <pre style={{ margin: 0, whiteSpace: 'pre', color: '#00ff88', fontSize: 14, lineHeight: 1.6 }}>{codeToShow}</pre>
          </>
        ) : (
          // not vector: keep console blank for now
          null
        )}
      </div>
    </div>
  );
}