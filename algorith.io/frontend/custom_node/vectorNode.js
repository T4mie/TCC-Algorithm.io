import React from 'react';

function VectorNode({ data }) {
  // const values = data.values || [];
  const { values = [], activeKey, comparing, swapped } = data;
  const rawLabels = data.labels || values.map((_, i) => String(i));
  const labels = rawLabels.map(l => String(l).split(':')[0].trim());
  const size = values.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* EXIBIÇÃO DA CHAVE (Área Educativa) */}
      <div style={{ height: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {activeKey !== undefined && activeKey !== null ? (
          <>
            <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#7f8c8d' }}>CHAVE (KEY)</span>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#e74c3c', // Cor de destaque (vermelho/laranja)
              color: 'white',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: '4px',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(231, 76, 60, 0.4)',
              border: '2px solid #c0392b',
              marginBottom: '5px'
            }}>
              {activeKey}
            </div>
            <div style={{ fontSize: '12px', color: '#e74c3c' }}>↓ Comparando...</div>
          </>
        ) : (
          <div style={{ height: '60px' }} /> // Espaçador para não pular o layout
        )}
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
              color: '#000000',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {lab}
          </div>
        ))}
      </div>

      {/* Row de valores (caixas) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          border: '2px solid #34495e',
          borderRadius: '8px',
          background: '#2c3e50',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          overflow: 'hidden',
          minWidth: `${size * 60}px`, // Largura baseada no tamanho
          height: '60px',
        }}
      >
        {values.map((value, index) => {
          const isComparing = data.comparing?.includes(index);
          const isSwapped = data.swapped?.includes(index);

          let backgroundColor = value ? '#3498db' : '#ecf0f1';

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
              color: value ? '#fff' : '#2c3e50',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'background 0.3s ease',
              }}
            >
              {value || ''}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default VectorNode;