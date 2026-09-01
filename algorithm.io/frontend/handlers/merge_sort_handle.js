import {
  createMergeSortVector, fetchMergeSortData, insertMergeSortValue, fetchMergeSortSteps,
  applyStepToNodes, persistMergeSortState, clearMergeSortVector
} from '../api/api_merge_sort';
import { toast } from 'sonner';

export const useMergeSortHandlers = (states) => {
  const {
    mergeSortSize, setMergeSortSize, mergeSortId, setMergeSortId,
    mergeSortValue, setMergeSortValue, setNodes, setEdges,
    setNodeCount, nodes, setIsAnimating,
    steps, setSteps, currentStep, setCurrentStep,
    mergeSortType, setMergeSortType
  } = states;

  // Cria o vetor no backend com o tamanho informado pelo usuário
  const handleCreateVector = () => {
    createMergeSortVector(
      mergeSortSize, setMergeSortSize, setNodes, setEdges,
      setNodeCount, () => fetchMergeSortData(setNodes, setEdges, setNodeCount)
    );
  };

  // Valida (conforme o tipo do vetor) e insere o valor digitado na posição informada
  const handleInsertValue = () => {
    let finalValue = mergeSortValue;

    if (mergeSortType === 'int') {
      if (!/^-?\d+$/.test(mergeSortValue)) {
        toast.error('Apenas números inteiros são permitidos neste vetor.');
        return;
      }
      finalValue = Number(mergeSortValue);
    } else if (mergeSortType === 'string') {
      if (/\d/.test(mergeSortValue)) {
        toast.error('Números não são permitidos em vetores de string.');
        return;
      }
      finalValue = mergeSortValue.toUpperCase();
    }

    insertMergeSortValue(
      mergeSortId, finalValue, setMergeSortId, setMergeSortValue,
      () => fetchMergeSortData(setNodes, setEdges, setNodeCount)
    );
  };

  // Inicia o modo de simulação passo a passo buscando os passos do merge sort
  const handlePrepareStepByStep = async () => {
    try {
      const allSteps = await fetchMergeSortSteps();
      setSteps(allSteps);
      setCurrentStep(0);
      setIsAnimating(true);
      applyStepToNodes(allSteps[0], nodes, setNodes);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(0);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Avança para o próximo passo
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
            await persistMergeSortState(nodes);
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

  // Limpa o vetor por completo, como se ele nunca tivesse sido criado
  const handleClear = async () => {
    try {
      await clearMergeSortVector();
      setNodes([]);
      setEdges([]);
      setNodeCount(0);
      setMergeSortSize('');
      setMergeSortId('');
      setMergeSortValue('');
      setMergeSortType('int');
      setSteps([]);
      setCurrentStep(-1);
      setIsAnimating(false);
      toast.success('Vetor limpo com sucesso!');
    } catch (err) {
      toast.error('Erro ao limpar vetor: ' + err.message);
    }
  };

  return {
    handleCreateVector,
    handleInsertValue,
    handlePrepareStepByStep,
    handleNextStep,
    handlePrevStep,
    handleClear,
    fetchData: () => fetchMergeSortData(setNodes, setEdges, setNodeCount, nodes)
  };
};
