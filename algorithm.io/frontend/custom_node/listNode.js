import React from 'react';
import { Handle, Position } from '@xyflow/react';

// Nó customizado que representa o objeto "Lista" em si (metadados): tamanho atual,
// e os nós de head/tail, com um valor ativo opcional em destaque.
function ListNode({ data }) {
  const size = data.metadata?.size ?? 0;
  const headLabel = data.metadata?.head ? String(data.metadata.head).slice(0, 8) : '—';
  const tailLabel = data.metadata?.tail ? String(data.metadata.tail).slice(0, 8) : '—';
  const title = data.label || 'Lista';
  const hasActiveValue = data.activeValue !== undefined && data.activeValue !== null;

  return (
    <div style={{ position: 'relative' }}>
      <div style={{
        fontFamily: 'Menlo, Monaco, "Courier New", monospace',
        fontSize: '11px',
        lineHeight: 1.6,
        color: '#00ff88',
        background: '#1b2530',
        border: '2px solid #34495e',
        borderRadius: '8px',
        padding: '10px 14px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
        minWidth: '160px',
        textAlign: 'left',
      }}>
        <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '11px', marginBottom: '4px' }}>
          {title}
        </div>
        <div>{`tamanho: ${size}`}</div>
        <div style={{ color: '#2ecc71' }}>{`head: ${headLabel}`}</div>
        <div style={{ color: '#e67e22' }}>{`tail: ${tailLabel}`}</div>
        {hasActiveValue && (
          <div style={{ color: '#f1c40f' }}>{`valor: ${data.activeValue}`}</div>
        )}
      </div>

      {/* Handles coloridos e separados: head à esquerda, tail à direita */}
      <Handle
        id="head"
        type="source"
        position={Position.Bottom}
        style={{ left: '30%', background: '#2ecc71', width: 10, height: 10, borderRadius: '50%' }}
      />
      <Handle
        id="tail"
        type="source"
        position={Position.Bottom}
        style={{ left: '70%', background: '#e67e22', width: 10, height: 10, borderRadius: '50%' }}
      />
    </div>
  );
}

export default ListNode;
