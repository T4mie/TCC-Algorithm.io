import { fetchQueueData, fetchEnqueueSteps, fetchDequeueSteps, applyQueueStep, clearQueue } from '../api/api_queue';
import { toast } from 'sonner';

export const useQueueHandlers = (states) => {
  const {
    queueValue, setQueueValue,
    nodes, setNodes, setEdges, setNodeCount,
    setIsAnimating, steps, setSteps, currentStep, setCurrentStep,
    setQueueOperation
  } = states;

  // Repassa o índice do passo atual para a janela filha (CodeView), se estiver aberta
  const notifyChildStep = (step) => {
    if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
      window.electronAPI.updateChildStep(step);
    }
  };

  // Dispara a simulação passo a passo do método enqueue()
  const handleEnqueue = async () => {
    const value = queueValue.trim();
    if (!value) {
      toast.error('Informe um valor para enfileirar');
      return;
    }

    try {
      const result = await fetchEnqueueSteps(value, nodes);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setQueueOperation('enqueue');
      setQueueValue('');
      applyQueueStep(result.steps[0], nodes, setNodes, setEdges);
      notifyChildStep(0);
    } catch (err) {
      toast.error('Erro ao enfileirar: ' + err.message);
    }
  };

  // Dispara a simulação passo a passo do método dequeue()
  const handleDequeue = async () => {
    if (!nodes.some(n => n.data?.type !== 'list')) {
      toast.error('A fila já está vazia');
      return;
    }

    try {
      const result = await fetchDequeueSteps();
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setQueueOperation('dequeue');
      applyQueueStep(result.steps[0], nodes, setNodes, setEdges);
      notifyChildStep(0);
    } catch (err) {
      toast.error('Erro ao desenfileirar: ' + err.message);
    }
  };

  // Avança para o próximo passo da simulação atual
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      applyQueueStep(steps[nextIndex], nodes, setNodes, setEdges);
      notifyChildStep(nextIndex);
    }
  };

  // Volta para o passo anterior da simulação atual
  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      applyQueueStep(steps[prevIndex], nodes, setNodes, setEdges);
      notifyChildStep(prevIndex);
    }
  };

  // O backend já efetiva enqueue/dequeue no momento em que os passos são
  // gerados (a simulação roda sobre uma cópia). Encerrar a simulação só
  // precisa re-buscar o estado real (limpando highlighted/activeValue) e
  // fechar o painel.
  const handleEndSimulation = async () => {
    try {
      await fetchQueueData(setNodes, setEdges, setNodeCount, nodes);
    } catch (err) {
      toast.error('Erro ao atualizar fila: ' + err.message);
    } finally {
      setCurrentStep(-1);
      setIsAnimating(false);
      setQueueOperation(null);
      notifyChildStep(-1);
    }
  };

  // Limpa a fila por completo, como se ela nunca tivesse sido usada
  const handleClear = async () => {
    try {
      await clearQueue();
      setNodes([]);
      setEdges([]);
      setNodeCount(0);
      setQueueValue('');
      setSteps([]);
      setCurrentStep(-1);
      setIsAnimating(false);
      setQueueOperation(null);
      toast.success('Fila limpa com sucesso!');
    } catch (err) {
      toast.error('Erro ao limpar fila: ' + err.message);
    }
  };

  return {
    handleEnqueue,
    handleDequeue,
    handleNextStep,
    handlePrevStep,
    handleEndSimulation,
    handleClear,
    fetchData: (currentNodes) => fetchQueueData(setNodes, setEdges, setNodeCount, currentNodes)
  };
};
