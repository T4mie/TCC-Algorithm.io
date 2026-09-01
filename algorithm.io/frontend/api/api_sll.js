// ===== API para operações da Lista Simplesmente Ligada (inserir/remover no início ou fim) e simulação passo a passo =====

import { MarkerType } from '@xyflow/react';
import { fetchJson, postJson } from './api_client';

// Transforma os dados retornados pelo backend (estado completo ou um passo
// da simulação) em nós e arestas para o React Flow, preservando posições.
export const transformSLLData = (data, currentNodes = []) => {
  const positionMap = new Map(currentNodes.map(node => [node.id, node.position]));

  const listNodeData = data.nodes.find(node => node.type === 'list');
  const headId = listNodeData?.metadata?.head ?? null;
  const tailId = listNodeData?.metadata?.tail ?? null;

  const reactFlowNodes = data.nodes
    .filter(node => node.type !== 'list')
    .map((node, index) => ({
      id: node.id,
      type: 'SLL',
      position: positionMap.get(node.id) || node.position || { x: 100 + index * 120, y: 140 },
      data: {
        label: node.label,
        type: node.type,
        state: null,
        metadata: node.metadata,
        isHead: node.id === headId,
        isTail: node.id === tailId,
        highlighted: (data.highlighted || []).includes(node.id),
        activeValue: data.activeValue,
        codeId: data.code_id
      }
    }));

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
export const fetchSLLData = async (setNodes, setEdges, setNodeCount, currentNodes = []) => {
  try {
    const data = await fetchJson('/SLL_data');
    const { reactFlowNodes, reactFlowEdges, dataNodesCount } = transformSLLData(data, currentNodes);

    setNodes(reactFlowNodes);
    setEdges(reactFlowEdges);
    setNodeCount(dataNodesCount);
  } catch (err) {
    console.error('Erro ao carregar dados da lista:', err);
  }
};

// Limpa a lista no backend, como se ela nunca tivesse sido usada
export const clearSLL = async () => {
  return postJson('/clear_sll', {});
};

// Executa insert_last no servidor (gera a simulação passo a passo) e retorna { success, steps, data }
export const fetchInsertLastSteps = async (value, currentNodes = []) => {
  const dataNodes = currentNodes.filter(n => n.data?.type !== 'list');
  const maxX = dataNodes.length
    ? Math.max(...dataNodes.map(n => n.position.x))
    : (100 - 120);
  const position = { x: maxX + 120, y: 140 };

  return postJson('/sll_insert_last_steps', { value, position });
};

// Executa insert_first no servidor (gera a simulação passo a passo) e retorna { success, steps, data }
export const fetchInsertFirstSteps = async (value, currentNodes = []) => {
  const dataNodes = currentNodes.filter(n => n.data?.type !== 'list');
  const minX = dataNodes.length
    ? Math.min(...dataNodes.map(n => n.position.x))
    : (100 + 120);
  const position = { x: minX - 120, y: 140 };

  return postJson('/sll_insert_first_steps', { value, position });
};

// Executa remove_first no servidor (gera a simulação passo a passo) e retorna { success, steps, data }
export const fetchRemoveFirstSteps = async () => {
  return postJson('/sll_remove_first_steps', {});
};

// Executa remove_last no servidor (gera a simulação passo a passo) e retorna { success, steps, data }
export const fetchRemoveLastSteps = async () => {
  return postJson('/sll_remove_last_steps', {});
};

// Busca os últimos passos gerados (insert/remove), usado pela janela do CodeView
export const fetchSLLSteps = async () => {
  return fetchJson('/sll_steps');
};

// Aplica um passo da simulação (insert/remove) ao estado visual da lista.
// Reaproveita o mesmo transform usado pelo fetch completo, já que o passo
// carrega o mesmo formato de nós/edges do backend.
export const applySLLStep = (step, currentNodes, setNodes, setEdges) => {
  const { reactFlowNodes, reactFlowEdges } = transformSLLData(step, currentNodes);
  setNodes(reactFlowNodes);
  setEdges(reactFlowEdges);
};
