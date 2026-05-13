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

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes} edges={edges} nodeTypes={NODE_TYPES}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
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
        <Panel position="center-right">
          <div className='sideBar' style={PANEL_STYLE}>
            {/* RENDERIZAÇÃO MODULARIZADA */}
            {type === 'sll' && (
              <SLLControls 
                nodeLabel={nodeLabel} 
                setNodeLabel={setNodeLabel} 
                handleAddNode={sll.handleAddNode} 
              />
            )}
            {type === 'vector' && (
              <VectorControls states={sharedStates} handlers={vector} />
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}