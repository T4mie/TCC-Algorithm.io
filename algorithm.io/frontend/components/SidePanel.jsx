import React, { useState } from 'react';
import SLLControls from '../components/controls/SLLControls';
import VectorControls from '../components/controls/VectorControls';
import '../css/sideBar.css';
import { motion} from 'framer-motion';
import HelpWidget from './HelpWidget';

export default function SidePanel({ props }) {
  const [isOpen, setIsOpen] = useState(false);

  const panelVariants = {
    closed: {
      x: '105%',
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
        
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          style={{
            position: 'absolute',    
            right: '100%',           
            marginRight: '16px',     
            top: '0px',             
            cursor: 'pointer',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '8px 12px',    
            borderRadius: '12px',    
            whiteSpace: 'nowrap',
            zIndex: 3
          }}
        >
          {isOpen ? '✕ Fechar' : '☰ Abrir'}
        </button>

        <div style={{
          position: 'absolute',
          right: 'calc(100% + 96px)', /* ajuste horizontal: alterar este valor (96px) para mover o botão mais/menos à esquerda */
          top: '0px',
          zIndex: 2
        }}>
          <HelpWidget label={props.type === 'sll' ? 'Texto 2' : 'Texto 3'} inline sizeScale={0.6} />
        </div>

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