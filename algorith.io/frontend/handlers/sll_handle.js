import { fetchSLLData, addNode } from '../api/api_sll';

export const useSLLHandlers = (states) => {
  const { 
    nodeLabel, setNodeLabel, nodeCount, setNodeCount, 
    setNodes, setEdges, nodes // ← Adiciona nodes do estado
  } = states;

  const handleAddNode = () => {
    addNode(
      nodeLabel, 
      setNodeLabel, 
      nodeCount, 
      setNodeCount, 
      setNodes, 
      setEdges, 
      (currentNodes) => fetchSLLData(setNodes, setEdges, setNodeCount, currentNodes),
      nodes // ← Passa os nós atuais
    );
  };

  return { 
    handleAddNode, 
    fetchData: (currentNodes) => fetchSLLData(setNodes, setEdges, setNodeCount, currentNodes) 
  };
};