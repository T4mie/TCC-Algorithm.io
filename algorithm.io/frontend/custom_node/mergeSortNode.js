import React from 'react';

// Nó customizado que renderiza o "split view" do Merge Sort: o vetor
// completo com o intervalo [left, right] da chamada de recursão/mesclagem
// atual destacado por uma borda, e — durante uma mesclagem — os dois
// sub-vetores do buffer (leftArr/rightArr) com os ponteiros i/j, mais o
// ponteiro k de escrita de volta no vetor principal.
function MergeSortNode({ data }) {
  const {
    values = [], left, right, mid, leftArr, rightArr,
    i, j, k, highlighted = [], codeId
  } = data;
  const n = values.length;

  const display = (val) => (val !== undefined && val !== null ? val : '—');
  const hasRange = typeof left === 'number' && typeof right === 'number';
  const isMerging = Array.isArray(leftArr) || Array.isArray(rightArr);

  const boxStyle = (index, { inRange, isMid, isK, isDone } = {}) => {
    const hasValue = values[index] !== null && values[index] !== undefined && values[index] !== '';
    let background = hasValue ? '#3498db' : '#ecf0f1';
    if (isK) background = '#4CAF50';
    else if (inRange) background = isMid ? '#FF9800' : '#2c3e50';

    return {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '50px',
      minWidth: '46px',
      borderRight: index < n - 1 ? '1px solid #1b2530' : 'none',
      borderTop: inRange ? '3px solid #f39c12' : '3px solid transparent',
      borderBottom: inRange ? '3px solid #f39c12' : '3px solid transparent',
      background,
      color: hasValue || isK ? '#fff' : '#2c3e50',
      fontSize: '13px',
      fontWeight: 'bold',
      opacity: hasRange && !inRange ? 0.45 : 1,
      transition: 'background 0.3s ease'
    };
  };

  const bufferRow = (label, arr, pointer, color) => {
    if (!Array.isArray(arr)) return null;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
        <span style={{ fontSize: '11px', fontWeight: 'bold', color, width: '14px' }}>{label}</span>
        <div style={{
          display: 'flex',
          border: `2px solid ${color}`,
          borderRadius: '6px',
          background: '#1b2530',
          overflow: 'hidden'
        }}>
          {arr.map((val, idx) => {
            const isPointed = pointer === idx;
            const hasValue = val !== null && val !== undefined && val !== '';
            return (
              <div
                key={idx}
                style={{
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRight: idx < arr.length - 1 ? '1px solid #34495e' : 'none',
                  background: isPointed ? color : (hasValue ? '#34495e' : '#22303e'),
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {display(val)}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Painel com as variáveis importantes do merge sort (n, left, right, mid, i, j, k) */}
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
        {`n: ${n}\nleft: ${display(left)}  mid: ${display(mid)}  right: ${display(right)}`}
        {isMerging ? `\ni: ${display(i)}  j: ${display(j)}  k: ${display(k)}` : ''}
      </div>

      {/* Row de índices */}
      <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '4px', width: '100%' }}>
        {values.map((_, index) => (
          <div key={`label-${index}`} style={{ flex: 1, minWidth: '46px', textAlign: 'center', color: '#bdc3c7', fontSize: '10px', fontWeight: 600 }}>
            {index}
          </div>
        ))}
      </div>

      {/* Vetor principal, com o intervalo [left,right] ativo demarcado */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          border: '2px solid #34495e',
          borderRadius: '8px',
          background: '#2c3e50',
          boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}
      >
        {values.map((value, index) => {
          const inRange = hasRange && index >= left && index <= right;
          const isMidIdx = typeof mid === 'number' && index === mid;
          const isK = highlighted.includes(index) || (typeof k === 'number' && index === k && codeId !== 'WHILE_MAIN');
          return (
            <div key={index} style={boxStyle(index, { inRange, isMid: isMidIdx, isK })}>
              {display(value)}
            </div>
          );
        })}
      </div>

      {/* Buffers de mesclagem (L à esquerda, R à direita), só aparecem durante merge() */}
      {isMerging && (
        <div style={{ marginTop: '4px' }}>
          {bufferRow('L', leftArr, i, '#3498db')}
          {bufferRow('R', rightArr, j, '#e67e22')}
        </div>
      )}
    </div>
  );
}

export default MergeSortNode;
