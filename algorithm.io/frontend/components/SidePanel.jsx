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
          <HelpWidget label={props.type === 'sll' ? `A Lista Simplesmente Ligada é uma estrutura de dados linear onde cada elemento aponta para o próximo elemento na sequência.\n\nComo Utilizar? \n\nPara utilizar a Lista Simplesmente Ligada, insira um valor de caractere único e clique no botão "Adicionar Nó".\n\nO nó será adicionado à lista sendo indicado se ele é o primeiro da lista (head) ou o último (tail).` : `O Vetor é uma estrutura de dados linear que armazena elementos de forma contígua na memória.\n\nComo Utilizar? \n\nPara utilizar o Vetor, determine um tamanho de até 15 para o vetor e clique no botão "Criar Vetor". \n\nApós isso selecione o índice e o valor que será inserido naquela posição do vetor. \n\nUma vez que o vetor estiver com pelo menos dois elementos você poderá realizar as simulações de sort nele, tanto no modo automático quanto no passo a passo.`} inline sizeScale={0.6} />
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