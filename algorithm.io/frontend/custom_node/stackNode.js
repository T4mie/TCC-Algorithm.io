import React from 'react';

function StackNode({ data }) {
  const { values = [], top = -1, highlighted = [], activeValue, codeId } = data;
  const rawLabels = data.labels || values.map((_, i) => String(i));
  const labels = rawLabels.map(l => String(l).split(':')[0].trim());
  const size = values.length;

  const isMutatingStep = codeId === 'SET_VALUE' || codeId === 'CLEAR_VALUE';

  const valorDisplay = activeValue !== undefined && activeValue !== null ? activeValue : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Painel com as variáveis importantes do método (tamanho, topo, valor) */}
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
        {`tamanho: ${size}\ntopo: ${top}\nvalor: ${valorDisplay}`}
      </div>

      {/* Coluna de caixas: índice 0 embaixo, cresce para cima */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column-reverse',
          border: '2px solid #34495e',
          borderRadius: '8px',
          background: '#2c3e50',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          minHeight: `${size * 60}px`,
          width: '140px',
        }}
      >
        {values.map((value, index) => {
          const isHighlighted = highlighted.includes(index);
          const isTop = index === top;
          const hasValue = value !== null && value !== undefined && value !== '';

          let backgroundColor = hasValue ? '#3498db' : '#ecf0f1';
          if (isHighlighted && isMutatingStep) {
            backgroundColor = '#4CAF50';
          } else if (isHighlighted) {
            backgroundColor = '#FF9800';
          }

          return (
            <div
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                borderTop: index < size - 1 ? '1px solid #34495e' : 'none',
                height: '60px',
              }}
            >
              <div style={{
                width: '28px',
                textAlign: 'center',
                fontSize: '11px',
                fontWeight: '600',
                color: '#bdc3c7'
              }}>
                {labels[index]}
              </div>
              <div
                style={{
                  flex: 1,
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: backgroundColor,
                  color: hasValue ? '#fff' : '#2c3e50',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  borderRight: isTop ? '4px solid #e74c3c' : 'none',
                  transition: 'background 0.3s ease',
                }}
              >
                {hasValue ? value : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StackNode;
