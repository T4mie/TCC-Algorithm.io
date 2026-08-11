import { toast } from 'sonner';
import { MarkerType } from '@xyflow/react';
import { fetchJson, postJson } from './api_client';

// Transforma os dados retornados pelo backend em nós e arestas para o React Flow.
export const transformBackendData = (data, currentNodes = []) => {
  // Criar mapa das posições atuais
  const positionMap = new Map(
    currentNodes.map(node => [node.id, node.position])
  );

  const listNodeData = data.nodes.find(node => node.type === 'list');
  const headId = listNodeData?.metadata?.head ?? null;
  const tailId = listNodeData?.metadata?.tail ?? null;

  // Converter nós do backend, mas preservar posições
  const reactFlowNodes = data.nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: positionMap.get(node.id) || node.position,
    data: {
      label: node.label,
      type: node.type,
      state: null,
      metadata: node.metadata,
      isHead: node.id === headId,
      isTail: node.id === tailId
    }
  }));

  // Converter edges: ligações "next" fluem esquerda->direita, ligações
  // "head"/"tail" saem do objeto Lista já identificadas por cor.
  const reactFlowEdges = data.edges.map(edge => {
    const baseEdge = {
      id: `${edge.source}-${edge.target}-${edge.type}`,
      source: edge.source,
      target: edge.target
    };

    if (edge.type === 'head' || edge.type === 'tail') {
      const color = edge.type === 'head' ? '#2ecc71' : '#e67e22';
      baseEdge.sourceHandle = edge.type;
      baseEdge.targetHandle = 'ptr';
      baseEdge.style = { stroke: color, strokeWidth: 2 };
      baseEdge.markerEnd = { type: MarkerType.ArrowClosed, color };
    } else {
      baseEdge.sourceHandle = 'next';
      baseEdge.targetHandle = 'prev';
    }

    return baseEdge;
  });

  const dataNodesCount = reactFlowNodes.filter(n => n.data.type !== 'list').length;
  return { reactFlowNodes, reactFlowEdges, dataNodesCount };
};

// Busca o estado atual da lista ligada no backend e atualiza nós/arestas/contador.
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

// Insere um nó no final da lista (tail), calculando sua posição no grid visual.
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

// Insere um nó no início da lista (head), distinto da inserção no final acima.
export const addNodeFirst = async (
  nodeLabel,
  setNodeLabel,
  nodeCount,
  setNodeCount,
  setNodes,
  setEdges,
  fetchDataCallback,
  currentNodes
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
    await postJson('/nodes_first', newNodeData);
    setNodeLabel('');
    setNodeCount(nodeCount + 1);
    fetchDataCallback(currentNodes);
  } catch (err) {
    toast.error('Erro ao criar nó: ' + err.message);
  }
};

// Remove o nó do início (head) da lista
export const removeFirstNode = async () => {
  return postJson('/nodes_remove_first', {});
};

// Remove o nó do final (tail) da lista
export const removeLastNode = async () => {
  return postJson('/nodes_remove_last', {});
};
