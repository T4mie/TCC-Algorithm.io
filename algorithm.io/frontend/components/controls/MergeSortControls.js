// components/MergeSortControls.js
import React from 'react';
import '../../css/controls.css';
import { motion } from 'framer-motion';
import { applyAndPersistFinalState } from '../../api/api_merge_sort';
import { toast } from 'sonner';

// Controles laterais do Merge Sort: criação do vetor (tamanho e tipo),
// inserção de valores por índice, e a seção de simulação passo a passo do
// algoritmo de ordenação (divisão recursiva + mesclagem) exibida enquanto
// uma operação está em andamento.
export default function MergeSortControls({ states, handlers, centerView }) {
  const {
    mergeSortSize, setMergeSortSize, mergeSortId, setMergeSortId, mergeSortValue, setMergeSortValue,
    currentStep, steps, setIsAnimating, setCurrentStep
  } = states;

  const mergeSort = handlers;

  // Assim como no vetor do Insertion Sort, os inputs/botões de gerenciamento
  // ficam bloqueados enquanto houver uma simulação em andamento.
  const isSimulating = currentStep !== -1;

  // Finaliza a simulação passo a passo: aplica e persiste o estado final do
  // vetor no backend e reseta os estados de simulação (local e do Electron)
  const handleEndSimulation = async () => {
    try {
      await applyAndPersistFinalState(states.steps, states.nodes, states.setNodes);
      toast.success('Simulação encerrada e vetor atualizado para o estado final!');
    } catch (err) {
      toast.error('Erro ao salvar estado do vetor: ' + err.message);
    } finally {
      setCurrentStep(-1);
      setIsAnimating(false);
      if (window && window.electronAPI && typeof window.electronAPI.updateChildStep === 'function') {
        window.electronAPI.updateChildStep(-1);
      }
    }
  };

  return (
    <div>
      {/* Seção de Gerenciamento: Criar e Inserir */}
      <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <motion.div whileTap={{ scale: 0.95 }}>
          <button onClick={() => centerView && centerView()} className="control-button">Centralizar</button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <div className="input-container">
          <input
            value={mergeSortSize}
            onChange={(e) => setMergeSortSize(e.target.value)}
            type="text"
            id="mergesort-size-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="mergesort-size-input" className="label">Tamanho do Vetor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={mergeSort.handleCreateVector}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Criar Vetor
          </button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <div className="input-container">
          <input
            value={mergeSortId}
            onChange={(e) => setMergeSortId(e.target.value)}
            type="text"
            id="mergesort-id-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="mergesort-id-input" className="label">Índice</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <div className="input-container">
          <input
            value={mergeSortValue}
            onChange={(e) => setMergeSortValue(e.target.value)}
            type="text"
            id="mergesort-value-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="mergesort-value-input" className="label">Valor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={mergeSort.handleInsertValue}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Inserir Valor no Índice
          </button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <select
          className='control-selector'
          value={states.mergeSortType}
          onChange={(e) => states.setMergeSortType(e.target.value)}
          disabled={isSimulating}
          style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
        >
          <option value="int">Inteiros</option>
          <option value="string">Texto</option>
        </select>
        <div style={{ height: '20px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={mergeSort.handleClear}
            disabled={isSimulating}
            className="control-button control-button-danger"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Limpar
          </button>
        </motion.div>
      </div>

      {/* Seção Educativa: Simulação Passo a Passo do Merge Sort */}
      <div>
        {currentStep === -1 ? (
          <motion.div whileTap={{ scale: 0.95 }}>
            <button
              onClick={mergeSort.handlePrepareStepByStep}
              disabled={isSimulating}
              className='control-button'
              style={{
                opacity: isSimulating ? 0.6 : 1,
                cursor: isSimulating ? 'not-allowed' : 'pointer'
              }}
            >
              Simular Passo a Passo
            </button>
          </motion.div>
        ) : (
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
              Passo: <strong>{currentStep + 1} / {steps.length}</strong>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={mergeSort.handlePrevStep}
                disabled={currentStep === 0}
                className='control-button'
                style={{
                  opacity: currentStep === 0 ? 0.6 : 1,
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                ◀ Voltar
              </button>
              <button
                onClick={mergeSort.handleNextStep}
                disabled={currentStep === steps.length - 1}
                className='control-button'
                style={{
                  opacity: currentStep === steps.length - 1 ? 0.6 : 1,
                  cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Próximo ▶
              </button>
            </div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <button
                onClick={handleEndSimulation}
                className='control-button'
                style={{ marginTop: '5px' }}
              >
                Encerrar Simulação
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
