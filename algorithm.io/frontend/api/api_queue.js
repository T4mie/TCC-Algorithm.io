import { toast } from 'sonner';
import { MarkerType } from '@xyflow/react';
import { fetchJson, postJson } from './api_client';

// Transforma os dados da fila retornados pelo backend em nós e arestas para o React Flow.
const transformQueueData = (data, currentNodes = []) => {
  const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));

  const listNodeData = data.nodes.find(node => node.id === 'list');
  const headId = listNodeData?.metadata?.head ?? null;
  const tailId = listNodeData?.metadata?.tail ?? null;

  const reactFlowNodes = data.nodes
    .filter(node => node.id !== 'list')
    .map((node, index) => ({
      id: node.id,
      type: 'SLL',
      // Preferir a posição que o próprio nó já carrega (calculada uma
      // única vez na criação) em vez de recalcular pelo índice: como
      // nós removidos do início deslocam os índices dos remanescentes,
      // recalcular por índice fazia nós novos colidirem com o último
      // nó existente depois de um dequeue.
      position: positionMap.get(node.id) || node.position || {
        x: 100 + index * 120,
        y: 140
      },
      data: {
        label: node.label || node.value,
        type: 'queue',
        state: null,
        metadata: node.metadata,
        isHead: node.id === headId,
        isTail: node.id === tailId,
        highlighted: (data.highlighted || []).includes(node.id),
        activeValue: data.activeValue,
        codeId: data.code_id
      }
    }));

  // Objeto Fila (mesmo painel padronizado usado na Lista Ligada)
  if (listNodeData) {
    reactFlowNodes.unshift({
      id: 'list',
      type: 'list',
      position: positionMap.get('list') || listNodeData.position,
      data: {
        label: listNodeData.label,
        type: 'list',
        state: null,
        metadata: listNodeData.metadata,
        activeValue: data.activeValue,
        codeId: data.code_id
      }
    });
  }

  const reactFlowEdges = data.edges.map((edge) => {
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

  return { reactFlowNodes, reactFlowEdges };
};

// Busca o estado atual da fila no backend e atualiza nós/arestas/contador.
export const fetchQueueData = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const data = await fetchJson('/queue_data');
    const { reactFlowNodes, reactFlowEdges } = transformQueueData(data, currentNodes);
    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(reactFlowNodes.filter(n => n.data.type !== 'list').length);
  } catch (err) {
    console.error('Erro ao carregar fila:', err);
    toast.error('Erro ao carregar fila do backend');
  }
};

// Executa o enqueue no servidor (gera a simulação passo a passo) e retorna { success, steps, data }
export const fetchEnqueueSteps = async (value, currentNodes = []) => {
  const dataNodes = currentNodes.filter(n => n.data?.type !== 'list');
  // Posição baseada no x mais à direita já ocupado, não na contagem de nós:
  // depois de um dequeue os ids remanescentes mantêm sua posição real, então
  // contar "quantos nós existem hoje" para decidir o próximo x pode colidir
  // com o último nó existente.
  const maxX = dataNodes.length
    ? Math.max(...dataNodes.map(n => n.position.x))
    : (100 - 120);
  const position = { x: maxX + 120, y: 140 };

  return postJson('/queue_enqueue_steps', { value, label: value, position, type: 'queue' });
};

// Executa o dequeue no servidor (gera a simulação passo a passo) e retorna { success, steps, data }
export const fetchDequeueSteps = async () => {
  return postJson('/queue_dequeue_steps', {});
};

// Busca os últimos passos gerados (enqueue ou dequeue), usado pela janela do CodeView
export const fetchQueueSteps = async () => {
  return fetchJson('/queue_steps');
};

// Aplica um passo da simulação (enqueue/dequeue) ao estado visual da fila.
// Reaproveita o mesmo transform usado pelo fetch completo, já que o passo
// carrega o mesmo formato de nós/edges do backend.
export const applyQueueStep = (step, currentNodes, setNodes, setEdges) => {
  const { reactFlowNodes, reactFlowEdges } = transformQueueData(step, currentNodes);
  setNodes(reactFlowNodes);
  setEdges(reactFlowEdges);
};

// Limpa a fila no backend, como se ela nunca tivesse sido usada
export const clearQueue = async () => {
  return postJson('/clear_queue', {});
};
