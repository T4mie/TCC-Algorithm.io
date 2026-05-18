import { startInsertionSort, createVector, fetchVectorData, insertVectorValue, fetchSortSteps, applyStepToNodes} from '../api/api_vector';
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
    }

    insertVectorValue(
      vectorId, finalValue, setVectorId, setVectorValue,
      () => fetchVectorData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleInsertionSort = () => {
    startInsertionSort(isAnimating, setIsAnimating, nodes, setNodes, setEdges, animationSpeed);
  };

  // Inicia o modo manual buscando os passos
  const handlePrepareStepByStep = async () => {
    try {
      const allSteps = await fetchSortSteps();
      setSteps(allSteps);
      setCurrentStep(0);
      setIsAnimating(true);
      applyStepToNodes(allSteps[0], nodes, setNodes);
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
      
      // Se for o ÚLTIMO passo da lista, podemos encerrar o modo de animação
      if (nextIndex === steps.length - 1) {
        // Opcional: Pequeno delay para o usuário ver o vetor limpo antes de sumir o botão
        setTimeout(() => {
          setIsAnimating(false);
          // Não resetamos o currentStep para -1 imediatamente para o usuário 
          // poder ver que chegou no 10/10, por exemplo.
        }, 500);
      }
    }
  };

  const handlePrevStep = () => {
  if (currentStep > 0) {
    const prevIndex = currentStep - 1;
    setCurrentStep(prevIndex);
    applyStepToNodes(steps[prevIndex], nodes, setNodes);
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