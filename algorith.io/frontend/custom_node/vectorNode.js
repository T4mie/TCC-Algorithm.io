import React from 'react';

function VectorNode({ data }) {
  const values = data.values || [];
  const size = values.length;

  return (
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
      {values.map((value, index) => (
        <div
          key={index}
          style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRight: index < size - 1 ? '1px solid #34495e' : 'none',
            background: value ? '#3498db' : '#ecf0f1',
            color: value ? '#fff' : '#2c3e50',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background 0.3s ease',
          }}
        >
          {value || ''}
        </div>
      ))}
    </div>
  );
}

export default VectorNode;