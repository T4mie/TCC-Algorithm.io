import { fetchSLLData, addNode } from '../api/api_sll';

export const useSLLHandlers = (states) => {
  const { 
    nodeLabel, setNodeLabel, nodeCount, setNodeCount, 
    setNodes, setEdges 
  } = states;

  const handleAddNode = () => {
    addNode(
      nodeLabel, 
      setNodeLabel, 
      nodeCount, 
      setNodeCount, 
      setNodes, 
      setEdges, 
      () => fetchSLLData(setNodes, setEdges, setNodeCount)
    );
  };

  return { handleAddNode, fetchData: () => fetchSLLData(setNodes, setEdges, setNodeCount) };
};