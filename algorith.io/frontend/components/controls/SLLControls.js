// components/SLLControls.js
import React from 'react';

export default function SLLControls({ nodeLabel, setNodeLabel, handleAddNode }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddNode();
  };

  return (
    <div>
      <input 
        value={nodeLabel} 
        onChange={(e) => setNodeLabel(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Rótulo do nó" 
      />
      <button onClick={handleAddNode}>Adicionar Nó</button>
    </div>
  );
}