// components/StackControls.js
import React from 'react';
import '../../css/controls.css';
import { motion } from 'framer-motion';

export default function StackControls({ states, handlers, centerView }) {
  const {
    stackSize, setStackSize, stackValue, setStackValue,
    currentStep, steps, stackOperation
  } = states;

  const stack = handlers;

  const isSimulating = currentStep !== -1;

  return (
    <div>
      {/* Seção de Gerenciamento: Criar e Empilhar/Desempilhar */}
      <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <motion.div whileTap={{ scale: 0.95 }}>
          <button onClick={() => centerView && centerView()} className="control-button">Centralizar</button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <div className="input-container">
          <input
            value={stackSize}
            onChange={(e) => setStackSize(e.target.value)}
            type="text"
            id="stack-size-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="stack-size-input" className="label">Tamanho da Pilha</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={stack.handleCreateStack}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Criar Pilha
          </button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <div className="input-container">
          <input
            value={stackValue}
            onChange={(e) => setStackValue(e.target.value)}
            type="text"
            id="stack-value-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="stack-value-input" className="label">Valor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <select
          className='control-selector'
          value={states.stackType}
          onChange={(e) => states.setStackType(e.target.value)}
          disabled={isSimulating}
          style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
        >
          <option value="int">Inteiros</option>
          <option value="string">Texto</option>
        </select>
        <div style={{ height: '20px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={stack.handlePush}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Empilhar
          </button>
        </motion.div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={stack.handlePop}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Remover do Topo
          </button>
        </motion.div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={stack.handleClear}
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
            Simulação: {stackOperation === 'pop' ? 'Desempilhando' : 'Empilhando'}
          </h4>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
              Passo: <strong>{currentStep + 1} / {steps.length}</strong>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={stack.handlePrevStep}
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
                onClick={stack.handleNextStep}
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
                onClick={stack.handleEndSimulation}
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
