import { fetchSLLData, addNode, addNodeFirst, removeFirstNode, removeLastNode, clearSLL } from '../api/api_sll';
import { toast } from 'sonner';

export const useSLLHandlers = (states) => {
  const {
    nodeLabel, setNodeLabel, nodeCount, setNodeCount,
    setNodes, setEdges, nodes // ← Adiciona nodes do estado
  } = states;

  // Valida o rótulo digitado: não pode ser vazio e deve ter um único caractere.
  const validateLabel = () => {
    if (nodeLabel.trim() === '') {
      toast.error('O valor do nó não pode ser vazio!');
      return false;
    } else if (nodeLabel.length > 1) {
      toast.error('O valor do nó deve ser um único caractere!');
      return false;
    }
    return true;
  };

  // Insere no final da lista (comportamento já existente)
  const handleAddNode = () => {
    if (!validateLabel()) return;
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

  // Insere no início da lista (head), distinto da inserção no final acima
  const handleAddNodeFirst = () => {
    if (!validateLabel()) return;
    addNodeFirst(
      nodeLabel,
      setNodeLabel,
      nodeCount,
      setNodeCount,
      setNodes,
      setEdges,
      (currentNodes) => fetchSLLData(setNodes, setEdges, setNodeCount, currentNodes),
      nodes
    );
  };

  // Remove o nó do início da lista e atualiza a contagem
  const handleRemoveFirst = async () => {
    try {
      await removeFirstNode();
      await fetchSLLData(setNodes, setEdges, setNodeCount, nodes);
      setNodeCount(Math.max(0, nodeCount - 1));
      toast.success('Nó removido do início!');
    } catch (err) {
      toast.error('Erro ao remover do início: ' + err.message);
    }
  };

  // Remove o nó do final da lista e atualiza a contagem
  const handleRemoveLast = async () => {
    try {
      await removeLastNode();
      await fetchSLLData(setNodes, setEdges, setNodeCount, nodes);
      setNodeCount(Math.max(0, nodeCount - 1));
      toast.success('Nó removido do final!');
    } catch (err) {
      toast.error('Erro ao remover do final: ' + err.message);
    }
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
    handleAddNodeFirst,
    handleRemoveFirst,
    handleRemoveLast,
    handleClear,
    fetchData: (currentNodes) => fetchSLLData(setNodes, setEdges, setNodeCount, currentNodes)
  };
};
