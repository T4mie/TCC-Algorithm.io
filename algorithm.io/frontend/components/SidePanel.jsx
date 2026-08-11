import React, { useState } from 'react';
import SLLControls from '../components/controls/SLLControls';
import VectorControls from '../components/controls/VectorControls';
import StackControls from '../components/controls/StackControls';
import QueueControls from '../components/controls/QueueControls';
import '../css/sideBar.css';
import { motion } from 'framer-motion';
import HelpWidget from './HelpWidget';

// Painel lateral retrátil que contém os controles da estrutura de dados
// atualmente selecionada (SLL, fila, pilha ou vetor), além do botão de
// abrir/fechar o painel e o widget de ajuda contextual.
export default function SidePanel({ props }) {
  const [isOpen, setIsOpen] = useState(false);

  // Variantes de animação do painel (aberto/fechado) usadas pelo framer-motion
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

  // Texto de ajuda exibido no HelpWidget, escolhido de acordo com o tipo
  // de estrutura de dados atualmente exibida (sll, queue, stack ou vector)
  const helpText = props.type === 'sll'
    ? `A Lista Simplesmente Ligada é uma estrutura de dados linear onde cada elemento aponta para o próximo elemento na sequência.\n\nComo Utilizar? \n\nInsira um valor de caractere único e escolha onde inserir: "Adicionar no Fim" (após o tail) ou "Adicionar no Início" (antes do head).\n\nUse "Remover do Início" ou "Remover do Fim" para tirar o nó correspondente. O nó atual do head e do tail é sempre indicado por cor.`
    : props.type === 'queue'
      ? `A Fila é uma estrutura de dados linear que segue a regra FIFO, onde o primeiro valor a entrar é o primeiro a sair.\n\nComo Utilizar? \n\nInsira um valor e clique em "Enfileirar" ou "Desenfileirar" para iniciar a simulação passo a passo daquele método. \n\nUse "Voltar" e "Próximo" para acompanhar cada etapa e "Ver Código" para ver o algoritmo destacado em pseudocódigo, Java ou Python.`
      : props.type === 'stack'
        ? `A Pilha é uma estrutura de dados linear que segue a regra LIFO, onde o último valor a entrar é o primeiro a sair.\n\nComo Utilizar? \n\nDetermine um tamanho de até 15 para a pilha e clique em "Criar Pilha". \n\nDigite um valor e clique em "Empilhar" (push) ou "Remover do Topo" (pop) para iniciar a simulação passo a passo daquele método. \n\nUse "Voltar" e "Próximo" para acompanhar cada etapa e "Ver Código" para ver o algoritmo destacado em pseudocódigo, Java ou Python.`
        : `O Vetor é uma estrutura de dados linear que armazena elementos de forma contígua na memória.\n\nComo Utilizar? \n\nPara utilizar o Vetor, determine um tamanho de até 15 para o vetor e clique no botão "Criar Vetor". \n\nApós isso selecione o índice e o valor que será inserido naquela posição do vetor. \n\nUma vez que o vetor estiver com pelo menos dois elementos você poderá realizar as simulações de sort nele, tanto no modo automático quanto no passo a passo.`;

  return (
    <>
      <motion.div
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        variants={panelVariants}
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          pointerEvents: 'all',
          position: 'relative'
        }}
      >
        {/* Botão que abre/fecha o painel lateral */}
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
        <div className="sideBar">
          {/* Conteúdo Dinâmico */}
          {props.type === 'sll' && (
            <SLLControls
              nodeLabel={props.nodeLabel}
              setNodeLabel={props.setNodeLabel}
              handleAddNodeLast={props.sll.handleAddNode}
              handleAddNodeFirst={props.sll.handleAddNodeFirst}
              handleRemoveFirst={props.sll.handleRemoveFirst}
              handleRemoveLast={props.sll.handleRemoveLast}
              handleClear={props.sll.handleClear}
              centerView={props.centerView}
            />
          )}
          {props.type === 'queue' && (
            <QueueControls states={props.sharedStates} handlers={props.queue} centerView={props.centerView} />
          )}
          {props.type === 'stack' && (
            <StackControls states={props.sharedStates} handlers={props.stack} centerView={props.centerView} />
          )}
          {props.type === 'vector' && (
            <VectorControls states={props.sharedStates} handlers={props.vector} centerView={props.centerView} />
          )}
        </div>
      </motion.div>
    </>
  );
}