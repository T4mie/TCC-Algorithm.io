import React, { useState, useEffect } from 'react';
import { ReactFlow, Background, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

function App() {
  const [result, setResult] = useState('Carregando...');
  const [loading, setLoading] = useState(true);

  const initialNodes = [
  { id: 'n1', position: { x: 0, y: 0 }, data: { label: 'Node 1' } },
  { id: 'n2', position: { x: 0, y: 100 }, data: { label: 'Node 2' } },
  ];
  const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];
  useEffect(() => {
    // Chama o backend Python
    // fetch('http://localhost:5000/calc')
    //   .then(res => res.json())
    //   .then(data => {
    //     setResult(data.result);
    //     setLoading(false);
    //   })
    //   .catch(err => {
    //     setResult('Erro ao conectar com o servidor');
    //     setLoading(false);
    //     console.error(err);
    //   });
  }, []);

  return (
    <ReactFlow nodes={initialNodes} edges={initialEdges} style={{ width: '100vw', height: '100vh' }}>
       <Background color="grey" variant="dots" />
    </ReactFlow>
    // <div style={{ padding: '20px' }}>
    //   <h1>Algoritmo - React App</h1>
    //   <div style={{ 
    //     backgroundColor: '#f0f0f0', 
    //     padding: '15px', 
    //     borderRadius: '5px',
    //     marginTop: '10px'
    //   }}>
    //     <h2>Resultado:</h2>
    //     <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
    //       {loading ? 'Carregando...' : result}
    //     </p>
    //   </div>
    // </div>
  );
}

export default App;
