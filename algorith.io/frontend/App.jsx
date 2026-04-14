import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function App() {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
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
        position: node.position,
        data: { label: node.label },
        type: node.type
      }));

      // Converter edges
      const reactFlowEdges = data.edges.map(edge => ({
        id: `${edge.source}-${edge.target}`,
        source: edge.source,
        target: edge.target
      }));

      setNodes(reactFlowNodes);
      setEdges(reactFlowEdges);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    }
  };

  const addNode = async () => {
    if (!nodeLabel.trim()) {
      alert('Digite um rótulo para o nó');
      return;
    }

    const newPosition = {
      x: (nodeCount % 5) * 50,
      y: Math.floor(nodeCount / 5) * 50
    };

    const newNodeData = {
      value: nodeLabel,
      label: nodeLabel,
      position: newPosition,
      type: 'default'
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
        
        // Adicionar o novo nó ao estado
        setNodes(prev => [...prev, {
          id: createdNode.id,
          position: createdNode.position,
          data: { label: createdNode.label },
          type: createdNode.type
        }]);

        // Atualizar edges se houver
        if (nodes.length > 0) {
          const lastNode = nodes[nodes.length - 1];
          const newEdge = {
            id: `${lastNode.id}-${createdNode.id}`,
            source: lastNode.id,
            target: createdNode.id
          };
          setEdges(prev => [...prev, newEdge]);
        }
      }
    } catch (err) {
      alert('Erro ao criar nó: ' + err.message);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow nodes={nodes} edges={edges} style={{ width: '100vw', height: '100vh' }}>
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
