import { startInsertionSort, createVector, fetchVectorData, insertVectorValue } from '../api/api_vector';

export const useVectorHandlers = (states) => {
  const {
    vectorSize, setVectorSize, vectorId, setVectorId,
    vectorValue, setVectorValue, setNodes, setEdges,
    setNodeCount, nodes, isAnimating, setIsAnimating, animationSpeed
  } = states;

  const handleCreateVector = () => {
    createVector(
      vectorSize, setVectorSize, setNodes, setEdges, 
      setNodeCount, () => fetchVectorData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleInsertVectorValue = () => {
    insertVectorValue(
      vectorId, vectorValue, setVectorId, setVectorValue,
      () => fetchVectorData(setNodes, setEdges, setNodeCount)
    );
  };

  const handleInsertionSort = () => {
    startInsertionSort(isAnimating, setIsAnimating, nodes, setNodes, setEdges, animationSpeed);
  };

  return { 
    handleCreateVector, 
    handleInsertVectorValue, 
    handleInsertionSort,
    fetchData: () => fetchVectorData(setNodes, setEdges, setNodeCount)
  };
};