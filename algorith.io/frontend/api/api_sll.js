export const transformBackendData = (data, currentNodes = []) => {
  // Criar mapa das posições atuais
  const positionMap = new Map(
    currentNodes.map(node => [node.id, node.position])
  );

  // Converter nós do backend, mas preservar posições
  const reactFlowNodes = data.nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: positionMap.get(node.id) || node.position,
    data: { 
      label: node.label, 
      type: node.type, 
      state: null,
      metadata: node.metadata 
    },
  }));

  // Converter edges E usar o type como sourceHandle quando necessário
  const reactFlowEdges = data.edges.map(edge => {
    const baseEdge = {
      id: `${edge.source}-${edge.target}-${edge.type}`,
      source: edge.source,
      target: edge.target
    };
    
    // Se a edge for do tipo "head" ou "tail", usar como handle
    if (edge.type === "head" || edge.type === "tail") {
      baseEdge.sourceHandle = edge.type;
    }
    
    return baseEdge;
  });

  const dataNodesCount = reactFlowNodes.filter(n => n.data.type !== 'list').length;
  return { reactFlowNodes, reactFlowEdges, dataNodesCount };
};

export const fetchSLLData = async (setNodes, setEdges, setNodeCount, currentNodes) => {
  try {
    const response = await fetch(`http://localhost:5000/SLL_data`);
    const data = await response.json();
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformBackendData(
      data, 
      currentNodes // ← Passa os nós atuais
    );
    
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error(`Erro ao carregar dados de SLL_data:`, err);
  }
};


export const addNode = async (
  nodeLabel, 
  setNodeLabel, 
  nodeCount, 
  setNodeCount, 
  setNodes, 
  setEdges, 
  fetchDataCallback,
  currentNodes // ← Novo parâmetro
) => {
  if (!nodeLabel.trim()) {
    console.error('Digite um rótulo para o nó');
    return;
  }

  const basePosition = { x: 600, y: 0 };
  const horizontalSpacing = 0;
  const verticalSpacing = 80;
  // const nodesPerColumn = 5; // Quantos nós por coluna antes de começar uma nova linha

  const newPosition = {
    x: basePosition.x + (nodeCount) * horizontalSpacing,
    y: basePosition.y + Math.floor(nodeCount) * verticalSpacing
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
      setNodeLabel('');
      setNodeCount(nodeCount + 1);
      
      // Passa os nós atuais para preservar posições
      fetchDataCallback(currentNodes);
    }
  } catch (err) {
    alert('Erro ao criar nó: ' + err.message);
  }
};