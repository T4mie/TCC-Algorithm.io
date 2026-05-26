// ===== API PARA VETOR =====

import { act } from "react";
import {toast} from "sonner";

  // Map para rastrear os timeouts da animação automática
  let automaticAnimationTimeouts = [];
  let automaticAnimationSteps = [];

export const transformVectorData = (data) => {

   // Se não há nós, retornar arrays vazios
  if (!data.nodes || data.nodes.length === 0) {
    return { reactFlowNodes: [], reactFlowEdges: [], dataNodesCount: 0 };
  }

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
      toast.error('Erro ao criar vetor: ' + error.error);
    }
  } catch (err) {
    toast.error('Erro ao criar vetor: ' + err.message);
  }
};

export const insertVectorValue = async (nodeId, value, setVectorId, setVectorValue, fetchDataCallback) => {
  const idStr = String(nodeId).trim();
  const valStr = String(value).trim();

  if (!idStr || valStr === '') {
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
      const result = await response.json();
      setVectorId('');
      setVectorValue('');
      
      // Se o vetor foi resetado, mostrar aviso
      if (result.reset) {
        toast.warning(result.info || 'Vetor foi resetado');
      } else {
        toast.success('Valor inserido com sucesso');
      }
      
      fetchDataCallback();
    } else {
      const error = await response.json();
      toast.error('Erro do servidor: ' + error.error);
    }
  } catch (err) {
    toast.error('Erro ao inserir valor: ' + err.message);
  }
};

export const startInsertionSort = async (isAnimating, setIsAnimating, nodes, setNodes, setEdges, animationSpeed) => {
  if (isAnimating) {
    cancelAutomaticAnimation(setIsAnimating, setNodes, setEdges, nodes);
    return;
  }

  setIsAnimating(true);
  // Limpa rigorosamente qualquer resíduo anterior
  automaticAnimationTimeouts.forEach(clearTimeout);
  automaticAnimationTimeouts = []; 

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
    automaticAnimationSteps = steps; // Armazena a referência para o cancelamento

    // Animar cada passo
    steps.forEach((step, stepIndex) => {
      const timeoutId = setTimeout(() => {
        const updatedNodes = nodes.map(node => {
          if (node.type === 'vector') {
            return {
              ...node,
              data: {
                ...node.data,
                values: step.nodes.map(n => n.value),
                comparing: step.comparing || [],
                swapped: step.swapped || [],
                activeKey: step.activeKey
              }
            };
          }
          return node;
        });

        const updatedEdges = step.edges.map(edge => ({
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target
        }));

        setNodes(updatedNodes);
        setEdges(updatedEdges);

        if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
          window.electronAPI.updateChildStep(stepIndex);
        }

        // Se é o último passo do loop
        if (stepIndex === steps.length - 1) {
          const finalPersistTimeout = setTimeout(async () => {
            try {
              await persistVectorState(updatedNodes);
              if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
                window.electronAPI.updateChildStep(-1);
              }
              setIsAnimating(false);
            } catch (err) {
              console.error('Erro ao persistir vetor:', err);
            }
          }, animationSpeed);
          automaticAnimationTimeouts.push(finalPersistTimeout);
        }
      }, stepIndex * animationSpeed);
      
      automaticAnimationTimeouts.push(timeoutId);
    });

    // Timeout de segurança para encerrar a flag de animação
    const finalTimeoutId = setTimeout(() => {
      setIsAnimating(false);
      automaticAnimationTimeouts = [];
      automaticAnimationSteps = [];
    }, steps.length * animationSpeed + 100);
    
    automaticAnimationTimeouts.push(finalTimeoutId);

  } catch (err) {
    console.error('Erro ao executar insertion sort:', err);
    toast.error('Erro ao executar insertion sort: ' + err.message);
    if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
      window.electronAPI.updateChildStep(-1);
    }
    setIsAnimating(false);
    automaticAnimationTimeouts = [];
    automaticAnimationSteps = [];
  }
};

export const cancelAutomaticAnimation = async (setIsAnimating, setNodes, setEdges, nodes) => {
  try {
    // 1. Limpa TODOS os timeouts imediatamente para congelar a tela
    automaticAnimationTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
    automaticAnimationTimeouts = [];

    // 2. Recupera os passos que já estavam salvos localmente
    let steps = automaticAnimationSteps;
    if (!steps || steps.length === 0) {
      // Fallback caso o array local tenha sumido por re-render do React
      steps = await fetchSortSteps();
    }
    
    if (!steps || steps.length === 0) {
      throw new Error('Nenhum passo de ordenação encontrado para finalizar.');
    }

    // 3. Força o estado visual para o ÚLTIMO passo imediatamente
    await applyAndPersistFinalState(steps, nodes, setNodes);
    
    // Limpa as arestas visuais (edges) já que a ordenação acabou
    setEdges([]);
    
    toast.success('Simulação cancelada! O vetor pulou para o estado final.');
    
    if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
      window.electronAPI.updateChildStep(-1);
    }
    
  } catch (err) {
    console.error('Erro ao cancelar animação:', err);
    toast.error('Erro ao cancelar animação: ' + err.message);
  } finally {
    setIsAnimating(false);
    automaticAnimationSteps = [];
  }
};

// Busca os passos no servidor e retorna a lista
export const fetchSortSteps = async () => {
  const response = await fetch('http://localhost:5000/insertion-sort', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!response.ok) throw new Error('Erro ao buscar passos');
  const result = await response.json();
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
          activeKey: step.activeKey
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
          comparing: finalStep.comparing || [],
          swapped: finalStep.swapped || [],
          activeKey: finalStep.activeKey
        }
      };
    }
    return node;
  });
  
  // Atualizar o estado visual
  setNodes(updatedNodes);
  
  // Aguardar um pouco para garantir que os nodes foram atualizados
  await new Promise(resolve => setTimeout(resolve, 50));
  
  // Persistir o estado final
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
    const response = await fetch('http://localhost:5000/update_vector', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nodes: values.map(value => ({ value }))
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erro ao atualizar vetor');
    }

    return await response.json();
  } catch (err) {
    console.error('Erro ao persistir vetor:', err);
    throw err;
  }
};