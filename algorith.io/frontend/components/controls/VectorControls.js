// components/VectorControls.js
import React from 'react';

export default function VectorControls({ states, handlers }) {
  const {
    vectorSize, setVectorSize, vectorId, setVectorId, vectorValue, setVectorValue,
    isAnimating, animationSpeed, setAnimationSpeed, currentStep, steps, setIsAnimating, setCurrentStep
  } = states;

  const vector = handlers;

  return (
    <div>
      {/* Seção de Gerenciamento: Criar e Inserir */}
      <div style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <section style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
          <input value={vectorSize} onChange={(e) => setVectorSize(e.target.value)} placeholder="Tamanho" style={{ width: '60px' }} />
          <button onClick={vector.handleCreateVector}>Criar</button>
        </section>
        
        <section style={{ display: 'flex', gap: '5px' }}>
          <input value={vectorId} onChange={(e) => setVectorId(e.target.value)} placeholder="ID" style={{ width: '40px' }} />
          <input value={vectorValue} onChange={(e) => setVectorValue(e.target.value)} placeholder="Valor" style={{ width: '60px' }} />
          <button onClick={vector.handleInsertVectorValue}>Inserir</button>
        </section>

        <select 
          value={states.vectorType} 
          onChange={(e) => states.setVectorType(e.target.value)}>
          <option value="int">Inteiros</option>
          <option value="string">Texto</option>
        </select>

      </div>

      {/* Seção Educativa: Controles de Ordenação */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Simulação (Sort)</h4>
        
        <div style={{ marginBottom: '10px' }}>
          <button 
            onClick={vector.handleInsertionSort} 
            disabled={isAnimating}
            style={{ width: '100%', backgroundColor: '#3498db', color: 'white', border: 'none', padding: '8px', borderRadius: '4px' }}
          >
            {isAnimating ? '▶ Animando...' : '▶ Iniciar Automático'}
          </button>
          
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
            <button onClick={() => { setCurrentStep(-1); setIsAnimating(false); vector.fetchData(); }}>Encerrar Simulação</button>
          </div>
        )}
      </div>
    </div>
  );
}