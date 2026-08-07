// ===== API para operações de pilha (push/pop) e simulação passo a passo =====

import { toast } from "sonner";
import { fetchJson, postJson } from "./api_client";

export const transformStackData = (data, currentNodes = []) => {
  if (!data.nodes || data.nodes.length === 0) {
    return { reactFlowNodes: [], reactFlowEdges: [], dataNodesCount: 0 };
  }

  const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));
  const values = data.nodes.map(node => node.value);
  const labels = data.nodes.map(node => node.label);
  const position = positionMap.get('stack') || data.nodes[0]?.position || { x: 100, y: 100 };

  const stackNode = {
    id: 'stack',
    type: 'stack',
    position,
    data: {
      values,
      labels,
      top: typeof data.top === 'number' ? data.top : -1,
      type: 'stack'
    }
  };

  return { reactFlowNodes: [stackNode], reactFlowEdges: [], dataNodesCount: 1 };
};

export const fetchStackData = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const data = await fetchJson('/stack_data');
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformStackData(data, currentNodes);

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error('Erro ao carregar dados da pilha:', err);
  }
};

export const createStack = async (size, setStackSize, setNodes, setEdges, setNodeCount, fetchDataCallback) => {
  if (!String(size).trim() || !/^[1-9]\d*$/.test(String(size))) {
    toast.error('Digite um tamanho de pilha válido (um inteiro positivo).');
    return;
  }

  const stackSize = Number(size);
  if (stackSize > 15) {
    toast.error('O tamanho máximo da pilha é 15.');
    return;
  }

  const createData = {
    value: stackSize,
    position: { x: 100, y: 100 }
  };

  try {
    await postJson('/create_stack', createData);
    setStackSize('');
    fetchDataCallback();
    setNodeCount(stackSize);
  } catch (err) {
    toast.error('Erro ao criar pilha: ' + err.message);
  }
};

// Executa o push no servidor e retorna { op: 'push', steps, data }
export const fetchPushSteps = async (value) => {
  return postJson('/stack_push_steps', { value });
};

// Executa o pop no servidor e retorna { op: 'pop', steps, data }
export const fetchPopSteps = async () => {
  return postJson('/stack_pop_steps', {});
};

// Busca os últimos passos gerados (push ou pop), usado pela janela do CodeView
export const fetchStackSteps = async () => {
  return fetchJson('/stack_steps');
};

// Atualiza o estado visual para um passo específico
export const applyStepToNodes = (step, nodes, setNodes) => {
  const updatedNodes = nodes.map(node => {
    if (node.type === 'stack') {
      return {
        ...node,
        data: {
          ...node.data,
          values: step.nodes.map(n => n.value),
          labels: step.nodes.map(n => n.label),
          top: step.top,
          highlighted: step.highlighted || [],
          activeValue: step.activeValue,
          codeId: step.code_id
        }
      };
    }
    return node;
  });
  setNodes(updatedNodes);
};

// Aplica o estado final (último passo) dos passos
export const applyFinalState = (steps, nodes, setNodes) => {
  if (!steps || steps.length === 0) {
    return;
  }
  const finalStep = steps[steps.length - 1];
  applyStepToNodes(finalStep, nodes, setNodes);
};

// Aplica o estado final e persiste o estado da pilha.
// Ao encerrar a simulação, limpa os campos que só existem durante a
// animação (highlighted/activeValue/codeId) para que nenhum resquício
// do último passo (ex.: o valor removido no pop) continue aparecendo
// depois que a operação já terminou.
export const applyAndPersistFinalState = async (steps, nodes, setNodes) => {
  if (!steps || steps.length === 0) {
    throw new Error('Nenhum passo disponível');
  }

  const finalStep = steps[steps.length - 1];

  const updatedNodes = nodes.map(node => {
    if (node.type === 'stack') {
      return {
        ...node,
        data: {
          ...node.data,
          values: finalStep.nodes.map(n => n.value),
          labels: finalStep.nodes.map(n => n.label),
          top: finalStep.top,
          highlighted: [],
          activeValue: null,
          codeId: null
        }
      };
    }
    return node;
  });

  setNodes(updatedNodes);

  await new Promise(resolve => setTimeout(resolve, 50));
  await persistStackState(updatedNodes);
};

// Limpa a pilha no backend, como se ela nunca tivesse sido criada
export const clearStack = async () => {
  return postJson('/clear_stack', {});
};

// Persiste o estado final da pilha no backend
export const persistStackState = async (nodes) => {
  try {
    const stackNode = nodes.find(n => n.type === 'stack');
    if (!stackNode) {
      throw new Error('Nó da pilha não encontrado');
    }

    const values = stackNode.data.values || [];
    return await postJson('/update_stack', {
      nodes: values.map(value => ({ value })),
      top: stackNode.data.top
    });
  } catch (err) {
    console.error('Erro ao persistir pilha:', err);
    throw err;
  }
};
