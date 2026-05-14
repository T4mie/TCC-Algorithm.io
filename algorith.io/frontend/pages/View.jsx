// views/View.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReactFlow, Background, Panel, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import '../css/sideBar.css';

// Importando Handlers e Custom Nodes
import { useSLLHandlers } from '../handlers/sll_handle';
import { useVectorHandlers } from '../handlers/vector_handle';
import LinkedListNode from '../custom_node/linkedListNode';
import ListNode from '../custom_node/listNode';
import VectorNode from '../custom_node/vectorNode';

// Importando os novos painéis modularizados
import SLLControls from '../components/controls/SLLControls';
import VectorControls from '../components/controls/VectorControls';

const NODE_TYPES = { SLL: LinkedListNode, list: ListNode, vector: VectorNode };
const DEFAULT_EDGE_OPTIONS = { markerEnd: { type: MarkerType.ArrowClosed, color: '#000' }, style: { stroke: '#000000', strokeWidth: 2 } };
const PANEL_STYLE = { padding: '10px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' };

export default function View() {
  const { type } = useParams();

  // Estados Gerais
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCount, setNodeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [rfInstance, setRfInstance] = useState(null);

  // Estados Específicos
  const [nodeLabel, setNodeLabel] = useState('');
  const [vectorSize, setVectorSize] = useState('');
  const [vectorId, setVectorId] = useState('');
  const [vectorValue, setVectorValue] = useState('');
  const [vectorType, setVectorType] = useState('int');

  const sharedStates = { 
    nodes, setNodes, edges, setEdges, nodeCount, setNodeCount, 
    isAnimating, setIsAnimating, animationSpeed, setAnimationSpeed, // <- adicionei setAnimationSpeed
    nodeLabel, setNodeLabel, vectorSize, setVectorSize, 
    vectorId, setVectorId, vectorValue, setVectorValue,
    steps, setSteps, currentStep, setCurrentStep,
    vectorType, setVectorType
  };

  const sll = useSLLHandlers(sharedStates);
  const vector = useVectorHandlers(sharedStates);
  const handlers = type === 'sll' ? sll : vector;

  useEffect(() => {
    if (handlers.fetchData) handlers.fetchData(nodes);
  }, [type]);

  function openWindow() {

    window.electronAPI.openChildWindow();

  }

  const centerView = async () => {
    if (!rfInstance) return;
    if (!nodes || nodes.length === 0) return;

    // get current viewport (pan + zoom)
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

    // container rect to convert screen coords
    const container = document.querySelector('.react-flow') || document.querySelector('.reactflow-wrapper') || document.querySelector('.react-flow__renderer') || document.body;
    const containerRect = container.getBoundingClientRect ? container.getBoundingClientRect() : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

    let minWorldX = Infinity, minWorldY = Infinity, maxWorldX = -Infinity, maxWorldY = -Infinity;

    for (const n of nodes) {
      const pos = n.position || { x: 0, y: 0 };
      const domNode = document.querySelector(`.react-flow__node[data-id="${n.id}"]`);

      if (domNode && domNode.getBoundingClientRect) {
        const rect = domNode.getBoundingClientRect();
        // compute world coords for dom rect edges
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
        // fallback to position-only (assume small node)
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

    // compute viewport pan so that world center maps to screen center, preserving zoom
    const x = width / 2 - centerWorldX * currentZoom;
    let y = height / 2 - centerWorldY * currentZoom;

    // If viewing the vector, shift slightly upward so it appears above center
    if (type === 'vector') {
      const shiftPx = 80; // adjust this value to move more/less
      y -= shiftPx;
    }

    try {
      if (typeof rfInstance.setViewport === 'function') {
        await rfInstance.setViewport({ x, y, zoom: currentZoom });
      } else if (typeof rfInstance.fitView === 'function') {
        // fallback: call fitView then restore zoom
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
      <ReactFlow 
        nodes={nodes} edges={edges} nodeTypes={NODE_TYPES}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
        onInit={setRfInstance}
      >
        <Background />
        <Panel position="top-left">
           <Link to="/" style={{textDecoration: 'none', color: 'blue'}}>← Voltar</Link>
        </Panel>
        <Panel position="bottom-left">
          <a onClick={openWindow}>
            <div style={{width:'100px',height:'100px',backgroundColor:'#000'}}>
            </div>
          </a>
        </Panel>
        {/* Centralizar é fornecido nos painéis de controle abaixo */}
        <Panel position="center-right">
          <div className='sideBar' style={PANEL_STYLE}>
            {/* RENDERIZAÇÃO MODULARIZADA */}
            {type === 'sll' && (
              <SLLControls 
                nodeLabel={nodeLabel} 
                setNodeLabel={setNodeLabel} 
                handleAddNode={sll.handleAddNode}
                centerView={centerView}
              />
            )}
            {type === 'vector' && (
              <VectorControls states={sharedStates} handlers={vector} centerView={centerView} />
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}