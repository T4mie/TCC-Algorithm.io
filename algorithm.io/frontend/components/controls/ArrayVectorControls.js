// components/ArrayVectorControls.js
import React from 'react';
import '../../css/controls.css';
import { motion } from 'framer-motion';

// Controles laterais do Vetor de capacidade fixa: criação do vetor
// (capacidade e tipo), campos de índice/valor, botões de inserir/remover
// por índice, e a seção de simulação passo a passo (com deslocamento real
// dos elementos) exibida enquanto uma operação está em andamento.
export default function ArrayVectorControls({ states, handlers, centerView }) {
  const {
    arrayCapacity, setArrayCapacity, arrayIndex, setArrayIndex,
    arrayValue, setArrayValue, currentStep, steps, arrayOperation
  } = states;

  const array = handlers;

  // Indica se há uma simulação passo a passo em andamento
  const isSimulating = currentStep !== -1;

  return (
    <div>
      {/* Seção de Gerenciamento: Criar e Inserir/Remover por Índice */}
      <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <motion.div whileTap={{ scale: 0.95 }}>
          <button onClick={() => centerView && centerView()} className="control-button">Centralizar</button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <div className="input-container">
          <input
            value={arrayCapacity}
            onChange={(e) => setArrayCapacity(e.target.value)}
            type="text"
            id="array-capacity-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="array-capacity-input" className="label">Capacidade do Vetor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={array.handleCreateArray}
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
            value={arrayIndex}
            onChange={(e) => setArrayIndex(e.target.value)}
            type="text"
            id="array-index-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="array-index-input" className="label">Índice</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <div className="input-container">
          <input
            value={arrayValue}
            onChange={(e) => setArrayValue(e.target.value)}
            type="text"
            id="array-value-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="array-value-input" className="label">Valor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <select
          className='control-selector'
          value={states.arrayType}
          onChange={(e) => states.setArrayType(e.target.value)}
          disabled={isSimulating}
          style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
        >
          <option value="int">Inteiros</option>
          <option value="string">Texto</option>
        </select>
        <div style={{ height: '20px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={array.handleInsert}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Inserir no Índice
          </button>
        </motion.div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={array.handleRemove}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Remover do Índice
          </button>
        </motion.div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={array.handleClear}
            disabled={isSimulating}
            className="control-button control-button-danger"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Limpar
          </button>
        </motion.div>
      </div>

      {/* Seção Educativa: Simulação Passo a Passo */}
      {isSimulating && (
        <div>
          <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
            Simulação: {arrayOperation === 'remove' ? 'Removendo do Índice' : 'Inserindo no Índice'}
          </h4>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
              Passo: <strong>{currentStep + 1} / {steps.length}</strong>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={array.handlePrevStep}
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
                onClick={array.handleNextStep}
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
                onClick={array.handleEndSimulation}
                className='control-button'
                style={{ marginTop: '5px' }}
              >
                Encerrar Simulação
              </button>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
}
