import React, { useState, useEffect, useCallback } from 'react';
import { ReactFlow, Background, Panel, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LinkedListNode from './custom_node/linkedListNode';

const nodeTypes = {
  LLN: LinkedListNode,
};

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeCount, setNodeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(500);

  // Carregar dados do backend ao montar o componente
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5000/data');
      const data = await response.json();
      
      // Converter nós do backend para formato ReactFlow
      const reactFlowNodes = data.nodes.map(node => ({
        id: node.id,
        type: 'LLN',
        position: node.position,
        data: { label: node.label, type: node.type, state: null },
      }));

      // Converter edges
      const reactFlowEdges = data.edges.map(edge => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
      const dataNodesCount = reactFlowNodes.filter(n => n.data.type !== 'head' && n.data.type !== 'tail').length;
      setNodeCount(dataNodesCount);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const addNode = async () => {
    if (!nodeLabel.trim()) {
      console.error('Digite um rótulo para o nó');
      return;
    }

    const basePosition = { x: 100, y: 139 };
    const horizontalSpacing = 200;
    const verticalSpacing = 90;
    const nodesPerRow = 5;

    const newPosition = {
      x: basePosition.x + (nodeCount % nodesPerRow) * horizontalSpacing,
      y: basePosition.y + Math.floor(nodeCount / nodesPerRow) * verticalSpacing
    };

    const newNodeData = {
      value: nodeLabel,
      label: nodeLabel,
      position: newPosition,
      type: 'LLN'
    };

    try {
      const response = await fetch('http://localhost:5000/nodes_last', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNodeData)
      });

      if (response.ok) {
        const createdNode = await response.json();
        setNodeLabel('');
        setNodeCount(nodeCount + 1);
        
        // Refetch data to update nodes and edges
        fetchData();
      }
    } catch (err) {
      alert('Erro ao criar nó: ' + err.message);
    }
  };

  const startInsertionSort = async () => {
    if (isAnimating) {
      alert('Algoritmo já em execução!');
      return;
    }

    setIsAnimating(true);

    try {
      const response = await fetch('http://localhost:5000/insertion-sort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        throw new Error('Erro ao executar insertion sort');
      }

      const data = await response.json();
      const steps = data.steps;

      // Animar através de cada passo
      for (let stepIndex = 0; stepIndex < steps.length; stepIndex++) {
        const step = steps[stepIndex];
        
        // Atualizar nós com estado
        const updatedNodes = nodes.map(node => {
          const backendNode = step.nodes.find(n => n.id === node.id);
          if (backendNode) {
            let state = null;
            const nodeIndexInData = step.nodes.findIndex(
              n => n.id === node.id && n.type !== 'head' && n.type !== 'tail'
            );
            
            if (step.comparing.includes(nodeIndexInData)) {
              state = 'comparing';
            } else if (step.swapped.includes(nodeIndexInData)) {
              state = 'swapped';
            }

            return {
              ...node,
              data: {
                ...node.data,
                label: backendNode.label,
                state: state
              }
            };
          }
          return node;
        });

        // Atualizar edges
        const updatedEdges = step.edges.map(edge => ({
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target
        }));

        setNodes(updatedNodes);
        setEdges(updatedEdges);

        // Aguardar antes do próximo frame
        if (stepIndex < steps.length - 1) {
          await new Promise(resolve => setTimeout(resolve, animationSpeed));
        }
      }

      alert('Insertion Sort concluído!');
    } catch (err) {
      console.error('Erro:', err);
      alert('Erro ao executar algoritmo: ' + err.message);
    } finally {
      setIsAnimating(false);
      // Limpar estados dos nós
      setNodes(nodes.map(node => ({
        ...node,
        data: { ...node.data, state: null }
      })));
    }
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
                onKeyPress={(e) => e.key === 'Enter' && addNode()}
                placeholder="Rótulo do nó"
                style={{ padding: '5px', marginRight: '5px' }}
                disabled={isAnimating}
              />
              <button 
                onClick={addNode} 
                style={{ padding: '5px 10px', cursor: isAnimating ? 'not-allowed' : 'pointer', opacity: isAnimating ? 0.6 : 1 }}
                disabled={isAnimating}
              >
                Adicionar Nó
              </button>
            </div>
            
            <div style={{ borderTop: '1px solid #ccc', paddingTop: '10px' }}>
              <button 
                onClick={startInsertionSort}
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
