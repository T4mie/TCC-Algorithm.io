// components/QueueControls.js
import React from 'react';
import '../../css/controls.css';
import { motion } from 'framer-motion';

// Controles laterais da Fila: campo de valor, botões de enfileirar/
// desenfileirar/limpar, e a seção de simulação passo a passo exibida
// enquanto uma operação está em andamento.
export default function QueueControls({ states, handlers, centerView }) {
  const { queueValue, setQueueValue, currentStep, steps, queueOperation } = states;
  const queue = handlers;

  // Indica se há uma simulação passo a passo em andamento
  const isSimulating = currentStep !== -1;

  // Permite disparar o enfileiramento pressionando Enter no campo de valor
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') queue.handleEnqueue();
  };

  return (
    <div>
      {/* Seção de Gerenciamento: Enfileirar/Desenfileirar */}
      <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <motion.div whileTap={{ scale: 0.95 }}>
          <button onClick={() => centerView && centerView()} className="control-button">Centralizar</button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <div className="input-container">
          <input
            value={queueValue}
            onChange={(e) => setQueueValue(e.target.value)}
            onKeyPress={handleKeyPress}
            type="text"
            id="queue-value-input"
            required
            disabled={isSimulating}
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'text' }}
          />
          <label htmlFor="queue-value-input" className="label">Valor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={queue.handleEnqueue}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Enfileirar
          </button>
        </motion.div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={queue.handleDequeue}
            disabled={isSimulating}
            className="control-button"
            style={{ opacity: isSimulating ? 0.6 : 1, cursor: isSimulating ? 'not-allowed' : 'pointer' }}
          >
            Desenfileirar
          </button>
        </motion.div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button
            onClick={queue.handleClear}
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
            Simulação: {queueOperation === 'dequeue' ? 'Desenfileirando' : 'Enfileirando'}
          </h4>
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
              Passo: <strong>{currentStep + 1} / {steps.length}</strong>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button
                onClick={queue.handlePrevStep}
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
                onClick={queue.handleNextStep}
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
                onClick={queue.handleEndSimulation}
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
