// components/VectorControls.js
import React from 'react';
import '../../css/controls.css';
import { motion } from 'framer-motion';
import { persistVectorState } from '../../api/api_vector';
import { toast } from 'sonner';

export default function VectorControls({ states, handlers, centerView }) {
  const {
    vectorSize, setVectorSize, vectorId, setVectorId, vectorValue, setVectorValue,
    isAnimating, animationSpeed, setAnimationSpeed, currentStep, steps, setIsAnimating, setCurrentStep, nodes
  } = states;

  const vector = handlers;

  const handleEndSimulation = async () => {
    try {
      // Persistir o estado final do vetor
      await persistVectorState(nodes);
      toast.success('Simulação encerrada e vetor atualizado!');
    } catch (err) {
      toast.error('Erro ao salvar estado do vetor: ' + err.message);
    } finally {
      // Resetar os estados
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
          <input value={vectorSize} onChange={(e) => setVectorSize(e.target.value)} type="text" id="input" required/>
          <label htmlFor="input" className="label">Tamanho do Vetor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button onClick={vector.handleCreateVector} className="control-button">Criar Vetor</button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <div className="input-container">
          <input value={vectorId} onChange={(e) => setVectorId(e.target.value)} type="text" id="input-id" required/>
          <label htmlFor="input-id" className="label">Índice</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <div className="input-container">
          <input value={vectorValue} onChange={(e) => setVectorValue(e.target.value)} type="text" id="input-value" required/>
          <label htmlFor="input-id" className="label">Valor</label>
          <div className="underline" />
        </div>
        <div style={{ height: '12px' }} />
        <motion.div whileTap={{ scale: 0.95 }}>
          <button onClick={vector.handleInsertVectorValue} className="control-button">Inserir Valor no Índice</button>
        </motion.div>
        <div style={{ height: '20px' }} />
        <select 
          className='control-selector'
          value={states.vectorType} 
          onChange={(e) => states.setVectorType(e.target.value)}>
          <option value="int">Inteiros</option>
          <option value="string">Texto</option>
        </select>
        <div style={{ height: '20px' }} />
      </div>

      {/* Seção Educativa: Controles de Ordenação */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Simulação (Sort)</h4>
        
        <div style={{ marginBottom: '10px' }}>
          <motion.div whileTap={{ scale: 0.95 }}>
            <button 
              onClick={vector.handleInsertionSort} 
              disabled={isAnimating}
              className='control-button'
            >
              {isAnimating ? '▶ Animando...' : '▶ Iniciar Automático'}
            </button>
          </motion.div>  
          <div style={{ marginTop: '8px' }}>
            <label style={{ fontSize: '11px' }}>Velocidade: {animationSpeed}ms</label>
            <input 
              type="range" min="100" max="2000" step="100" 
              value={animationSpeed} 
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
        </div>

        <div style={{ textAlign: 'center', margin: '10px 0', fontSize: '12px', color: '#666' }}>— OU —</div>

        {currentStep === -1 ? (
          <button onClick={vector.handlePrepareStepByStep} style={{ width: '100%', backgroundColor: '#2ecc71', color: 'white', padding: '10px' }}>
            Simular Passo a Passo
          </button>
        ) : (
          <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
              Passo: <strong>{currentStep + 1} / {steps.length}</strong>
            </p>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <button onClick={vector.handlePrevStep} disabled={currentStep === 0}>◀ Voltar</button>
              <button onClick={vector.handleNextStep} disabled={currentStep === steps.length - 1}>Próximo ▶</button>
            </div>
            <button onClick={handleEndSimulation}>Encerrar Simulação</button>
          </div>
        )}
      </div>
    </div>
  );
}