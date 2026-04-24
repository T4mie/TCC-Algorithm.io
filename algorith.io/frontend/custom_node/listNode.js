import React from 'react';
import { Handle, Position } from '@xyflow/react';

function ListNode({ data }) {
  return (
    <div
      style={{
        width: '120px',
        height: 'auto',
        borderRadius: '8px',
        background: '#2c3e50',
        border: '2px solid #34495e',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      }}
    >
      <strong style={{ color: '#fff', fontSize: '12px', marginBottom: '5px' }}>
        {data.label}
      </strong>
      <div style={{ color: '#ecf0f1', fontSize: '11px', textAlign: 'center' }}>
        <div>Head: {data.metadata?.head ? data.metadata.head.slice(0, 8) : 'None'}</div>
        <div>Tail: {data.metadata?.tail ? data.metadata.tail.slice(0, 8) : 'None'}</div>
        <div style={{ marginTop: '3px', fontWeight: 'bold', color: '#3498db' }}>
          Size: {data.metadata?.size || 0}
        </div>
      </div>
    </div>
  );
}

export default ListNode;
