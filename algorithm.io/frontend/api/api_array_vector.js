// ===== API para operações do Vetor de capacidade fixa (inserir/remover por índice com deslocamento) e simulação passo a passo =====

import { toast } from 'sonner';
import { fetchJson, postJson } from './api_client';

// Transforma os dados do vetor retornados pelo backend em um único nó visual
// (React Flow), já que o vetor é renderizado como uma fileira só, não nó a nó.
export const transformArrayData = (data, currentNodes = []) => {
  if (!data.nodes || data.nodes.length === 0) {
    return { reactFlowNodes: [], reactFlowEdges: [], dataNodesCount: 0 };
  }

  const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));
  const values = data.nodes.map(node => node.value);
  const labels = data.nodes.map(node => node.label);
  const position = positionMap.get('array') || data.nodes[0]?.position || { x: 100, y: 100 };

  const arrayNode = {
    id: 'array',
    type: 'array',
    position,
    data: {
      values,
      labels,
      size: typeof data.size === 'number' ? data.size : 0,
      highlighted: data.highlighted || [],
      activeValue: data.activeValue,
      codeId: data.code_id,
      type: 'array'
    }
  };

  return { reactFlowNodes: [arrayNode], reactFlowEdges: [], dataNodesCount: 1 };
};

// Busca o estado atual do vetor no backend e atualiza nós/arestas/contador.
export const fetchArrayData = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const data = await fetchJson('/array_data');
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformArrayData(data, currentNodes);

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error('Erro ao carregar dados do vetor:', err);
  }
};

// Cria o vetor no backend com a capacidade informada, validando que é um inteiro positivo até 15.
export const createArray = async (capacity, setArrayCapacity, setNodes, setEdges, setNodeCount, fetchDataCallback) => {
  if (!String(capacity).trim() || !/^[1-9]\d*$/.test(String(capacity))) {
    toast.error('Digite uma capacidade de vetor válida (um inteiro positivo).');
    return;
  }

  const arrayCapacity = Number(capacity);
  if (arrayCapacity > 15) {
    toast.error('A capacidade máxima do vetor é 15.');
    return;
  }

  const createData = {
    value: arrayCapacity,
    position: { x: 100, y: 100 }
  };

  try {
    await postJson('/array_create', createData);
    setArrayCapacity('');
    fetchDataCallback();
    setNodeCount(arrayCapacity);
  } catch (err) {
    toast.error('Erro ao criar vetor: ' + err.message);
  }
};

// Executa o insert_at no servidor e retorna { success, steps, data }
export const fetchInsertSteps = async (index, value) => {
  return postJson('/array_insert_steps', { index, value });
};

// Executa o remove_at no servidor e retorna { success, steps, data }
export const fetchRemoveSteps = async (index) => {
  return postJson('/array_remove_steps', { index });
};

// Busca os últimos passos gerados (insert ou remove), usado pela janela do CodeView
export const fetchArraySteps = async () => {
  return fetchJson('/array_steps');
};

// Atualiza o estado visual para um passo específico
export const applyStepToNodes = (step, nodes, setNodes) => {
  const updatedNodes = nodes.map(node => {
    if (node.type === 'array') {
      return {
        ...node,
        data: {
          ...node.data,
          values: step.nodes.map(n => n.value),
          labels: step.nodes.map(n => n.label),
          size: step.size,
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

// Aplica o estado final e persiste o estado do vetor.
// Ao encerrar a simulação, limpa os campos que só existem durante a
// animação (highlighted/activeValue/codeId) para que nenhum resquício
// do último passo continue aparecendo depois que a operação já terminou.
export const applyAndPersistFinalState = async (steps, nodes, setNodes) => {
  if (!steps || steps.length === 0) {
    throw new Error('Nenhum passo disponível');
  }

  const finalStep = steps[steps.length - 1];

  const updatedNodes = nodes.map(node => {
    if (node.type === 'array') {
      return {
        ...node,
        data: {
          ...node.data,
          values: finalStep.nodes.map(n => n.value),
          labels: finalStep.nodes.map(n => n.label),
          size: finalStep.size,
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
  await persistArrayState(updatedNodes);
};

// Limpa o vetor no backend, como se ele nunca tivesse sido criado
export const clearArray = async () => {
  return postJson('/clear_array', {});
};

// Persiste o estado final do vetor no backend
export const persistArrayState = async (nodes) => {
  try {
    const arrayNode = nodes.find(n => n.type === 'array');
    if (!arrayNode) {
      throw new Error('Nó do vetor não encontrado');
    }

    const values = arrayNode.data.values || [];
    return await postJson('/update_array', {
      nodes: values.map((value, index) => ({ value, label: value !== null && value !== undefined ? `${index}: ${value}` : String(index) })),
      size: arrayNode.data.size
    });
  } catch (err) {
    console.error('Erro ao persistir vetor:', err);
    throw err;
  }
};
