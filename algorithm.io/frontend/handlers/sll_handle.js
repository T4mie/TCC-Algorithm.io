import { fetchSLLData, addNode } from '../api/api_sll';
import {toast} from 'sonner'
export const useSLLHandlers = (states) => {
  const { 
    nodeLabel, setNodeLabel, nodeCount, setNodeCount, 
    setNodes, setEdges, nodes // ← Adiciona nodes do estado
  } = states;

  const handleAddNode = () => {
    if(nodeLabel.trim() === '') {
      toast.error('O valor do nó não pode ser vazio!');
      return;
    } else if (nodeLabel.length > 1) {
      toast.error('O valor do nó deve ser um único caractere!');
      return;
    }
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