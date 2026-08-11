import { createStack, fetchStackData, fetchPushSteps, fetchPopSteps, applyStepToNodes, persistStackState, applyAndPersistFinalState, clearStack } from '../api/api_stack';
import { toast } from 'sonner';

export const useStackHandlers = (states) => {
  const {
    stackSize, setStackSize, stackValue, setStackValue, stackType, setStackType,
    setNodes, setEdges, setNodeCount, nodes,
    setIsAnimating, steps, setSteps, currentStep, setCurrentStep,
    setStackOperation
  } = states;

  // Cria a pilha no backend com o tamanho informado pelo usuário
  const handleCreateStack = () => {
    createStack(
      stackSize, setStackSize, setNodes, setEdges,
      setNodeCount, () => fetchStackData(setNodes, setEdges, setNodeCount)
    );
  };

  // Valida o valor a empilhar conforme o tipo da pilha (inteiro ou texto)
  const validateStackValue = () => {
    if (stackType === 'int') {
      if (!/^-?\d+$/.test(stackValue)) {
        toast.error('Apenas números inteiros são permitidos nesta pilha.');
        return null;
      }
      return Number(stackValue);
    }

    if (/\d/.test(stackValue)) {
      toast.error('Números não são permitidos em pilhas de texto.');
      return null;
    }
    if (!stackValue.trim()) {
      toast.error('Digite um valor para empilhar.');
      return null;
    }
    return stackValue.toUpperCase();
  };

  // Dispara a simulação passo a passo do método push()
  const handlePush = async () => {
    const value = validateStackValue();
    if (value === null) return;

    try {
      const result = await fetchPushSteps(value);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setStackOperation('push');
      setStackValue('');
      applyStepToNodes(result.steps[0], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(0);
      }
    } catch (err) {
      toast.error('Erro ao empilhar: ' + err.message);
    }
  };

  // Dispara a simulação passo a passo do método pop()
  const handlePop = async () => {
    try {
      const result = await fetchPopSteps();
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setStackOperation('pop');
      applyStepToNodes(result.steps[0], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(0);
      }
    } catch (err) {
      toast.error('Erro ao desempilhar: ' + err.message);
    }
  };

  // Avança para o próximo passo da simulação; ao atingir o último passo, persiste a pilha
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      applyStepToNodes(steps[nextIndex], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(nextIndex);
      }

      if (nextIndex === steps.length - 1) {
        // Não resetamos `stackOperation` nem `currentStep` aqui: o painel de
        // simulação (com o título "Empilhando"/"Desempilhando" e o botão
        // "Encerrar Simulação") continua visível até o usuário encerrar
        // explicitamente, mesmo já no último passo.
        setTimeout(async () => {
          try {
            await persistStackState(nodes);
          } catch (err) {
            console.error('Erro ao persistir pilha no último passo:', err);
          }
        }, 500);
      }
    }
  };

  // Volta para o passo anterior da simulação atual
  const handlePrevStep = () => {
    if (currentStep > 0) {
      const prevIndex = currentStep - 1;
      setCurrentStep(prevIndex);
      applyStepToNodes(steps[prevIndex], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(prevIndex);
      }
    }
  };

  // Encerra a simulação: aplica e persiste o estado final da pilha e fecha o painel
  const handleEndSimulation = async () => {
    try {
      await applyAndPersistFinalState(steps, nodes, setNodes);
      toast.success('Simulação encerrada e pilha atualizada para o estado final!');
    } catch (err) {
      toast.error('Erro ao salvar estado da pilha: ' + err.message);
    } finally {
      setCurrentStep(-1);
      setIsAnimating(false);
      setStackOperation(null);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(-1);
      }
    }
  };

  // Limpa a pilha por completo, como se ela nunca tivesse sido criada
  const handleClear = async () => {
    try {
      await clearStack();
      setNodes([]);
      setEdges([]);
      setNodeCount(0);
      setStackSize('');
      setStackValue('');
      setStackType('int');
      setSteps([]);
      setCurrentStep(-1);
      setIsAnimating(false);
      setStackOperation(null);
      toast.success('Pilha limpa com sucesso!');
    } catch (err) {
      toast.error('Erro ao limpar pilha: ' + err.message);
    }
  };

  return {
    handleCreateStack,
    handlePush,
    handlePop,
    handleNextStep,
    handlePrevStep,
    handleEndSimulation,
    handleClear,
    fetchData: () => fetchStackData(setNodes, setEdges, setNodeCount, nodes)
  };
};
