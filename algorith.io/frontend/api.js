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

const transformVectorData = (data) => {
  // Para vetores, criar um único nó representando a barra
  const values = data.nodes.map(node => node.value);
  const labels = data.nodes.map(node => node.label);
  const position = data.nodes[0]?.position || { x: 100, y: 100 };

  const vectorNode = {
    id: 'vector',
    type: 'vector',
    position: position,
    data: {
      values: values,
      labels: labels,
      type: 'vector'
    }
  };

  // Edges podem ser ignorados para vetores, pois é uma representação visual única
  return { reactFlowNodes: [vectorNode], reactFlowEdges: [], dataNodesCount: 1 };
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

export const fetchSLLData = (setNodes, setEdges, setNodeCount) => 
  fetchStructureData('/SLL_data', setNodes, setEdges, setNodeCount);

export const fetchVectorData = async (setNodes, setEdges, setNodeCount) => {
  try {
    const response = await fetch('http://localhost:5000/vector_data');
    const data = await response.json();
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformVectorData(data);
    
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error('Erro ao carregar dados do vetor:', err);
  }
};

export const createVector = async (size, setVectorSize, setNodes, setEdges, setNodeCount, fetchDataCallback) => {
  if (!String(size).trim() || !/^[1-9]\d*$/.test(String(size))) {
    alert('Digite um tamanho de vetor válido (um inteiro positivo).');
    return;
  }

  const createData = {
    value: Number(size),
    position: { x: 100, y: 100 }
  };

  try {
    const response = await fetch('http://localhost:5000/create_vector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(createData)
    });

    if (response.ok) {
      setVectorSize('');
      fetchDataCallback();
      setNodeCount(Number(size));
    } else {
      const error = await response.json();
      alert('Erro ao criar vetor: ' + error.error);
    }
  } catch (err) {
    alert('Erro ao criar vetor: ' + err.message);
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

export const insertVectorValue = async (nodeId, value, setVectorId, setVectorValue, fetchDataCallback) => {
  if (!nodeId.trim() || !value.trim()) {
    console.error('Digite um ID e um valor');
    return;
  }

  const insertData = {
    node_id: nodeId,
    value: value
  };

  try {
    const response = await fetch('http://localhost:5000/insert_vector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(insertData)
    });

    if (response.ok) {
      setVectorId('');
      setVectorValue('');
      fetchDataCallback();
    } 
  } catch (err) {
    alert('Erro ao inserir valor: ' + err.message);
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
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao executar insertion sort');
    }

    const result = await response.json();
    const steps = result.steps;

    // Animar cada passo
    for (const step of steps) {
      // Atualizar nós com estados
      const updatedNodes = nodes.map(node => {
        if (node.type === 'vector') {
          return {
            ...node,
            data: {
              ...node.data,
              values: step.nodes.map(n => n.value),
              comparing: step.comparing || [],
              swapped: step.swapped || []
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

