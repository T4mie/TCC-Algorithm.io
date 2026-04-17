// ===== UTILITÁRIOS DE TRANSFORMAÇÃO =====
const transformBackendData = (data) => {
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

// ===== FUNÇÃO GENÉRICA =====
const fetchStructureData = async (endpoint, setNodes, setEdges, setNodeCount) => {
  try {
    const response = await fetch(`http://localhost:5000${endpoint}`);
    const data = await response.json();
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformBackendData(data);
    
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error(`Erro ao carregar dados de ${endpoint}:`, err);
  }
};

// ===== FUNÇÕES PÚBLICAS =====
export const fetchSLLData = (setNodes, setEdges, setNodeCount) => 
  fetchStructureData('/SLL_data', setNodes, setEdges, setNodeCount);

export const fetchVectorData = (setNodes, setEdges, setNodeCount) => 
  fetchStructureData('/vector_data', setNodes, setEdges, setNodeCount);

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

export const startInsertionSort = async (isAnimating, setIsAnimating, nodes, setNodes, setEdges, animationSpeed) => {
  if (isAnimating) return;

  setIsAnimating(true);

  try {
    const response = await fetch('http://localhost:5000/insertion-sort', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Erro ao executar insertion sort');
    }

    const result = await response.json();
    const steps = result.steps;

    // Animar cada passo
    for (const step of steps) {
      // Atualizar nós com estados
      const updatedNodes = nodes.map(node => {
        const stepNode = step.nodes.find(n => n.id === node.id);
        if (stepNode) {
          return {
            ...node,
            data: {
              ...node.data,
              label: stepNode.label,
              state: null
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

      // Aguardar antes do próximo passo
      await new Promise(resolve => setTimeout(resolve, animationSpeed));
    }
  } catch (err) {
    console.error('Erro ao executar insertion sort:', err);
    alert('Erro ao executar insertion sort: ' + err.message);
  } finally {
    setIsAnimating(false);
  }
};

