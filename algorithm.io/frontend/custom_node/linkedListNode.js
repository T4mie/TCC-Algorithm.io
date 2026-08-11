import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

// Nó customizado do React Flow que representa uma célula da lista simplesmente ligada,
// destacando head/tail por cor/etiqueta e expondo os handles de encadeamento (next).
function LinkedListNode({ data }) {
  const isHead = !!data.isHead;
  const isTail = !!data.isTail;
  const isHighlighted = !!data.highlighted;
  const hasValue = data.label !== undefined && data.label !== null && data.label !== '';

  let borderColor = '#34495e';
  if (isHead && isTail) borderColor = '#9b59b6';
  else if (isHead) borderColor = '#2ecc71';
  else if (isTail) borderColor = '#e67e22';

  const boxShadow = isHighlighted
    ? '0 0 0 3px rgba(255,152,0,0.6), 0 4px 6px rgba(0,0,0,0.3)'
    : '0 4px 6px rgba(0,0,0,0.3)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

      {/* Marcadores de head/tail no mesmo nível do nó, em vez de só no objeto Lista */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px', minHeight: '15px' }}>
        {isHead && (
          <span style={{
            fontSize: '9px', fontWeight: 'bold', color: '#fff',
            background: '#2ecc71', borderRadius: '4px', padding: '1px 6px', lineHeight: 1.5
          }}>
            HEAD
          </span>
        )}
        {isTail && (
          <span style={{
            fontSize: '9px', fontWeight: 'bold', color: '#fff',
            background: '#e67e22', borderRadius: '4px', padding: '1px 6px', lineHeight: 1.5
          }}>
            TAIL
          </span>
        )}
      </div>

      <motion.div
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.2 } }}
        whileHover={{ scale: 1.08, transition: { duration: 0.05 } }}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '10px',
          boxSizing: 'border-box',
          background: hasValue ? '#3498db' : '#ecf0f1',
          border: `3px solid ${borderColor}`,
          boxShadow,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          transition: 'all 0.3s ease',
        }}
      >
        <strong style={{ color: hasValue ? '#fff' : '#2c3e50', fontSize: '14px' }}>
          {data.label}
        </strong>

        {/* Ponteiro head/tail vindo do objeto Lista */}
        <Handle id="ptr" type="target" position={Position.Top} style={{ background: borderColor }} />

        {/* Encadeamento (next): entra pela esquerda, sai pela direita */}
        <Handle id="prev" type="target" position={Position.Left} />
        <Handle id="next" type="source" position={Position.Right} />
      </motion.div>
    </div>
  );
}

export default LinkedListNode;
