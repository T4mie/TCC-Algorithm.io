import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactFlow, Background, Panel, useNodesState, useEdgesState, MarkerType, MiniMap } from '@xyflow/react';
import { Toaster } from 'sonner';
import { motion } from 'framer-motion';
import '@xyflow/react/dist/style.css';
import '../css/view.css';

import { useSLLHandlers } from '../handlers/sll_handle';
import { useVectorHandlers } from '../handlers/vector_handle';
import { useStackHandlers } from '../handlers/stack_handle';
import { useQueueHandlers } from '../handlers/queue_handle';
import LinkedListNode from '../custom_node/linkedListNode';
import ListNode from '../custom_node/listNode';
import VectorNode from '../custom_node/vectorNode';
import StackNode from '../custom_node/stackNode';
import SidePanel from '../components/SidePanel';

// Mapeia o tipo de nó do React Flow para o componente customizado que o renderiza.
const NODE_TYPES = { SLL: LinkedListNode, list: ListNode, vector: VectorNode, stack: StackNode };
// Estilo padrão aplicado a todas as arestas do grafo (seta preta com espessura fixa).
const DEFAULT_EDGE_OPTIONS = { markerEnd: { type: MarkerType.ArrowClosed, color: '#000' }, style: { stroke: '#000000', strokeWidth: 2, zIndex: 10 } };

