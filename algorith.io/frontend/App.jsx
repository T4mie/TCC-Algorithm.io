import React, { useState, useEffect } from 'react';

function App() {
  const [result, setResult] = useState('Carregando...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chama o backend Python
    fetch('http://localhost:5000/calc')
      .then(res => res.json())
      .then(data => {
        setResult(data.result);
        setLoading(false);
      })
      .catch(err => {
        setResult('Erro ao conectar com o servidor');
        setLoading(false);
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Algoritmo - React App</h1>
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '5px',
        marginTop: '10px'
      }}>
        <h2>Resultado:</h2>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
          {loading ? 'Carregando...' : result}
        </p>
      </div>
    </div>
  );
}

export default App;
