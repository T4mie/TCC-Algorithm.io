import {
  fetchSLLData, fetchInsertLastSteps, fetchInsertFirstSteps,
  fetchRemoveFirstSteps, fetchRemoveLastSteps, applySLLStep, clearSLL
} from '../api/api_sll';
import { toast } from 'sonner';

export const useSLLHandlers = (states) => {
  const {
    nodeLabel, setNodeLabel,
    nodes, setNodes, setEdges, setNodeCount,
    setIsAnimating, steps, setSteps, currentStep, setCurrentStep,
    setSllOperation
  } = states;

  // Repassa o índice do passo atual para a janela filha (CodeView), se estiver aberta
  const notifyChildStep = (step) => {
    if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
      window.electronAPI.updateChildStep(step);
    }
  };

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

  // Dispara a simulação passo a passo do método insert_last()
  const handleInsertLast = async () => {
    if (!validateLabel()) return;

    try {
      const result = await fetchInsertLastSteps(nodeLabel, nodes);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setSllOperation('insert_last');
      setNodeLabel('');
      applySLLStep(result.steps[0], nodes, setNodes, setEdges);
      notifyChildStep(0);
    } catch (err) {
      toast.error('Erro ao inserir no fim: ' + err.message);
    }
  };

  // Dispara a simulação passo a passo do método insert_first()
  const handleInsertFirst = async () => {
    if (!validateLabel()) return;

    try {
      const result = await fetchInsertFirstSteps(nodeLabel, nodes);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setSllOperation('insert_first');
      setNodeLabel('');
      applySLLStep(result.steps[0], nodes, setNodes, setEdges);
      notifyChildStep(0);
    } catch (err) {
      toast.error('Erro ao inserir no início: ' + err.message);
    }
  };

  // Dispara a simulação passo a passo do método remove_first()
  const handleRemoveFirst = async () => {
    if (!nodes.some(n => n.data?.type !== 'list')) {
      toast.error('A lista já está vazia');
      return;
    }

    try {
      const result = await fetchRemoveFirstSteps();
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setSllOperation('remove_first');
      applySLLStep(result.steps[0], nodes, setNodes, setEdges);
      notifyChildStep(0);
    } catch (err) {
      toast.error('Erro ao remover do início: ' + err.message);
    }
  };

  // Dispara a simulação passo a passo do método remove_last()
  const handleRemoveLast = async () => {
    if (!nodes.some(n => n.data?.type !== 'list')) {
      toast.error('A lista já está vazia');
      return;
    }

    try {
      const result = await fetchRemoveLastSteps();
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setSllOperation('remove_last');
      applySLLStep(result.steps[0], nodes, setNodes, setEdges);
      notifyChildStep(0);
    } catch (err) {
      toast.error('Erro ao remover do final: ' + err.message);
    }
  };

  // Avança para o próximo passo da simulação atual
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      applySLLStep(steps[nextIndex], nodes, setNodes, setEdges);
      notifyChildStep(nextIndex);
    }
  };

  // Volta para o passo anterior da simulação atual
  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      applySLLStep(steps[prevIndex], nodes, setNodes, setEdges);
      notifyChildStep(prevIndex);
    }
  };

  // O backend já efetiva a operação no momento em que os passos são gerados
  // (a simulação roda sobre uma cópia). Encerrar a simulação só precisa
  // re-buscar o estado real (limpando highlighted/activeValue) e fechar o painel.
  const handleEndSimulation = async () => {
    try {
      await fetchSLLData(setNodes, setEdges, setNodeCount, nodes);
    } catch (err) {
      toast.error('Erro ao atualizar lista: ' + err.message);
    } finally {
      setCurrentStep(-1);
      setIsAnimating(false);
      setSllOperation(null);
      notifyChildStep(-1);
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
      setSteps([]);
      setCurrentStep(-1);
      setIsAnimating(false);
      setSllOperation(null);
      toast.success('Lista limpa com sucesso!');
    } catch (err) {
      toast.error('Erro ao limpar lista: ' + err.message);
    }
  };

  return {
    handleInsertLast,
    handleInsertFirst,
    handleRemoveFirst,
    handleRemoveLast,
    handleNextStep,
    handlePrevStep,
    handleEndSimulation,
    handleClear,
    fetchData: (currentNodes) => fetchSLLData(setNodes, setEdges, setNodeCount, currentNodes)
  };
};
