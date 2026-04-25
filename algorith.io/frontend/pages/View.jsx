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
  const [animationSpeed, setAnimationSpeed] = useState(500);

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
    vectorId, setVectorId, vectorValue, setVectorValue 
  };

  // Inicializando Handlers baseados no Tipo
  const sll = useSLLHandlers(sharedStates);
  const vector = useVectorHandlers(sharedStates);

  // Define qual handler usar
  const handlers = type === 'sll' ? sll : vector;

  useEffect(() => {
    if (handlers.fetchData) handlers.fetchData();
  }, [type]); // Recarrega se mudar o tipo na URL

  const handleKeyPress = (e, callback) => {
    if (e.key === 'Enter') callback();
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow 
        nodes={nodes} edges={edges} 
        nodeTypes={NODE_TYPES}
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
                <section>
                  <input value={vectorSize} onChange={(e) => setVectorSize(e.target.value)} placeholder="Tamanho" />
                  <button onClick={vector.handleCreateVector}>Criar Vetor</button>
                </section>
                
                <section style={{marginTop: '10px'}}>
                  <input value={vectorId} onChange={(e) => setVectorId(e.target.value)} placeholder="ID" />
                  <input value={vectorValue} onChange={(e) => setVectorValue(e.target.value)} placeholder="Valor" />
                  <button onClick={vector.handleInsertVectorValue}>Inserir</button>
                </section>

                <hr />
                <button onClick={vector.handleInsertionSort} disabled={isAnimating}>
                  {isAnimating ? 'Ordenando...' : 'Iniciar Sort'}
                </button>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}