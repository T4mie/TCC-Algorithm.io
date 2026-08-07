import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchSortSteps } from '../api/api_vector';
import { fetchStackSteps } from '../api/api_stack';

// Importando os dados dos arquivos separados
import { pseudocodigoLines } from '../code_view_data/insertion_sort/pseudocodigo';
import { javaLines } from '../code_view_data/insertion_sort/java';
import { pythonLines } from '../code_view_data/insertion_sort/python';
import { stackPushPseudocodigoLines } from '../code_view_data/stack/stack_push/pseudocodigo';
import { stackPushJavaLines } from '../code_view_data/stack/stack_push/java';
import { stackPushPythonLines } from '../code_view_data/stack/stack_push/python';
import { stackPopPseudocodigoLines } from '../code_view_data/stack/stack_pop/pseudocodigo';
import { stackPopJavaLines } from '../code_view_data/stack/stack_pop/java';
import { stackPopPythonLines } from '../code_view_data/stack/stack_pop/python';

import '../css/codeView.css';

// CodeView exibe o código do algoritmo com destaque na linha ativa.
// A lógica de mapeamento de passos para código está concentrada neste componente.
// Objeto de mapeamento para extrair dinamicamente a linguagem escolhida
const codeSnippets = {
  pseudocódigo: pseudocodigoLines,
  java: javaLines,
  python: pythonLines
};

const stackPushSnippets = {
  pseudocódigo: stackPushPseudocodigoLines,
  java: stackPushJavaLines,
  python: stackPushPythonLines
};

const stackPopSnippets = {
  pseudocódigo: stackPopPseudocodigoLines,
  java: stackPopJavaLines,
  python: stackPopPythonLines
};

