// ===== API para operações de vetor e simulação passo a passo do insertion sort =====

import { toast } from 'sonner';
import { fetchJson, postJson } from './api_client';

// Transforma os dados do vetor retornados pelo backend em um único nó visual
// (React Flow), já que o vetor é renderizado como um bloco só, não nó a nó.
export const transformVectorData = (data, currentNodes = []) => {
  if (!data.nodes || data.nodes.length === 0) {
    return { reactFlowNodes: [], reactFlowEdges: [], dataNodesCount: 0 };
  }

  const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));
  const values = data.nodes.map(node => node.value);
  const labels = data.nodes.map(node => node.label);
  const position = positionMap.get('vector') || data.nodes[0]?.position || { x: 100, y: 100 };

  const vectorNode = {
    id: 'vector',
    type: 'vector',
    position,
    data: {
      values,
      labels,
      type: 'vector'
    }
  };

  return { reactFlowNodes: [vectorNode], reactFlowEdges: [], dataNodesCount: 1 };
};

// Busca o estado atual do vetor no backend e atualiza nós/arestas/contador.
export const fetchVectorData = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const data = await fetchJson('/vector_data');
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformVectorData(data);

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error('Erro ao carregar dados do vetor:', err);
  }
};

// Cria o vetor no backend com o tamanho informado, validando que é um inteiro positivo até 15.
export const createVector = async (size, setVectorSize, setNodes, setEdges, setNodeCount, fetchDataCallback) => {
  if (!String(size).trim() || !/^[1-9]\d*$/.test(String(size))) {
    toast.error('Digite um tamanho de vetor válido (um inteiro positivo).');
    return;
  }

  const vectorSize = Number(size);
  if (vectorSize > 15) {
    toast.error('O tamanho máximo do vetor é 15.');
    return;
  }

  const createData = {
    value: Number(size),
    position: { x: 100, y: 100 }
  };

  try {
    await postJson('/create_vector', createData);
    setVectorSize('');
    fetchDataCallback();
    setNodeCount(vectorSize);
  } catch (err) {
    toast.error('Erro ao criar vetor: ' + err.message);
  }
};

// Insere um valor em uma posição específica do vetor no backend.
export const insertVectorValue = async (nodeId, value, setVectorId, setVectorValue, fetchDataCallback) => {
  const idStr = String(nodeId).trim();
  const valStr = String(value).trim();

  if (!idStr || valStr === '') {
    console.error('Digite um ID e um valor');
    return;
  }

  const insertData = {
    node_id: nodeId,
    value
  };

  try {
    const result = await postJson('/insert_vector', insertData);
    setVectorId('');
    setVectorValue('');

    // Se o vetor foi resetado, mostrar aviso
    if (result.reset) {
      toast.warning(result.info || 'Vetor foi resetado');
    } else {
      toast.success('Valor inserido com sucesso');
    }

    fetchDataCallback();
  } catch (err) {
    toast.error('Erro ao inserir valor: ' + err.message);
  }
};

// Busca os passos no servidor e retorna a lista
export const fetchSortSteps = async () => {
  const result = await postJson('/insertion-sort');
  return result.steps;
};

// Atualiza o estado visual para um passo específico
export const applyStepToNodes = (step, nodes, setNodes) => {
  const updatedNodes = nodes.map(node => {
    if (node.type === 'vector') {
      return {
        ...node,
        data: {
          ...node.data,
          values: step.nodes.map(n => n.value),
          comparing: step.comparing || [],
          swapped: step.swapped || [],
          activeKey: step.activeKey,
          iValue: step.iValue,
          jValue: step.jValue
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

// Aplica o estado final e persiste o estado do vetor
export const applyAndPersistFinalState = async (steps, nodes, setNodes) => {
  if (!steps || steps.length === 0) {
    throw new Error('Nenhum passo disponível');
  }

  const finalStep = steps[steps.length - 1];

  // Criar os nodes atualizados com o estado final
  const updatedNodes = nodes.map(node => {
    if (node.type === 'vector') {
      return {
        ...node,
        data: {
          ...node.data,
          values: finalStep.nodes.map(n => n.value),
          comparing: [],
          swapped: [],
          activeKey: null,
          iValue: null,
          jValue: null
        }
      };
    }
    return node;
  });

  // Atualizar o estado visual
  setNodes(updatedNodes);

  // Aguardar um pouco para garantir que os nodes foram atualizados
  await new Promise(resolve => setTimeout(resolve, 50));
  await persistVectorState(updatedNodes);
};

// Persiste o estado final do vetor no backend
export const persistVectorState = async (nodes) => {
  try {
    // Extrai os valores do nó vector (que é um nó especial com todos os valores)
    const vectorNode = nodes.find(n => n.type === 'vector');
    if (!vectorNode) {
      throw new Error('Nó vector não encontrado');
    }

    const values = vectorNode.data.values || [];
    return await postJson('/update_vector', { nodes: values.map(value => ({ value })) });
  } catch (err) {
    console.error('Erro ao persistir vetor:', err);
    throw err;
  }
};

// Limpa o vetor no backend, como se ele nunca tivesse sido criado
export const clearVector = async () => {
  return postJson('/clear_vector', {});
};
