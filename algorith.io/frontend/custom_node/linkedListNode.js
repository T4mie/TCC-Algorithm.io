import React from 'react';
import { Handle, Position } from '@xyflow/react';

function LinkedListNode({ data }) {
  return (
    <div style={{
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: '#777',
      border: '1px solid #777',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <strong style={{color: '#fff'}}>{data.label}</strong>

      {/* Entrada */}
      <Handle
        type="target"
        position={Position.Left}
      />

      {/* Saída */}
      <Handle
        type="source"
        position={Position.Right}
      />
    </div>
  );
}

export default LinkedListNode;