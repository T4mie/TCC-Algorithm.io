export const transformBackendData = (data) => {
  // Converter nós do backend para formato ReactFlow
  const reactFlowNodes = data.nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: { 
      label: node.label, 
      type: node.type, 
      state: null,
      metadata: node.metadata 
    },
  }));

  // Converter edges
  const reactFlowEdges = data.edges.map(edge => ({
    id: `${edge.source}-${edge.target}-${edge.type}`,
    source: edge.source,
    target: edge.target
  }));

  const dataNodesCount = reactFlowNodes.filter(n => n.data.type !== 'list').length;
  return { reactFlowNodes, reactFlowEdges, dataNodesCount };
};

export const fetchSLLData = async (setNodes, setEdges, setNodeCount) => {
  try {
    const response = await fetch(`http://localhost:5000/SLL_data`);
    const data = await response.json();
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformBackendData(data);
    
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error(`Erro ao carregar dados de SLL_data:`, err);
  }
};

export const addNode = async (nodeLabel, setNodeLabel, nodeCount, setNodeCount, setNodes, setEdges, fetchDataCallback) => {
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
    type: 'SLL'
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
      fetchDataCallback();
    }
  } catch (err) {
    alert('Erro ao criar nó: ' + err.message);
  }
};
