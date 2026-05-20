import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, Panel, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LinkedListNode from '../custom_node/linkedListNode';
import ListNode from '../custom_node/listNode';
import VectorNode from '../custom_node/vectorNode';
import { fetchSLLData, addNode, startInsertionSort, createVector, fetchVectorData, insertVectorValue } from '../api_antigo';

// ===== CONFIGURAÇÕES =====
const NODE_TYPES = {
  SLL: LinkedListNode,
  list: ListNode,
  vector: VectorNode,
};

const DEFAULT_EDGE_OPTIONS = {
  markerEnd: { type: MarkerType.ArrowClosed, color: '#000' },
  type: 'step',
  style: { stroke: '#000000', strokeWidth: 2 }
};

const PANEL_STYLE = {
  padding: '10px',
  backgroundColor: '#fff',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const INPUT_STYLE = {
  padding: '5px',
  marginRight: '5px'
};

const BUTTON_BASE_STYLE = {
  padding: '5px 10px',
  marginRight: '5px'
};

// ===== COMPONENTE PRINCIPAL =====
export default function View() {
  // Estados do ReactFlow
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Estados da UI - Entrada de dados
  const [nodeLabel, setNodeLabel] = useState('');
  const [vectorSize, setVectorSize] = useState('');
  const [vectorId, setVectorId] = useState('');
  const [vectorValue, setVectorValue] = useState('');

  // Estados da UI - Status
  const [nodeCount, setNodeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Inicializar dados ao montar
  useEffect(() => {
    fetchSLLData(setNodes, setEdges, setNodeCount);
  }, []);

  // ===== HANDLERS =====
  const handleAddNode = () => {
    addNode(
      nodeLabel, 
      setNodeLabel, 
      nodeCount, 
      setNodeCount, 
      setNodes, 
      setEdges, 
      () => fetchSLLData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleCreateVector = () => {
    createVector(
      vectorSize, 
      setVectorSize,
      setNodes, 
      setEdges, 
      setNodeCount, 
      () => fetchVectorData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleInsertVectorValue = () => {
    insertVectorValue(
      vectorId,
      vectorValue,
      setVectorId,
      setVectorValue,
      () => fetchVectorData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleInsertionSort = () => {
    startInsertionSort(
      isAnimating, 
      setIsAnimating, 
      nodes, 
      setNodes, 
      setEdges, 
      animationSpeed
    );
  };

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') callback();
  };

  // ===== ESTADOS COMPUTADOS =====
  const isUIDisabled = isAnimating;

  // ===== ESTILOS DINÂMICOS =====
  const getButtonStyle = (disabled = false, isGreen = false) => ({
    ...BUTTON_BASE_STYLE,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...(isGreen && {
      padding: '8px 15px',
      backgroundColor: disabled ? '#ccc' : '#4CAF50',
      color: '#fff',
      border: 'none',
      borderRadius: '4px',
      fontWeight: 'bold'
    })
  });

  const getInputStyle = (disabled = false) => ({
    ...INPUT_STYLE,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1
  });

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={false}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        style={{ width: '100vw', height: '100vh' }}
      >
        <Background color="grey" variant="dots" />
        <Panel position="center-right">
          <div style={PANEL_STYLE}>
            
            {/* SEÇÃO 1: Adicionar Nó */}
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddNode)}
                placeholder="Rótulo do nó"
                style={getInputStyle(isUIDisabled)}
                disabled={isUIDisabled}
              />
              <button 
                onClick={handleAddNode}
                style={getButtonStyle(isUIDisabled)}
                disabled={isUIDisabled}
              >
                Adicionar Nó
              </button>
            </div>
            
            {/* SEÇÃO 2: Criar Vetor */}
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                value={vectorSize}
                onChange={(e) => setVectorSize(e.target.value)}
                placeholder="Tamanho do vetor"
                style={getInputStyle(isUIDisabled)}
                disabled={isUIDisabled}
              />
              <button 
                onClick={handleCreateVector}
                style={getButtonStyle(isUIDisabled)}
                disabled={isUIDisabled}
              >
                Criar Vetor
              </button>
            </div>
            
            {/* SEÇÃO 3: Inserir Valor no Vetor */}
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                value={vectorId}
                onChange={(e) => setVectorId(e.target.value)}
                placeholder="ID do vetor"
                style={getInputStyle(isUIDisabled)}
                disabled={isUIDisabled}
              />
              <input
                type="text"
                value={vectorValue}
                onChange={(e) => setVectorValue(e.target.value)}
                placeholder="Valor"
                style={getInputStyle(isUIDisabled)}
                disabled={isUIDisabled}
              />
              <button 
                onClick={handleInsertVectorValue}
                style={getButtonStyle(isUIDisabled)}
                disabled={isUIDisabled}
              >
                Inserir Valor
              </button>
            </div>
            
            {/* SEÇÃO 3: Ordenação e Velocidade */}
            <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
              <button 
                onClick={handleInsertionSort}
                style={getButtonStyle(isUIDisabled, true)}
                disabled={isUIDisabled}
              >
                {isAnimating ? 'Ordenando...' : 'Iniciar Insertion Sort'}
              </button>
              
              <label style={{ marginLeft: '10px', fontSize: '12px' }}>
                Velocidade:
                <input
                  type="range"
                  min="100"
                  max="2000"
                  value={animationSpeed}
                  onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
                  disabled={isUIDisabled}
                  style={{ marginLeft: '5px', cursor: isUIDisabled ? 'not-allowed' : 'pointer' }}
                />
                {animationSpeed}ms
              </label>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

