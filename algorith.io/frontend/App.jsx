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
        data: { label: node.label },
      }));

      // Converter edges
      const reactFlowEdges = data.edges.map(edge => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
      setNodeCount(reactFlowNodes.length);
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
            <input
              type="text"
              value={nodeLabel}
              onChange={(e) => setNodeLabel(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNode()}
              placeholder="Rótulo do nó"
              style={{ padding: '5px', marginRight: '5px' }}
            />
            <button onClick={addNode} style={{ padding: '5px 10px', cursor: 'pointer' }}>
              Adicionar Nó
            </button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default App;
