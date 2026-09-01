// ===== API para o vetor e a simulação passo a passo do Merge Sort =====

import { toast } from 'sonner';
import { fetchJson, postJson } from './api_client';

// Transforma os dados do vetor retornados pelo backend em um único nó visual
// (React Flow), já que o vetor é renderizado como um bloco só, não nó a nó.
export const transformMergeSortData = (data, currentNodes = []) => {
  if (!data.nodes || data.nodes.length === 0) {
    return { reactFlowNodes: [], reactFlowEdges: [], dataNodesCount: 0 };
  }

  const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));
  const values = data.nodes.map(node => node.value);
  const labels = data.nodes.map(node => node.label);
  const position = positionMap.get('merge-sort') || data.nodes[0]?.position || { x: 100, y: 100 };

  const mergeSortNode = {
    id: 'merge-sort',
    type: 'merge-sort',
    position,
    data: {
      values,
      labels,
      type: 'merge-sort'
    }
  };

  return { reactFlowNodes: [mergeSortNode], reactFlowEdges: [], dataNodesCount: 1 };
};

// Busca o estado atual do vetor no backend e atualiza nós/arestas/contador.
export const fetchMergeSortData = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const data = await fetchJson('/mergesort_data');
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformMergeSortData(data);

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error('Erro ao carregar dados do vetor:', err);
  }
};

// Cria o vetor no backend com o tamanho informado, validando que é um inteiro positivo até 15.
export const createMergeSortVector = async (size, setSize, setNodes, setEdges, setNodeCount, fetchDataCallback) => {
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
    value: vectorSize,
    position: { x: 100, y: 100 }
  };

  try {
    await postJson('/mergesort_create', createData);
    setSize('');
    fetchDataCallback();
    setNodeCount(vectorSize);
  } catch (err) {
    toast.error('Erro ao criar vetor: ' + err.message);
  }
};

// Insere um valor em uma posição específica do vetor no backend.
export const insertMergeSortValue = async (nodeId, value, setId, setValue, fetchDataCallback) => {
  const idStr = String(nodeId).trim();
  const valStr = String(value).trim();

  if (!idStr || valStr === '') {
    toast.error('Digite um índice e um valor');
    return;
  }

  try {
    const result = await postJson('/mergesort_insert', { node_id: nodeId, value });
    setId('');
    setValue('');

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

// Executa o merge sort no servidor e retorna a lista de passos
export const fetchMergeSortSteps = async () => {
  const result = await postJson('/merge-sort');
  return result.steps;
};

// Atualiza o estado visual para um passo específico: além dos valores atuais
// do vetor, carrega o intervalo [left,right]/mid ativo e o buffer de
// mesclagem (leftArr/rightArr) com os ponteiros i/j/k, para o "split view".
export const applyStepToNodes = (step, nodes, setNodes) => {
  const updatedNodes = nodes.map(node => {
    if (node.type === 'merge-sort') {
      return {
        ...node,
        data: {
          ...node.data,
          values: step.nodes.map(n => n.value),
          left: step.left,
          right: step.right,
          mid: step.mid,
          leftArr: step.leftArr,
          rightArr: step.rightArr,
          i: step.i,
          j: step.j,
          k: step.k,
          highlighted: step.highlighted || [],
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

// Aplica o estado final e persiste o estado do vetor
export const applyAndPersistFinalState = async (steps, nodes, setNodes) => {
  if (!steps || steps.length === 0) {
    throw new Error('Nenhum passo disponível');
  }

  const finalStep = steps[steps.length - 1];

  const updatedNodes = nodes.map(node => {
    if (node.type === 'merge-sort') {
      return {
        ...node,
        data: {
          ...node.data,
          values: finalStep.nodes.map(n => n.value),
          left: null,
          right: null,
          mid: null,
          leftArr: null,
          rightArr: null,
          i: null,
          j: null,
          k: null,
          highlighted: [],
          codeId: null
        }
      };
    }
    return node;
  });

  setNodes(updatedNodes);

  await new Promise(resolve => setTimeout(resolve, 50));
  await persistMergeSortState(updatedNodes);
};

// Persiste o estado final do vetor no backend
export const persistMergeSortState = async (nodes) => {
  try {
    const mergeSortNode = nodes.find(n => n.type === 'merge-sort');
    if (!mergeSortNode) {
      throw new Error('Nó do vetor não encontrado');
    }

    const values = mergeSortNode.data.values || [];
    return await postJson('/update_mergesort', { nodes: values.map(value => ({ value })) });
  } catch (err) {
    console.error('Erro ao persistir vetor:', err);
    throw err;
  }
};

// Limpa o vetor no backend, como se ele nunca tivesse sido criado
export const clearMergeSortVector = async () => {
  return postJson('/clear_mergesort', {});
};
