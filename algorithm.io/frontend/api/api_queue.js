import { toast } from 'sonner';
import { fetchJson, postJson } from './api_client';

const transformQueueData = (data, currentNodes = []) => {
  const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));
  const reactFlowNodes = data.nodes
    .filter(node => node.id !== "list")
    .map((node, index) => ({
        id: node.id,
        type: "SLL",
        position: {
            x: 100 + index * 120,
            y: 140
        },
        data: {
            label: node.label || node.value,
            type: "queue",
            state: null,
            metadata: node.metadata
        }
    }));

  const reactFlowEdges = data.edges.map((edge) => ({
    id: `${edge.source}-${edge.target}-${edge.type}`,
    source: edge.source,
    target: edge.target,
    type: 'default'
  }));

  return { reactFlowNodes, reactFlowEdges };
};

export const fetchQueueData = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const data = await fetchJson('/queue_data');
    const { reactFlowNodes, reactFlowEdges } = transformQueueData(data, currentNodes);
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(reactFlowNodes.length);
  } catch (err) {
    console.error('Erro ao carregar fila:', err);
    toast.error('Erro ao carregar fila do backend');
  }
};

export const enqueueQueue = async (value, setNodeLabel, setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const payload = {
      value,
      label: value,
      position: { x: 100 + currentNodes.length * 120, y: 140 },
      type: 'queue'
    };
    await postJson('/queue_enqueue', payload);
    await fetchQueueData(setNodes, setEdges, setNodeCount, currentNodes);
  } catch (err) {
    toast.error('Erro ao enfileirar: ' + err.message);
  }
};

export const dequeueQueue = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    await postJson('/queue_dequeue', {});
    await fetchQueueData(setNodes, setEdges, setNodeCount, currentNodes);
  } catch (err) {
    toast.error('Erro ao desenfileirar: ' + err.message);
  }
};

// Limpa a fila no backend, como se ela nunca tivesse sido usada
export const clearQueue = async () => {
  return postJson('/clear_queue', {});
};
