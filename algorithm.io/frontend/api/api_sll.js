import { toast } from "sonner";
import { fetchJson, postJson } from "./api_client";

// Transforma os dados retornados pelo backend em nós e arestas para o React Flow.
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
    }
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
    const data = await fetchJson('/SLL_data');
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformBackendData(
      data,
      currentNodes
    );

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error('Erro ao carregar dados de SLL_data:', err);
  }
};

// Limpa a lista no backend, como se ela nunca tivesse sido usada
export const clearSLL = async () => {
  return postJson('/clear_sll', {});
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
    await postJson('/nodes_last', newNodeData);
    setNodeLabel('');
    setNodeCount(nodeCount + 1);
      
      // Passa os nós atuais para preservar posições
    fetchDataCallback(currentNodes);
  } catch (err) {
    toast.error('Erro ao criar nó: ' + err.message);
  }
};