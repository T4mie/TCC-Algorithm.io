// components/SLLControls.js
import React from 'react';

export default function SLLControls({ nodeLabel, setNodeLabel, handleAddNode, centerView }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddNode();
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
        <input 
          value={nodeLabel} 
          onChange={(e) => setNodeLabel(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Rótulo do nó" 
          style={{ flex: 1 }}
        />
        <button onClick={handleAddNode}>Adicionar Nó</button>
      </div>
      <div style={{ marginTop: '8px' }}>
        <button onClick={() => centerView && centerView()} style={{ width: '100%' }}>Centralizar</button>
      </div>
    </div>
  );
}