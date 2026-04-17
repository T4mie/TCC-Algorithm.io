import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Panel, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LinkedListNode from './custom_node/linkedListNode';
import { fetchData, addNode, startInsertionSort, createVector, fetchVectorData } from './api';

const nodeTypes = {
  SLL: LinkedListNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeType, setNodeType] = useState('SLL');
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeCount, setNodeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const [vectorSize, setVectorSize] = useState('');

  // Carregar dados do backend ao montar o componente
  useEffect(() => {
    fetchData(setNodes, setEdges, setNodeCount);
  }, []);

  const addNodeHandler = () => {
    addNode(nodeLabel, setNodeLabel, nodeCount, setNodeCount, setNodes, setEdges, () => fetchData(setNodes, setEdges, setNodeCount));
  };

  const createVectorHandler = () => {
    createVector(vectorSize, setNodes, setEdges, setNodeCount, () => fetchVectorData(setNodes, setEdges, setNodeCount));
  };

  const startInsertionSortHandler = () => {
    startInsertionSort(isAnimating, setIsAnimating, nodes, setNodes, setEdges, animationSpeed);
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={false}
        defaultEdgeOptions={{
          markerEnd: { type: MarkerType.ArrowClosed, color: '#000' },
          style: { stroke: '#000000', strokeWidth: 2 }
        }}
        style={{ width: '100vw', height: '100vh' }}
      >
        <Background color="grey" variant="dots" />
        <Panel position="top-left">
          <div style={{ padding: '10px', backgroundColor: '#fff', borderRadius: '5px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={nodeLabel}
                onChange={(e) => setNodeLabel(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addNodeHandler()}
                placeholder="Rótulo do nó"
                style={{ padding: '5px', marginRight: '5px' }}
                disabled={isAnimating}
              />
              <button 
                onClick={addNodeHandler} 
                style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer', opacity: isAnimating ? 0.6 : 1 }}
                disabled={isAnimating}
              >
                Adicionar Nó
              </button>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <input
                type="number"
                value={vectorSize}
                onChange={(e) => setVectorSize(e.target.value)}
                placeholder="Tamanho do vetor"
                style={{ padding: '5px', marginRight: '5px' }}
                disabled={isAnimating}
              />
              <button 
                onClick={createVectorHandler} 
                style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer', opacity: isAnimating ? 0.6 : 1 }}
                disabled={isAnimating}
              >
                Criar Vetor
              </button>
            </div>
            
            <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
              <button 
                onClick={startInsertionSortHandler}
                style={{
                  padding: '8px 15px',
                  backgroundColor: isAnimating ? '#ccc' : '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  marginRight: '10px',
                  fontWeight: 'bold'
                }}
                disabled={isAnimating}
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
                  disabled={isAnimating}
                  style={{ marginLeft: '5px', cursor: isAnimating ? 'not-allowed' : 'pointer' }}
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

export default App;
