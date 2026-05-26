import { startInsertionSort, createVector, fetchVectorData, insertVectorValue, fetchSortSteps, applyStepToNodes, persistVectorState, cancelAutomaticAnimation } from '../api/api_vector';
import {toast} from 'sonner'
export const useVectorHandlers = (states) => {
  const {
    vectorSize, setVectorSize, vectorId, setVectorId,
    vectorValue, setVectorValue, setNodes, setEdges,
    setNodeCount, nodes, isAnimating, setIsAnimating,
    animationSpeed, steps, setSteps, currentStep, setCurrentStep,
    vectorType
  } = states;

  const handleCreateVector = () => {
    createVector(
      vectorSize, setVectorSize, setNodes, setEdges, 
      setNodeCount, () => fetchVectorData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleInsertVectorValue = () => {
    let finalValue = vectorValue;

    if (vectorType === 'int') {
      if (!/^-?\d+$/.test(vectorValue)) {
        toast.error('Apenas números inteiros são permitidos neste vetor.');
        return;
      }
      finalValue = Number(vectorValue);
    } else if (vectorType === 'string') {
      if (/\d/.test(vectorValue)) {
        toast.error('Números não são permitidos em vetores de string.');
        return;
      }
      finalValue = vectorValue.toUpperCase();
    }

    insertVectorValue(
      vectorId, finalValue, setVectorId, setVectorValue,
      () => fetchVectorData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleInsertionSort = async () => {
    if (isAnimating && currentStep === -1) {
      // Importante usar o await aqui para que o estado final seja garantido
      await cancelAutomaticAnimation(setIsAnimating, setNodes, setEdges, nodes);
    } else if (!isAnimating) {
      // Se não está animando, iniciar
      startInsertionSort(isAnimating, setIsAnimating, nodes, setNodes, setEdges, animationSpeed);
    }
  };

  // Inicia o modo manual buscando os passos
  const handlePrepareStepByStep = async () => {
    try {
      const allSteps = await fetchSortSteps();
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
      
      // Se for o ÚLTIMO passo da lista, persistir o vetor e encerrar modo de animação
      if (nextIndex === steps.length - 1) {
        setTimeout(async () => {
          try {
            // Persistir o estado final do vetor
            await persistVectorState(nodes);
            setIsAnimating(false);
          } catch (err) {
            console.error('Erro ao persistir vetor no último passo:', err);
            setIsAnimating(false);
          }
        }, 500);
      }
    }
  };

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

  return { 
    handleCreateVector, 
    handleInsertVectorValue, 
    handleInsertionSort,
    handlePrepareStepByStep,
    handleNextStep,
    handlePrevStep,
    fetchData: () => fetchVectorData(setNodes, setEdges, setNodeCount)
  };
};