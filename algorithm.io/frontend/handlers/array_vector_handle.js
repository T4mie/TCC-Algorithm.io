import {
  createArray, fetchArrayData, fetchInsertSteps, fetchRemoveSteps,
  applyStepToNodes, persistArrayState, applyAndPersistFinalState, clearArray
} from '../api/api_array_vector';
import { toast } from 'sonner';

export const useArrayVectorHandlers = (states) => {
  const {
    arrayCapacity, setArrayCapacity, arrayIndex, setArrayIndex,
    arrayValue, setArrayValue, arrayType, setArrayType,
    setNodes, setEdges, setNodeCount, nodes,
    setIsAnimating, steps, setSteps, currentStep, setCurrentStep,
    setArrayOperation
  } = states;

  // Cria o vetor no backend com a capacidade informada pelo usuário
  const handleCreateArray = () => {
    createArray(
      arrayCapacity, setArrayCapacity, setNodes, setEdges,
      setNodeCount, () => fetchArrayData(setNodes, setEdges, setNodeCount)
    );
  };

  // Valida o valor a inserir conforme o tipo do vetor (inteiro ou texto)
  const validateArrayValue = () => {
    if (arrayType === 'int') {
      if (!/^-?\d+$/.test(arrayValue)) {
        toast.error('Apenas números inteiros são permitidos neste vetor.');
        return null;
      }
      return Number(arrayValue);
    }

    if (/\d/.test(arrayValue)) {
      toast.error('Números não são permitidos em vetores de texto.');
      return null;
    }
    if (!arrayValue.trim()) {
      toast.error('Digite um valor para inserir.');
      return null;
    }
    return arrayValue.toUpperCase();
  };

  // Valida o índice digitado (inteiro não-negativo)
  const validateArrayIndex = () => {
    if (!/^\d+$/.test(String(arrayIndex).trim())) {
      toast.error('Digite um índice válido (inteiro não-negativo).');
      return null;
    }
    return Number(arrayIndex);
  };

  // Dispara a simulação passo a passo do método insert_at()
  const handleInsert = async () => {
    const index = validateArrayIndex();
    if (index === null) return;
    const value = validateArrayValue();
    if (value === null) return;

    try {
      const result = await fetchInsertSteps(index, value);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setArrayOperation('insert');
      setArrayIndex('');
      setArrayValue('');
      applyStepToNodes(result.steps[0], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(0);
      }
    } catch (err) {
      toast.error('Erro ao inserir no vetor: ' + err.message);
    }
  };

  // Dispara a simulação passo a passo do método remove_at()
  const handleRemove = async () => {
    const index = validateArrayIndex();
    if (index === null) return;

    try {
      const result = await fetchRemoveSteps(index);
      setSteps(result.steps);
      setCurrentStep(0);
      setIsAnimating(true);
      setArrayOperation('remove');
      setArrayIndex('');
      applyStepToNodes(result.steps[0], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(0);
      }
    } catch (err) {
      toast.error('Erro ao remover do vetor: ' + err.message);
    }
  };

  // Avança para o próximo passo da simulação; ao atingir o último passo, persiste o vetor
  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      const nextIndex = currentStep + 1;
      setCurrentStep(nextIndex);
      applyStepToNodes(steps[nextIndex], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(nextIndex);
      }

      if (nextIndex === steps.length - 1) {
        setTimeout(async () => {
          try {
            await persistArrayState(nodes);
          } catch (err) {
            console.error('Erro ao persistir vetor no último passo:', err);
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

  // Encerra a simulação: aplica e persiste o estado final do vetor e fecha o painel
  const handleEndSimulation = async () => {
    try {
      await applyAndPersistFinalState(steps, nodes, setNodes);
      toast.success('Simulação encerrada e vetor atualizado para o estado final!');
    } catch (err) {
      toast.error('Erro ao salvar estado do vetor: ' + err.message);
    } finally {
      setCurrentStep(-1);
      setIsAnimating(false);
      setArrayOperation(null);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(-1);
      }
    }
  };

  // Limpa o vetor por completo, como se ele nunca tivesse sido criado
  const handleClear = async () => {
    try {
      await clearArray();
      setNodes([]);
      setEdges([]);
      setNodeCount(0);
      setArrayCapacity('');
      setArrayIndex('');
      setArrayValue('');
      setArrayType('int');
      setSteps([]);
      setCurrentStep(-1);
      setIsAnimating(false);
      setArrayOperation(null);
      toast.success('Vetor limpo com sucesso!');
    } catch (err) {
      toast.error('Erro ao limpar vetor: ' + err.message);
    }
  };

  return {
    handleCreateArray,
    handleInsert,
    handleRemove,
    handleNextStep,
    handlePrevStep,
    handleEndSimulation,
    handleClear,
    fetchData: () => fetchArrayData(setNodes, setEdges, setNodeCount, nodes)
  };
};
