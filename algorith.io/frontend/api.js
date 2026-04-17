export const fetchData = async (setNodes, setEdges, setNodeCount) => {
  try {
    const response = await fetch('http://localhost:5000/data');
    const data = await response.json();
    
    // Converter nós do backend para formato ReactFlow
    const reactFlowNodes = data.nodes.map(node => ({
      id: node.id,
      type: node.type,
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

export const fetchVectorData = async (setNodes, setEdges, setNodeCount) => {
  try {
    const response = await fetch('http://localhost:5000/vector_data');
    const data = await response.json();
    
    // Converter nós do backend para formato ReactFlow
    const reactFlowNodes = data.nodes.map(node => ({
      id: node.id,
      type: node.type,
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
    console.error('Erro ao carregar dados do vetor:', err);
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

export const createVector = async (size, setNodes, setEdges, setNodeCount, fetchDataCallback) => {
  const newVectorData = {
    value: size,
    position: { x: 100, y: 139 }
  };

  try {
    const response = await fetch('http://localhost:5000/create_vector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVectorData)
    });

    if (response.ok) {
      const createdNodes = await response.json();
      fetchDataCallback();
    }
  } catch (err) {
    alert('Erro ao criar vetor: ' + err.message);
  }
};

