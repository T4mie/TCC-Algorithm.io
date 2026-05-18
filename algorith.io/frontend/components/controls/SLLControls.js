// components/SLLControls.js
import React from 'react';
import '../../css/controls.css';
import { motion } from 'framer-motion';

export default function SLLControls({ nodeLabel, setNodeLabel, handleAddNode, centerView }) {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddNode();
  };

  return (
    <div>
      <motion.div whileTap={{ scale: 0.95 }}>
        <button onClick={() => centerView && centerView()} className="control-button">Centralizar</button>
      </motion.div>
      <div style={{ height: '20px' }} />
      <div className="input-container">
        <input value={nodeLabel} onChange={(e) => setNodeLabel(e.target.value)} onKeyPress={handleKeyPress} type="text" id="input" required />
        <label htmlFor="input" className="label">Valor do Nó</label>
        <div className="underline" />
      </div>
      <div style={{ height: '12px' }} />
      <motion.div whileTap={{ scale: 0.95 }}>
        <button onClick={handleAddNode} className="control-button">Adicionar Nó</button>
      </motion.div>
    </div>
  );
}