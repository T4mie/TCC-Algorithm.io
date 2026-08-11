// components/SLLControls.js
import React from 'react';
import '../../css/controls.css';
import { motion } from 'framer-motion';

// Controles laterais da Lista Simplesmente Ligada: campo de valor do nó e
// botões para adicionar/remover no início ou no fim, além de limpar a lista.
export default function SLLControls({
  nodeLabel, setNodeLabel,
  handleAddNodeLast, handleAddNodeFirst,
  handleRemoveFirst, handleRemoveLast,
  handleClear, centerView
}) {
  // Permite adicionar o nó no fim da lista pressionando Enter no campo de valor
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleAddNodeLast();
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
        <button onClick={handleAddNodeLast} className="control-button">
          Adicionar no Fim
        </button>
      </motion.div>
      <div style={{ height: '12px' }} />

      <motion.div whileTap={{ scale: 0.95 }}>
        <button onClick={handleAddNodeFirst} className="control-button">
          Adicionar no Início
        </button>
      </motion.div>
      <div style={{ height: '20px' }} />

      <motion.div whileTap={{ scale: 0.95 }}>
        <button onClick={handleRemoveFirst} className="control-button control-button-danger">
          Remover do Início
        </button>
      </motion.div>
      <div style={{ height: '12px' }} />

      <motion.div whileTap={{ scale: 0.95 }}>
        <button onClick={handleRemoveLast} className="control-button control-button-danger">
          Remover do Fim
        </button>
      </motion.div>
      <div style={{ height: '20px' }} />

      <motion.div whileTap={{ scale: 0.95 }}>
        <button onClick={handleClear} className="control-button control-button-danger">
          Limpar
        </button>
      </motion.div>
    </div>
  );
}
