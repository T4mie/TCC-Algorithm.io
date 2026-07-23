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

  const helpText = props.type === 'sll'
    ? `A Lista Simplesmente Ligada é uma estrutura de dados linear onde cada elemento aponta para o próximo elemento na sequência.\n\nComo Utilizar? \n\nPara utilizar a Lista Simplesmente Ligada, insira um valor de caractere único e clique no botão "Adicionar Nó".\n\nO nó será adicionado à lista sendo indicado se ele é o primeiro da lista (head) ou o último (tail).`
    : props.type === 'queue'
      ? `A Fila é uma estrutura de dados linear que segue a regra FIFO, onde o primeiro valor a entrar é o primeiro a sair.\n\nComo Utilizar? \n\nInsira um valor e use o botão "Enfileirar" para adicionar um elemento. O botão "Desenfileirar" remove o elemento da frente da fila e reorganiza os demais.`
      : props.type === 'stack'
        ? `A Pilha é uma estrutura de dados linear que segue a regra LIFO, onde o último valor a entrar é o primeiro a sair.\n\nNesta versão, a visualização foi criada para seleção e entrada, enquanto a lógica interna ainda está em desenvolvimento.`
        : `O Vetor é uma estrutura de dados linear que armazena elementos de forma contígua na memória.\n\nComo Utilizar? \n\nPara utilizar o Vetor, determine um tamanho de até 15 para o vetor e clique no botão "Criar Vetor". \n\nApós isso selecione o índice e o valor que será inserido naquela posição do vetor. \n\nUma vez que o vetor estiver com pelo menos dois elementos você poderá realizar as simulações de sort nele, tanto no modo automático quanto no passo a passo.`;

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

        <div style={{ position: 'absolute', right: 'calc(100% + 96px)', top: '0px', zIndex: 2 }}>
          <HelpWidget label={helpText} inline sizeScale={0.6} />
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
          {props.type === 'queue' && (
            <SLLControls 
            nodeLabel={props.sharedStates.queueValue} 
            setNodeLabel={props.sharedStates.setQueueValue} 
            handleAddNode={props.queue.handleEnqueue} 
            handleRemoveNode={props.queue.handleDequeue} 
            centerView={props.centerView} 
            />
          )}
          {props.type === 'stack' && (
            <div>
              <motion.div whileTap={{ scale: 0.95 }}>
                <button onClick={() => props.centerView && props.centerView()} className='control-button'>Centralizar</button>
              </motion.div>
              <div style={{ height: '20px' }} />
              <div className='input-container'>
                <input value={props.sharedStates.stackValue} onChange={(e) => props.sharedStates.setStackValue(e.target.value)} type='text' id='stack-input' required />
                <label htmlFor='stack-input' className='label'>Valor da Pilha</label>
                <div className='underline' />
              </div>
              <div style={{ height: '12px' }} />
              <motion.div whileTap={{ scale: 0.95 }}>
                <button disabled className='control-button'>Empilhar</button>
              </motion.div>
              <div style={{ height: '12px' }} />
              <motion.div whileTap={{ scale: 0.95 }}>
                <button disabled className='control-button'>Remover do Topo</button>
              </motion.div>
              <p style={{ fontSize: '12px', color: '#666', marginTop: '12px' }}>A visualização da pilha foi criada para entrada e seleção nesta versão.</p>
            </div>
          )}
          {props.type === 'vector' && (
            <VectorControls states={props.sharedStates} handlers={props.vector} centerView={props.centerView} />
          )}
        </div>
      </motion.div>
    </>
  );
}