import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { motion } from 'framer-motion';

function LinkedListNode({ data, isConnected }) {
  // Determinar cor baseado no estado
  let backgroundColor = '#777'; // cor padrão
  let borderColor = '#777';
  let borderWidth = '1px';

  if (data.type === 'head' || data.type === 'tail') {
    backgroundColor = '#555';
  } else if (data.state === 'comparing') {
    backgroundColor = '#ffb700'; // amarelo para comparação
    borderWidth = '3px';
  } else if (data.state === 'swapped') {
    backgroundColor = '#00d084'; // verde para trocado
    borderWidth = '3px';
  } else if (data.state === 'sorted') {
    backgroundColor = '#4CAF50'; // verde para ordenado
    borderWidth = '2px';
  }

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1,transition: { duration: 0.2} }}
      whileHover={{scale:1.1,transition:{duration:0.05}}}
      style={{
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: backgroundColor,
        border: `${borderWidth} solid ${borderColor}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        boxShadow: data.state ? '0 0 10px rgba(0,0,0,0.3)' : 'none',
      }}
    >
      <strong style={{ color: '#fff' }}>{data.label}</strong>

      {/* Entrada */}
      <Handle
        type="target"
        position={Position.Top}
      />

      {/* Saída */}
      <Handle
        type="source"
        position={Position.Bottom}
      />
    </motion.div>
  );
}

export default LinkedListNode;