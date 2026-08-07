import { createVector, fetchVectorData, insertVectorValue, fetchSortSteps, applyStepToNodes, persistVectorState, clearVector } from '../api/api_vector';
import {toast} from 'sonner'
export const useVectorHandlers = (states) => {
  const {
    vectorSize, setVectorSize, vectorId, setVectorId,
    vectorValue, setVectorValue, setNodes, setEdges,
    setNodeCount, nodes, setIsAnimating,
    steps, setSteps, currentStep, setCurrentStep,
    vectorType, setVectorType
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

  // Inicia o modo de simulação passo a passo buscando os passos do insertion sort
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

      // Se for o ÚLTIMO passo da lista, persistir o vetor.
      // Não resetamos `isAnimating`/`currentStep` aqui: o painel de
      // simulação (com "Voltar"/"Próximo" e "Encerrar Simulação") continua
      // visível e os inputs de criação/inserção continuam bloqueados até o
      // usuário encerrar explicitamente, mesmo já no último passo.
      if (nextIndex === steps.length - 1) {
        setTimeout(async () => {
          try {
            // Persistir o estado final do vetor
            await persistVectorState(nodes);
          } catch (err) {
            console.error('Erro ao persistir vetor no último passo:', err);
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

  // Limpa o vetor por completo, como se ele nunca tivesse sido criado
  const handleClear = async () => {
    try {
      await clearVector();
      setNodes([]);
      setEdges([]);
      setNodeCount(0);
      setVectorSize('');
      setVectorId('');
      setVectorValue('');
      setVectorType('int');
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
    handleInsertVectorValue,
    handlePrepareStepByStep,
    handleNextStep,
    handlePrevStep,
    handleClear,
    fetchData: () => fetchVectorData(setNodes, setEdges, setNodeCount, nodes)
  };
};
