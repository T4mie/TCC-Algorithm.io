import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import View from './pages/View';
import Selector from './pages/Selector';
import CodeView from './pages/CodeView';

// Componente raiz: define as rotas da aplicação (tela de seleção,
// visualização de estrutura e janela de código) usando HashRouter.
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Selector />} />
        <Route path="/view/:type" element={<View />} />
        <Route path="/codeview" element={<CodeView />} />
      </Routes>
    </Router>
  );
}