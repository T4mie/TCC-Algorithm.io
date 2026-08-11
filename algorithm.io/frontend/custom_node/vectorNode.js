import React from 'react';

// Nó customizado que renderiza o vetor como uma fileira de caixas, destacando
// os índices em comparação e em troca durante a simulação do insertion sort.
function VectorNode({ data }) {
  const { values = [], comparing, swapped, iValue, jValue, activeKey } = data;
  const rawLabels = data.labels || values.map((_, i) => String(i));
  const labels = rawLabels.map(l => String(l).split(':')[0].trim());
  const size = values.length;

  const display = (val) => (val !== undefined && val !== null ? val : '—');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Painel com as variáveis importantes do insertion sort (n, i, j, chave) */}
      <div style={{
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: '11px',
        lineHeight: 1.6,
        color: '#00ff88',
        background: '#1b2530',
        border: '1px solid #34495e',
        borderRadius: '6px',
        padding: '8px 12px',
        marginBottom: '10px',
        whiteSpace: 'pre',
        textAlign: 'left'
      }}>
        {`n: ${size}\nj: ${display(iValue)}\ni: ${display(jValue)}\nchave: ${display(activeKey)}`}
      </div>

      {/* Row de índices (labels) */}
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '6px', minWidth: `${size * 60}px` }}>
        {labels.map((lab, idx) => (
          <div
            key={`label-${idx}`}
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#bdc3c7',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            {lab}
          </div>
        ))}
      </div>

      {/* Row de valores (caixas): o vetor fica deitado, crescendo da esquerda para a direita */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          border: '2px solid #34495e',
          borderRadius: '8px',
          background: '#2c3e50',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          minWidth: `${size * 60}px`,
          height: '60px',
        }}
      >
        {values.map((value, index) => {
          const isComparing = comparing?.includes(index);
          const isSwapped = swapped?.includes(index);

          const hasValue = value !== null && value !== undefined && value !== '';
          let backgroundColor = hasValue ? '#3498db' : '#ecf0f1';

          if (isSwapped) {
            backgroundColor = '#4CAF50';
          } else if (isComparing) {
            backgroundColor = '#FF9800';
          }

          return (
            <div
              key={index}
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: index < size - 1 ? '1px solid #34495e' : 'none',
                background: backgroundColor,
                color: hasValue ? '#fff' : '#2c3e50',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s ease',
              }}
            >
              {hasValue ? value : ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VectorNode;
