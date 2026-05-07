import React, { useState, useEffect, use } from 'react';
import { useParams } from 'react-router-dom';
import { ReactFlow, Background, Panel, useNodesState, useEdgesState, MarkerType } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Link } from 'react-router-dom';

import { useSLLHandlers } from '../handlers/sll_handle';
import { useVectorHandlers } from '../handlers/vector_handle';

import LinkedListNode from '../custom_node/linkedListNode';
import ListNode from '../custom_node/listNode';
import VectorNode from '../custom_node/vectorNode';

const NODE_TYPES = {
  SLL: LinkedListNode,
  list: ListNode,
  vector: VectorNode,
};

const DEFAULT_EDGE_OPTIONS = {
  markerEnd: { type: MarkerType.ArrowClosed, color: '#000' },
  // type: 'step',
  style: { stroke: '#000000', strokeWidth: 2 }
};

const PANEL_STYLE = {
  padding: '10px',
  backgroundColor: '#fff',
  borderRadius: '5px',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

export default function View() {
  const { type } = useParams();

// Estados Gerais
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeCount, setNodeCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(1000);

  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(-1);

  // Estados Específicos
  const [nodeLabel, setNodeLabel] = useState('');
  const [vectorSize, setVectorSize] = useState('');
  const [vectorId, setVectorId] = useState('');
  const [vectorValue, setVectorValue] = useState('');

  // Agrupando estados para passar aos handlers
  const sharedStates = { 
    nodes, setNodes, edges, setEdges, nodeCount, setNodeCount, 
    isAnimating, setIsAnimating, animationSpeed,
    nodeLabel, setNodeLabel, vectorSize, setVectorSize, 
    vectorId, setVectorId, vectorValue, setVectorValue,
    steps, setSteps, currentStep, setCurrentStep
  };

  // Inicializando Handlers baseados no Tipo
  const sll = useSLLHandlers(sharedStates);
  const vector = useVectorHandlers(sharedStates);

  // Define qual handler usar
  const handlers = type === 'sll' ? sll : vector;

  useEffect(() => {
  if (handlers.fetchData) handlers.fetchData(nodes); // ← Passa nodes atuais
  }, [type]);

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') callback();
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes} edges={edges} 
        nodeTypes={NODE_TYPES}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
        <Background />
        
        <Panel position="top-left">
           <Link to="/" style={{textDecoration: 'none', color: 'blue'}}>← Voltar</Link>
           <h3>Modo: {type?.toUpperCase()}</h3>
        </Panel>

        <Panel position="center-right">
          <div style={PANEL_STYLE}>
            {/* RENDERIZAÇÃO CONDICIONAL DO PAINEL */}
            {type === 'sll' && (
              <div>
                <input 
                  value={nodeLabel} 
                  onChange={(e) => setNodeLabel(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, sll.handleAddNode)}
                  placeholder="Rótulo do nó" 
                />
                <button onClick={sll.handleAddNode}>Adicionar Nó</button>
              </div>
            )}

            {type === 'vector' && (
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
                </div>

                {/* Seção Educativa: Controles de Ordenação */}
                <div>
                  <h4 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Simulação (Sort)</h4>
                  
                  {/* Opção A: Play Automático com Slider */}
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
                    <button 
                      onClick={vector.handlePrepareStepByStep}
                      style={{ width: '100%', backgroundColor: '#2ecc71', color: 'white', padding: '10px' }}
                    >
                      Simular Passo a Passo
                    </button>
                  ) : (
                    <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <p style={{ fontSize: '12px', textAlign: 'center', marginBottom: '10px' }}>
                        Passo: <strong>{currentStep + 1} / {steps.length}</strong>
                      </p>
                      
                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                        <button 
                          onClick={vector.handlePrevStep}
                          disabled={currentStep === 0}
                          style={{ 
                            flex: 1, 
                            padding: '10px', 
                            backgroundColor: currentStep === 0 ? '#ccc' : '#95a5a6', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          ◀ Voltar
                        </button>
                        
                        <button 
                          onClick={vector.handleNextStep}
                          disabled={currentStep === steps.length - 1}
                          style={{ 
                            flex: 2, 
                            padding: '10px', 
                            backgroundColor: currentStep === steps.length - 1 ? '#ccc' : '#e67e22', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px',
                            cursor: currentStep === steps.length - 1 ? 'not-allowed' : 'pointer'
                          }}
                        >
                          Próximo ▶
                        </button>
                      </div>

                      <button 
                        onClick={() => {
                          setCurrentStep(-1);
                          setIsAnimating(false);
                          vector.fetchData();
                        }} 
                        style={{ width: '100%', padding: '5px', fontSize: '11px', background: 'none', border: '1px solid #ccc', cursor: 'pointer' }}
                      >
                        Encerrar Simulação
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}