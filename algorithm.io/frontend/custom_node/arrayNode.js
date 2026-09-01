import React from 'react';

// Nó customizado que renderiza o vetor de capacidade fixa como uma fileira de
// caixas, distinguindo posições ocupadas (dentro do tamanho lógico) de
// posições livres (capacidade reservada), e destacando os índices envolvidos
// no deslocamento durante a simulação de inserir/remover por índice.
function ArrayNode({ data }) {
  const { values = [], size = 0, highlighted = [], activeValue, codeId } = data;
  const rawLabels = data.labels || values.map((_, i) => String(i));
  const labels = rawLabels.map(l => String(l).split(':')[0].trim());
  const capacity = values.length;

  const isMutatingStep = codeId === 'SET_VALUE' || codeId === 'CLEAR_LAST';

  const valorDisplay = activeValue !== undefined && activeValue !== null ? activeValue : '—';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Painel com as variáveis importantes do método (capacidade, tamanho, valor) */}
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
        {`capacidade: ${capacity}\ntamanho: ${size}\nvalor: ${valorDisplay}`}
      </div>

      {/* Row de índices (labels) */}
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '6px', minWidth: `${capacity * 60}px` }}>
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
          minWidth: `${capacity * 60}px`,
          height: '60px',
        }}
      >
        {values.map((value, index) => {
          const isHighlighted = highlighted.includes(index);
          const isWithinSize = index < size;
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
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                borderRight: index < capacity - 1 ? (isWithinSize ? '1px solid #1b2530' : '1px dashed #7f8c8d') : 'none',
                background: backgroundColor,
                color: hasValue ? '#fff' : '#2c3e50',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: isWithinSize || hasValue ? 1 : 0.5,
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

export default ArrayNode;