// Página principal de visualização: monta o canvas do React Flow para a estrutura
// de dados selecionada (SLL, vetor, fila ou pilha) e conecta os controles do
// SidePanel aos handlers específicos de cada estrutura.
export default function View() {
  const { type } = useParams();

  // Estados Gerais
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCount, setNodeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [rfInstance, setRfInstance] = useState(null);

  // Estados Específicos
  const [nodeLabel, setNodeLabel] = useState('');
  const [vectorSize, setVectorSize] = useState('');
  const [vectorId, setVectorId] = useState('');
  const [vectorValue, setVectorValue] = useState('');
  const [vectorType, setVectorType] = useState('int');
  const [queueValue, setQueueValue] = useState('');
  const [stackValue, setStackValue] = useState('');
  const [stackSize, setStackSize] = useState('');
  const [stackType, setStackType] = useState('int');
  const [stackOperation, setStackOperation] = useState(null);
  const [queueOperation, setQueueOperation] = useState(null);

  const sharedStates = {
    nodes, setNodes, edges, setEdges, nodeCount, setNodeCount,
    isAnimating, setIsAnimating,
    nodeLabel, setNodeLabel, vectorSize, setVectorSize,
    vectorId, setVectorId, vectorValue, setVectorValue,
    steps, setSteps, currentStep, setCurrentStep,
    vectorType, setVectorType,
    queueValue, setQueueValue,
    stackValue, setStackValue,
    stackSize, setStackSize,
    stackType, setStackType,
    stackOperation, setStackOperation,
    queueOperation, setQueueOperation
  };

  const sll = useSLLHandlers(sharedStates);
  const vector = useVectorHandlers(sharedStates);
  const queue = useQueueHandlers(sharedStates);
  const stack = useStackHandlers(sharedStates);
  const handlers = type === 'sll' ? sll : type === 'vector' ? vector : type === 'stack' ? stack : type === 'queue' ? queue : { fetchData: () => {} };

  // Sempre que o tipo de estrutura (parâmetro de rota) mudar, limpa o canvas
  // e busca os dados iniciais da estrutura correspondente no backend.
  useEffect(() => {
    if (type === 'sll') {
      setNodes([]); setEdges([]); setNodeCount(0); handlers.fetchData([]); return;
    }
    if (type === 'vector') {
      setNodes([]); setEdges([]); setNodeCount(0); handlers.fetchData([]); return;
    }
    if (type === 'stack') {
      setNodes([]); setEdges([]); setNodeCount(0); handlers.fetchData([]); return;
    }
    if (type === 'queue') {
      setNodes([]); setEdges([]); setNodeCount(0); handlers.fetchData([]); return;
    }
    setNodes([]); setEdges([]); setNodeCount(0);
  }, [type]);

  // Abre (via Electron/IPC) a janela filha de visualização de código para o
  // tipo de estrutura atual, sincronizada com o passo atualmente exibido.
  function openWindow() {
    // Passa currentStep para que o CodeView abra com o passo correto destacado.
    const stepToSend = typeof currentStep === 'number' ? currentStep : -1;
    window.electronAPI.openChildWindow(type, stepToSend);
  }

  // Centraliza a viewport do React Flow no conjunto de nós atualmente renderizados,
  // calculando o bounding box em coordenadas de mundo a partir do DOM e preservando o zoom.
  const centerView = async () => {
    if (!rfInstance) return;
    if (!nodes || nodes.length === 0) return;

    // obtém a viewport atual (pan + zoom)
    let currentZoom = 1;
    let currentPanX = 0;
    let currentPanY = 0;
    try {
      const vp = typeof rfInstance.getViewport === 'function' ? await rfInstance.getViewport() : null;
      if (vp) {
        if (typeof vp.zoom === 'number') currentZoom = vp.zoom;
        if (typeof vp.x === 'number') currentPanX = vp.x;
        if (typeof vp.y === 'number') currentPanY = vp.y;
      }
    } catch (e) { /* ignore */ }

    // retângulo do container para converter coordenadas de tela
    const container = document.querySelector('.react-flow') || document.querySelector('.reactflow-wrapper') || document.querySelector('.react-flow__renderer') || document.body;
    const containerRect = container.getBoundingClientRect ? container.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    let minWorldX = Infinity, minWorldY = Infinity, maxWorldX = -Infinity, maxWorldY = -Infinity;

    for (const n of nodes) {
      const pos = n.position || { x: 0, y: 0 };
      const domNode = document.querySelector(`.react-flow__node[data-id="${n.id}"]`);

      if (domNode && domNode.getBoundingClientRect) {
        const rect = domNode.getBoundingClientRect();
        // calcula as coordenadas de mundo para as bordas do retângulo DOM
        const leftScreen = rect.left;
        const rightScreen = rect.right;
        const topScreen = rect.top;
        const bottomScreen = rect.bottom;

        const worldLeft = (leftScreen - containerRect.left - currentPanX) / Math.max(currentZoom, 0.0001);
        const worldRight = (rightScreen - containerRect.left - currentPanX) / Math.max(currentZoom, 0.0001);
        const worldTop = (topScreen - containerRect.top - currentPanY) / Math.max(currentZoom, 0.0001);
        const worldBottom = (bottomScreen - containerRect.top - currentPanY) / Math.max(currentZoom, 0.0001);

        if (worldLeft < minWorldX) minWorldX = worldLeft;
        if (worldTop < minWorldY) minWorldY = worldTop;
        if (worldRight > maxWorldX) maxWorldX = worldRight;
        if (worldBottom > maxWorldY) maxWorldY = worldBottom;
      } else {
        // alternativa: usa apenas a posição (assume nó pequeno)
        if (pos.x < minWorldX) minWorldX = pos.x;
        if (pos.y < minWorldY) minWorldY = pos.y;
        if (pos.x > maxWorldX) maxWorldX = pos.x;
        if (pos.y > maxWorldY) maxWorldY = pos.y;
      }
    }

    if (minWorldX === Infinity) return;

    const centerWorldX = (minWorldX + maxWorldX) / 2;
    const centerWorldY = (minWorldY + maxWorldY) / 2;

    const width = containerRect.width || window.innerWidth;
    const height = containerRect.height || window.innerHeight;

    // calcula o pan da viewport para que o centro do mundo mapeie ao centro da tela, preservando o zoom
    const x = width / 2 - centerWorldX * currentZoom;
    let y = height / 2 - centerWorldY * currentZoom;

    // Ao visualizar o vetor, desloca levemente para cima para que apareça acima do centro
    if (type === 'vector') {
      const shiftPx = 80; // ajuste este valor para mover mais ou menos
      y -= shiftPx;
    }

    try {
      if (typeof rfInstance.setViewport === 'function') {
        await rfInstance.setViewport({ x, y, zoom: currentZoom });
      } else if (typeof rfInstance.fitView === 'function') {
        // alternativa: chama fitView e depois restaura o zoom
        await rfInstance.fitView({ padding: 0.1 });
        if (typeof rfInstance.setViewport === 'function') {
          await rfInstance.setViewport({ x, y, zoom: currentZoom });
        }
      }
    } catch (e) {
      console.warn('Erro ao centralizar view:', e);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Toaster richColors position="top-center"></Toaster>
      <ReactFlow 
        nodes={nodes} edges={edges} nodeTypes={NODE_TYPES}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onInit={setRfInstance}
      >
        <Background />
        <Panel position="top-left">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Link to="/" className="exitBtn" >
              <div className="sign">Retornar</div>
            </Link>
          </motion.div>
        </Panel>
        <Panel position="bottom-left">
          <a onClick={openWindow}>
            <div className="codeBtn">
              Ver Código
            </div>
          </a>
        </Panel>
        <Panel position="bottom-right">
          <MiniMap nodeStrokeWidth={3}/>
        </Panel>
        <Panel position="center-right" className="app-side-panel">
          <SidePanel props={{ type, nodeLabel, setNodeLabel, sll, vector, queue, stack, sharedStates, centerView }} />
        </Panel>
      </ReactFlow>
      
    </div>
  );
}