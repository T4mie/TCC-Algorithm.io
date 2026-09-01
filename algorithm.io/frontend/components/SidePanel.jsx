import React, { useState } from 'react';
import SLLControls from '../components/controls/SLLControls';
import VectorControls from '../components/controls/VectorControls';
import ArrayVectorControls from '../components/controls/ArrayVectorControls';
import MergeSortControls from '../components/controls/MergeSortControls';
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
    ? `A Lista Simplesmente Ligada é uma estrutura de dados linear onde cada elemento aponta para o próximo elemento na sequência.\n\nComo Utilizar? \n\nInsira um valor de caractere único e clique em "Inserir no Fim" (após o tail), "Inserir no Início" (antes do head), "Remover do Início" ou "Remover do Fim" para iniciar a simulação passo a passo daquele método. \n\nUse "Voltar" e "Próximo" para acompanhar cada etapa e "Ver Código" para ver o algoritmo destacado em pseudocódigo, Java ou Python. O nó atual do head e do tail é sempre indicado por cor.`
    : props.type === 'queue'
      ? `A Fila é uma estrutura de dados linear que segue a regra FIFO, onde o primeiro valor a entrar é o primeiro a sair.\n\nComo Utilizar? \n\nInsira um valor e clique em "Enfileirar" ou "Desenfileirar" para iniciar a simulação passo a passo daquele método. \n\nUse "Voltar" e "Próximo" para acompanhar cada etapa e "Ver Código" para ver o algoritmo destacado em pseudocódigo, Java ou Python.`
      : props.type === 'stack'
        ? `A Pilha é uma estrutura de dados linear que segue a regra LIFO, onde o último valor a entrar é o primeiro a sair.\n\nComo Utilizar? \n\nDetermine um tamanho de até 15 para a pilha e clique em "Criar Pilha". \n\nDigite um valor e clique em "Empilhar" (push) ou "Remover do Topo" (pop) para iniciar a simulação passo a passo daquele método. \n\nUse "Voltar" e "Próximo" para acompanhar cada etapa e "Ver Código" para ver o algoritmo destacado em pseudocódigo, Java ou Python.`
        : props.type === 'insertion-sort'
          ? `O Insertion Sort é um algoritmo de ordenação que constrói o vetor ordenado um elemento de cada vez.\n\nComo Utilizar? \n\nDetermine um tamanho de até 15 para o vetor e clique no botão "Criar Vetor". \n\nApós isso selecione o índice e o valor que será inserido naquela posição do vetor. \n\nUma vez que o vetor estiver com pelo menos dois elementos você poderá realizar as simulações de ordenação nele, tanto no modo automático quanto no passo a passo.`
          : props.type === 'merge-sort'
            ? `O Merge Sort é um algoritmo de ordenação que divide o vetor recursivamente ao meio até sobrarem elementos únicos, e depois os mescla de volta em ordem.\n\nComo Utilizar? \n\nDetermine um tamanho de até 15 para o vetor e clique no botão "Criar Vetor". \n\nApós isso selecione o índice e o valor que será inserido naquela posição do vetor. \n\nUma vez que o vetor estiver com pelo menos dois elementos você poderá simular a ordenação passo a passo: acompanhe o intervalo [esquerda, direita] de cada chamada recursiva e, durante a mesclagem, os sub-vetores L e R do buffer com os ponteiros i, j e k.`
            : `O Vetor é uma estrutura de dados linear de capacidade fixa que armazena elementos de forma contígua na memória.\n\nComo Utilizar? \n\nDetermine uma capacidade de até 15 para o vetor e clique em "Criar Vetor". \n\nDigite um índice e um valor e clique em "Inserir no Índice", ou digite apenas um índice e clique em "Remover do Índice", para iniciar a simulação passo a passo daquele método (com o deslocamento real dos elementos). \n\nUse "Voltar" e "Próximo" para acompanhar cada etapa e "Ver Código" para ver o algoritmo destacado em pseudocódigo, Java ou Python.`;

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
            <SLLControls states={props.sharedStates} handlers={props.sll} centerView={props.centerView} />
          )}
          {props.type === 'queue' && (
            <QueueControls states={props.sharedStates} handlers={props.queue} centerView={props.centerView} />
          )}
          {props.type === 'stack' && (
            <StackControls states={props.sharedStates} handlers={props.stack} centerView={props.centerView} />
          )}
          {props.type === 'insertion-sort' && (
            <VectorControls states={props.sharedStates} handlers={props.vector} centerView={props.centerView} />
          )}
          {props.type === 'vector' && (
            <ArrayVectorControls states={props.sharedStates} handlers={props.array} centerView={props.centerView} />
          )}
          {props.type === 'merge-sort' && (
            <MergeSortControls states={props.sharedStates} handlers={props.mergeSort} centerView={props.centerView} />
          )}
        </div>
      </motion.div>
    </>
  );
}