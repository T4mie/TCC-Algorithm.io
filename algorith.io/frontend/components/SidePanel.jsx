import React, { useState } from 'react';
import SLLControls from '../components/controls/SLLControls';
import VectorControls from '../components/controls/VectorControls';
import '../css/sideBar.css';
import { motion} from 'framer-motion';

export default function SidePanel({ props }) {
  const [isOpen, setIsOpen] = useState(false);

  const panelVariants = {
    closed: {
      x: '90%',
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    open: {
      x: 0,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    }
  };

  return (
    <>
      <motion.div 
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={panelVariants}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          pointerEvents: 'all',
          position: 'relative'
        }}
      >
        
        {/* O BOTÃO AGORA FICA AQUI: Sempre visível e colado na esquerda do painel */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            transform: 'translateX(-1%)',
            cursor: 'pointer',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRight: 'none', // Remove a borda que encosta no painel
            borderRadius: '4px 0 0 4px', // Arredonda apenas os cantos esquerdos
            whiteSpace: 'nowrap'
          }}
        >
          {isOpen ? '✕ Fechar' : '☰ Abrir'}
        </button>

        {/* O Painel Lateral em si */}
        <div 
          className='sideBar'
        >
          {/* Conteúdo Dinâmico */}
          {props.type === 'sll' && (
            <SLLControls 
              nodeLabel={props.nodeLabel} 
              setNodeLabel={props.setNodeLabel} 
              handleAddNode={props.sll.handleAddNode} 
              centerView={props.centerView}
            />
          )}
          {props.type === 'vector' && (
            <VectorControls states={props.sharedStates} handlers={props.vector} centerView={props.centerView} />
          )}
        </div>

      </motion.div>
    </>
  );
}