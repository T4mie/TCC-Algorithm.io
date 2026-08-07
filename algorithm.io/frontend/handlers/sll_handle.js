import { fetchSLLData, addNode, clearSLL } from '../api/api_sll';
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

  // Limpa a lista por completo, como se ela nunca tivesse sido usada
  const handleClear = async () => {
    try {
      await clearSLL();
      setNodes([]);
      setEdges([]);
      setNodeCount(0);
      setNodeLabel('');
      toast.success('Lista limpa com sucesso!');
    } catch (err) {
      toast.error('Erro ao limpar lista: ' + err.message);
    }
  };

  return {
    handleAddNode,
    handleClear,
    fetchData: (currentNodes) => fetchSLLData(setNodes, setEdges, setNodeCount, currentNodes)
  };
};