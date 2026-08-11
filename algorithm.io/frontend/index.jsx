import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ponto de entrada do renderer: monta o componente App na div #root
// dentro do StrictMode do React.
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