export default function CodeView({ activeStep: propActiveStep = 'INIT_LOOP' }) {
  const location = useLocation();
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const viewType = params.get('type'); 
  const stepParam = params.get('step');

  const [steps, setSteps] = useState([]);
  const [stepIndex, setStepIndex] = useState(stepParam ? Number(stepParam) : -1);
  const [activeStep, setActiveStep] = useState(propActiveStep);

  const [lang, setLang] = useState('pseudocódigo');
  const [stackOp, setStackOp] = useState(null);

  // Seleciona o array de código correto conforme o tipo de estrutura visualizada
  const codeLines = viewType === 'vector'
    ? codeSnippets[lang]
    : viewType === 'stack'
      ? (stackOp === 'pop' ? stackPopSnippets[lang] : stackPushSnippets[lang])
      : [];

  // Map a backend step object to a code line id using heuristics,
  // but prefer an explicit `code_id` when the backend provides it.
  const mapStepToCodeId = (step, prevStep) => {
    if (step && step.code_id) return step.code_id;
    if (!step) return propActiveStep || 'INIT_LOOP';
    const hasKey = typeof step.activeKey !== 'undefined' && step.activeKey !== null;
    const comparing = Array.isArray(step.comparing) ? step.comparing : [];
    const swapped = Array.isArray(step.swapped) ? step.swapped : [];

    if (hasKey && (!prevStep || !prevStep.activeKey)) return 'SET_KEY';
    if (swapped.length > 0) return 'SHIFT';
    if (comparing.length > 0 && hasKey) return 'WHILE_COND';
    if (!hasKey && prevStep && prevStep.activeKey) return 'INSERT';
    return propActiveStep || 'INIT_LOOP';
  };

  useEffect(() => {
    // Carrega todos os passos quando a visão é de vetor, para permitir o
    // mapeamento dos passos em linhas de código posteriormente.
    const loadSteps = async () => {
      if (viewType !== 'vector') return;
      try {
        const all = await fetchSortSteps();
        setSteps(all);
        if (stepParam !== null) {
          const idx = Number(stepParam);
          setStepIndex(idx);
          const prev = all[idx - 1] || null;
          const current = all[idx] || null;
          const codeId = mapStepToCodeId(current, prev);
          setActiveStep(codeId);
        }
      } catch (e) {
        setActiveStep(propActiveStep);
      }
    };
    loadSteps();
  }, [stepParam, viewType]);

  // register live updates from parent window (when user steps in View)
  useEffect(() => {
    if (viewType !== 'vector') return;
    if (!window || !window.electronAPI || typeof window.electronAPI.onChildStep !== 'function') return;

    const handler = async (payload) => {
      const idx = (payload && typeof payload.step !== 'undefined') ? Number(payload.step) : -1;
      setStepIndex(idx);

      if (idx < 0) {
        // clear highlight when simulation ended
        setActiveStep(null);
        return;
      }

      if (steps && steps.length > 0) {
        const prev = steps[idx - 1] || null;
        const current = steps[idx] || null;
        setActiveStep(mapStepToCodeId(current, prev));
      } else {
        try {
          const all = await fetchSortSteps();
          setSteps(all);
          const prev = all[idx - 1] || null;
          const current = all[idx] || null;
          setActiveStep(mapStepToCodeId(current, prev));
        } catch (e) {
          // Ignore fetch failures on live update
        }
      }
    };

    window.electronAPI.onChildStep(handler);
    return () => {
      if (window && window.electronAPI && typeof window.electronAPI.removeChildStep === 'function') {
        window.electronAPI.removeChildStep(handler);
      }
    };
  }, [viewType, steps]);

  // Carrega os últimos passos de push/pop gerados pelo backend para a pilha.
  // Diferente do vetor, os passos da pilha já trazem `code_id` explícito em
  // todo passo, então não é preciso nenhuma heurística de mapeamento.
  useEffect(() => {
    const loadStackSteps = async () => {
      if (viewType !== 'stack') return;
      try {
        const result = await fetchStackSteps();
        setSteps(result.steps || []);
        setStackOp(result.op || null);
        if (stepParam !== null) {
          const idx = Number(stepParam);
          setStepIndex(idx);
          const current = (result.steps || [])[idx] || null;
          setActiveStep(current ? current.code_id : null);
        }
      } catch (e) {
        setActiveStep(null);
      }
    };
    loadStackSteps();
  }, [stepParam, viewType]);

  // Registra atualizações ao vivo vindas da janela principal (Empilhar/Desempilhar
  // e Voltar/Próximo). Reconsulta /stack_steps a cada evento para não dessincronizar
  // o `stackOp` caso o usuário troque de operação (push -> pop ou vice-versa).
  useEffect(() => {
    if (viewType !== 'stack') return;
    if (!window || !window.electronAPI || typeof window.electronAPI.onChildStep !== 'function') return;

    const handler = async (payload) => {
      const idx = (payload && typeof payload.step !== 'undefined') ? Number(payload.step) : -1;
      setStepIndex(idx);

      if (idx < 0) {
        setActiveStep(null);
        return;
      }

      try {
        const result = await fetchStackSteps();
        const stepsList = result.steps || [];
        setSteps(stepsList);
        setStackOp(result.op || null);
        const current = stepsList[idx] || null;
        setActiveStep(current ? current.code_id : null);
      } catch (e) {
        // Ignora falhas de busca em atualizações ao vivo
      }
    };

    window.electronAPI.onChildStep(handler);
    return () => {
      if (window && window.electronAPI && typeof window.electronAPI.removeChildStep === 'function') {
        window.electronAPI.removeChildStep(handler);
      }
    };
  }, [viewType]);

  const buttonStyle = (active) => ({
    background: active ? '#0f766e' : '#111',
    color: active ? '#fff' : '#cfcfcf',
    border: '1px solid #222',
    padding: '6px 10px',
    borderRadius: 4,
    cursor: 'pointer'
  });

  return (
    <div style={{
      padding: '16px',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: '#0b0b0b',
      color: '#e6e6e6',
      fontFamily: 'Menlo, Monaco, "Courier New", monospace',
      overflow: 'hidden'
    }}>
      <h1 style={{ margin: 0, paddingBottom: 12, color: '#ffffff' }}>Visualizador de Código</h1>
      
      <div  className="codeView__container" style={{
        marginTop: 8,
        backgroundColor: '#0b0b0b',
        color: '#00ff88',
        borderRadius: 6,
        padding: '12px',
        width: '95%',
        maxHeight: '80vh',
        overflow: 'auto',
        boxSizing: 'border-box'
      }}>
        {viewType === 'vector' && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: '0 12px' }}>
              <button style={buttonStyle(lang === 'pseudocódigo')} onClick={() => setLang('pseudocódigo')}>pseudocódigo</button>
              <button style={buttonStyle(lang === 'java')} onClick={() => setLang('java')}>Java</button>
              <button style={buttonStyle(lang === 'python')} onClick={() => setLang('python')}>Python</button>
            </div>
            
            <div style={{ margin: 0, whiteSpace: 'pre', fontSize: 14, lineHeight: 1.6 }}>
              {codeLines.map((line, index) => {
                const isHighlighted = activeStep === line.id;
                
                return (
                  <div 
                    key={index} 
                    style={{
                      padding: '0 12px',
                      backgroundColor: isHighlighted ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                      borderLeft: isHighlighted ? '3px solid #00ff88' : '3px solid transparent',
                      color: isHighlighted ? '#ffffff' : '#00ff88',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {line.text}
                  </div>
                );
              })}
            </div>
          </>
        )}
        {viewType === 'stack' && (
          <>
            <p style={{ margin: '0 0 8px', padding: '0 12px', fontSize: 12, color: '#9aa0a6' }}>
              {stackOp === 'pop' ? 'Simulando: pop() — Desempilhar' : 'Simulando: push() — Empilhar'}
            </p>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, padding: '0 12px' }}>
              <button style={buttonStyle(lang === 'pseudocódigo')} onClick={() => setLang('pseudocódigo')}>pseudocódigo</button>
              <button style={buttonStyle(lang === 'java')} onClick={() => setLang('java')}>Java</button>
              <button style={buttonStyle(lang === 'python')} onClick={() => setLang('python')}>Python</button>
            </div>

            <div style={{ margin: 0, whiteSpace: 'pre', fontSize: 14, lineHeight: 1.6 }}>
              {codeLines.map((line, index) => {
                const isHighlighted = activeStep === line.id;

                return (
                  <div
                    key={index}
                    style={{
                      padding: '0 12px',
                      backgroundColor: isHighlighted ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
                      borderLeft: isHighlighted ? '3px solid #00ff88' : '3px solid transparent',
                      color: isHighlighted ? '#ffffff' : '#00ff88',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {line.text}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}