import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchSortSteps } from '../api/api_vector';

// Importando os dados dos arquivos separados
import { pseudocodigoLines } from '../code_view_data/insertion_sort/pseudocodigo';
import { javaLines } from '../code_view_data/insertion_sort/java';
import { pythonLines } from '../code_view_data/insertion_sort/python';

import '../css/codeView.css';
// Objeto de mapeamento para extrair dinamicamente a linguagem escolhida
const codeSnippets = {
  pseudocódigo: pseudocodigoLines,
  java: javaLines,
  python: pythonLines
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

  // Seleciona o array de código correto ou retorna um array vazio se não for viewType 'vector'
  const codeLines = viewType === 'vector' ? codeSnippets[lang] : [];

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
    // fetch all steps when viewing a vector so we can map updates later
    const loadSteps = async () => {
      if (viewType !== 'vector') return;
      try {
        const all = await fetchSortSteps();
        console.log('CodeView: loaded steps count', all.length, 'code_ids', all.map(s => s && s.code_id));
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
      console.log('CodeView: received child-step update', idx);
      setStepIndex(idx);

      if (idx < 0) {
        // clear highlight when simulation ended
        setActiveStep(null);
        return;
      }

      // if we already have steps, map immediately; otherwise fetch
      if (steps && steps.length > 0) {
        console.log('CodeView: mapping step object', steps[idx]);
        const prev = steps[idx - 1] || null;
        const current = steps[idx] || null;
        setActiveStep(mapStepToCodeId(current, prev));
      } else {
        try {
          const all = await fetchSortSteps();
          console.log('CodeView: fetched steps on update', all.length, all.map(s => s && s.code_id));
          setSteps(all);
          const prev = all[idx - 1] || null;
          const current = all[idx] || null;
          setActiveStep(mapStepToCodeId(current, prev));
        } catch (e) {
          // ignore
        }
      }
    };

    window.electronAPI.onChildStep(handler);
  }, [viewType, steps]);

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
      </div>
    </div>
  );
}