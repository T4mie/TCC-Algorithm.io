import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

export default function HelpWidget({ label = 'Texto', inline = false, sizeScale = 1 }) {
  const [isOpen, setIsOpen] = useState(false);

  const btnSize = Math.round(48 * sizeScale);

  const ButtonElement = (
    <button
      aria-label="Ajuda"
      onClick={() => setIsOpen(true)}
      style={{
        width: btnSize + 'px',
        height: btnSize + 'px',
        borderRadius: '50%',
        backgroundColor: '#1e427C',
        color: '#fff',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: Math.round(20 * sizeScale) + 'px',
        cursor: 'pointer',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
      }}
    >
      ?
    </button>
  );

  // Modal portal (shared for inline and non-inline)
  const Modal = isOpen ? ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        left: '5%',
        right: '5%',
        top: '5%',
        bottom: '5%',
        background: 'rgba(30,66,124,0.92)',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35)',
        color: '#fff',
        overflow: 'auto',
        zIndex: 10000,
        WebkitBackdropFilter: 'blur(4px)'
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        aria-label="Fechar"
        onClick={() => setIsOpen(false)}
        style={{
          position: 'absolute',
          right: '12px',
          top: '12px',
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          border: 'none',
          background: 'rgba(255,255,255,0.12)',
          color: '#fff',
          cursor: 'pointer',
          fontSize: '18px'
        }}
      >
        ✕
      </button>

      <div style={{ marginTop: '28px', fontSize: '18px' }}>
          <div style={{ color: '#fff', whiteSpace: 'pre-wrap' }}>{label}</div>
      </div>
    </div>,
    document.body
  ) : null;

  if (inline) {
    return (
      <div style={{ display: 'flex', padding: '6px' }}>
        {ButtonElement}
        {Modal}
      </div>
    );
  }

  // non-inline: render fixed button at top-right via portal
  const fixedContainer = (
    <div style={{ position: 'fixed', top: `${16 * sizeScale}px`, right: `${16 * sizeScale}px`, zIndex: 10000 }}>
      {ButtonElement}
    </div>
  );

  return (
    <>
      {ReactDOM.createPortal(fixedContainer, document.body)}
      {Modal}
    </>
  );
}

