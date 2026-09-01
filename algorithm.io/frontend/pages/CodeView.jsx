import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchSortSteps } from '../api/api_vector';
import { fetchStackSteps } from '../api/api_stack';
import { fetchQueueSteps } from '../api/api_queue';
import { fetchSLLSteps } from '../api/api_sll';
import { fetchArraySteps } from '../api/api_array_vector';
import { fetchMergeSortSteps } from '../api/api_merge_sort';

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
import { queueEnqueuePseudocodigoLines } from '../code_view_data/queue/queue_enqueue/pseudocodigo';
import { queueEnqueueJavaLines } from '../code_view_data/queue/queue_enqueue/java';
import { queueEnqueuePythonLines } from '../code_view_data/queue/queue_enqueue/python';
import { queueDequeuePseudocodigoLines } from '../code_view_data/queue/queue_dequeue/pseudocodigo';
import { queueDequeueJavaLines } from '../code_view_data/queue/queue_dequeue/java';
import { queueDequeuePythonLines } from '../code_view_data/queue/queue_dequeue/python';
import { sllInsertLastPseudocodigoLines } from '../code_view_data/sll/sll_insert_last/pseudocodigo';
import { sllInsertLastJavaLines } from '../code_view_data/sll/sll_insert_last/java';
import { sllInsertLastPythonLines } from '../code_view_data/sll/sll_insert_last/python';
import { sllInsertFirstPseudocodigoLines } from '../code_view_data/sll/sll_insert_first/pseudocodigo';
import { sllInsertFirstJavaLines } from '../code_view_data/sll/sll_insert_first/java';
import { sllInsertFirstPythonLines } from '../code_view_data/sll/sll_insert_first/python';
import { sllRemoveFirstPseudocodigoLines } from '../code_view_data/sll/sll_remove_first/pseudocodigo';
import { sllRemoveFirstJavaLines } from '../code_view_data/sll/sll_remove_first/java';
import { sllRemoveFirstPythonLines } from '../code_view_data/sll/sll_remove_first/python';
import { sllRemoveLastPseudocodigoLines } from '../code_view_data/sll/sll_remove_last/pseudocodigo';
import { sllRemoveLastJavaLines } from '../code_view_data/sll/sll_remove_last/java';
import { sllRemoveLastPythonLines } from '../code_view_data/sll/sll_remove_last/python';
import { arrayInsertPseudocodigoLines } from '../code_view_data/array/array_insert/pseudocodigo';
import { arrayInsertJavaLines } from '../code_view_data/array/array_insert/java';
import { arrayInsertPythonLines } from '../code_view_data/array/array_insert/python';
import { arrayRemovePseudocodigoLines } from '../code_view_data/array/array_remove/pseudocodigo';
import { arrayRemoveJavaLines } from '../code_view_data/array/array_remove/java';
import { arrayRemovePythonLines } from '../code_view_data/array/array_remove/python';
import { mergeSortPseudocodigoLines } from '../code_view_data/merge_sort/pseudocodigo';
import { mergeSortJavaLines } from '../code_view_data/merge_sort/java';
import { mergeSortPythonLines } from '../code_view_data/merge_sort/python';

import '../css/codeView.css';

// Objeto de mapeamento para extrair dinamicamente a linguagem escolhida (insertion sort / vetor)
const codeSnippets = {
  pseudocódigo: pseudocodigoLines,
  java: javaLines,
  python: pythonLines
};

// Snippets do método push() da pilha, por linguagem.
const stackPushSnippets = {
  pseudocódigo: stackPushPseudocodigoLines,
  java: stackPushJavaLines,
  python: stackPushPythonLines
};

// Snippets do método pop() da pilha, por linguagem.
const stackPopSnippets = {
  pseudocódigo: stackPopPseudocodigoLines,
  java: stackPopJavaLines,
  python: stackPopPythonLines
};

// Snippets do método enqueue() da fila, por linguagem.
const queueEnqueueSnippets = {
  pseudocódigo: queueEnqueuePseudocodigoLines,
  java: queueEnqueueJavaLines,
  python: queueEnqueuePythonLines
};

// Snippets do método dequeue() da fila, por linguagem.
const queueDequeueSnippets = {
  pseudocódigo: queueDequeuePseudocodigoLines,
  java: queueDequeueJavaLines,
  python: queueDequeuePythonLines
};

// Snippets do método insert_last() da lista ligada, por linguagem.
const sllInsertLastSnippets = {
  pseudocódigo: sllInsertLastPseudocodigoLines,
  java: sllInsertLastJavaLines,
  python: sllInsertLastPythonLines
};

// Snippets do método insert_first() da lista ligada, por linguagem.
const sllInsertFirstSnippets = {
  pseudocódigo: sllInsertFirstPseudocodigoLines,
  java: sllInsertFirstJavaLines,
  python: sllInsertFirstPythonLines
};

// Snippets do método remove_first() da lista ligada, por linguagem.
const sllRemoveFirstSnippets = {
  pseudocódigo: sllRemoveFirstPseudocodigoLines,
  java: sllRemoveFirstJavaLines,
  python: sllRemoveFirstPythonLines
};

// Snippets do método remove_last() da lista ligada, por linguagem.
const sllRemoveLastSnippets = {
  pseudocódigo: sllRemoveLastPseudocodigoLines,
  java: sllRemoveLastJavaLines,
  python: sllRemoveLastPythonLines
};

// Mapeia a operação atual da SLL para o conjunto de snippets correspondente.
const sllSnippetsByOp = {
  insert_last: sllInsertLastSnippets,
  insert_first: sllInsertFirstSnippets,
  remove_first: sllRemoveFirstSnippets,
  remove_last: sllRemoveLastSnippets
};

// Snippets do método insert() do vetor de capacidade fixa, por linguagem.
const arrayInsertSnippets = {
  pseudocódigo: arrayInsertPseudocodigoLines,
  java: arrayInsertJavaLines,
  python: arrayInsertPythonLines
};

// Snippets do método remove() do vetor de capacidade fixa, por linguagem.
const arrayRemoveSnippets = {
  pseudocódigo: arrayRemovePseudocodigoLines,
  java: arrayRemoveJavaLines,
  python: arrayRemovePythonLines
};

// Snippets do Merge Sort (mergeSort + merge), por linguagem.
const mergeSortSnippets = {
  pseudocódigo: mergeSortPseudocodigoLines,
  java: mergeSortJavaLines,
  python: mergeSortPythonLines
};

// CodeView exibe o código do algoritmo/método (pseudocódigo, Java ou Python) com destaque
// na linha ativa, mantendo-se sincronizado com o passo atual da simulação em View.jsx
// (via query string na primeira carga e via IPC do Electron para atualizações ao vivo).
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
  const [queueOp, setQueueOp] = useState(null);
  const [sllOp, setSllOp] = useState(null);
  const [arrayOp, setArrayOp] = useState(null);

  // Seleciona o array de código correto conforme o tipo de estrutura visualizada
  const codeLines = viewType === 'insertion-sort'
    ? codeSnippets[lang]
    : viewType === 'stack'
      ? (stackOp === 'pop' ? stackPopSnippets[lang] : stackPushSnippets[lang])
      : viewType === 'queue'
        ? (queueOp === 'dequeue' ? queueDequeueSnippets[lang] : queueEnqueueSnippets[lang])
        : viewType === 'sll'
          ? (sllSnippetsByOp[sllOp] || sllInsertLastSnippets)[lang]
          : viewType === 'vector'
            ? (arrayOp === 'remove' ? arrayRemoveSnippets[lang] : arrayInsertSnippets[lang])
            : viewType === 'merge-sort'
              ? mergeSortSnippets[lang]
              : [];

  // Mapeia um objeto de passo vindo do backend para o id de uma linha de código,
  // usando heurísticas; prefere o `code_id` explícito quando o backend o fornece
  // (caso da pilha e da fila). Usado apenas como fallback para o vetor.
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
      if (viewType !== 'insertion-sort') return;
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

  // Registra atualizações ao vivo vindas da janela principal (quando o usuário
  // avança/volta passos em View.jsx) para manter o destaque do vetor sincronizado.
  useEffect(() => {
    if (viewType !== 'insertion-sort') return;
    if (!window || !window.electronAPI || typeof window.electronAPI.onChildStep !== 'function') return;

    const handler = async (payload) => {
      const idx = (payload && typeof payload.step !== 'undefined') ? Number(payload.step) : -1;
      setStepIndex(idx);

      if (idx < 0) {
        // limpa o destaque quando a simulação termina
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
          // Ignora falhas de busca em atualizações ao vivo
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

  // Carrega todos os passos quando a visão é do Merge Sort. Assim como a
  // pilha e a fila, cada passo já traz `code_id` explícito (não precisa de
  // heurística de mapeamento como o Insertion Sort).
  useEffect(() => {
    const loadMergeSortSteps = async () => {
      if (viewType !== 'merge-sort') return;
      try {
        const all = await fetchMergeSortSteps();
        setSteps(all);
        if (stepParam !== null) {
          const idx = Number(stepParam);
          setStepIndex(idx);
          const current = all[idx] || null;
          setActiveStep(current ? current.code_id : null);
        }
      } catch (e) {
        setActiveStep(propActiveStep);
      }
    };
    loadMergeSortSteps();
  }, [stepParam, viewType]);

  // Registra atualizações ao vivo vindas da janela principal (quando o usuário
  // avança/volta passos em View.jsx) para manter o destaque do Merge Sort sincronizado.
  useEffect(() => {
    if (viewType !== 'merge-sort') return;
    if (!window || !window.electronAPI || typeof window.electronAPI.onChildStep !== 'function') return;

    const handler = async (payload) => {
      const idx = (payload && typeof payload.step !== 'undefined') ? Number(payload.step) : -1;
      setStepIndex(idx);

      if (idx < 0) {
        setActiveStep(null);
        return;
      }

      if (steps && steps.length > 0) {
        const current = steps[idx] || null;
        setActiveStep(current ? current.code_id : null);
      } else {
        try {
          const all = await fetchMergeSortSteps();
          setSteps(all);
          const current = all[idx] || null;
          setActiveStep(current ? current.code_id : null);
        } catch (e) {
          // Ignora falhas de busca em atualizações ao vivo
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

  // Carrega os últimos passos de enqueue/dequeue gerados pelo backend para a fila.
  // Assim como a pilha, cada passo já traz `code_id` explícito.
  useEffect(() => {
    const loadQueueSteps = async () => {
      if (viewType !== 'queue') return;
      try {
        const result = await fetchQueueSteps();
        setSteps(result.steps || []);
        setQueueOp(result.op || null);
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
    loadQueueSteps();
  }, [stepParam, viewType]);

  // Registra atualizações ao vivo vindas da janela principal (Enfileirar/Desenfileirar
  // e Voltar/Próximo). Reconsulta /queue_steps a cada evento para não dessincronizar
  // o `queueOp` caso o usuário troque de operação (enqueue -> dequeue ou vice-versa).
  useEffect(() => {
    if (viewType !== 'queue') return;
    if (!window || !window.electronAPI || typeof window.electronAPI.onChildStep !== 'function') return;

    const handler = async (payload) => {
      const idx = (payload && typeof payload.step !== 'undefined') ? Number(payload.step) : -1;
      setStepIndex(idx);

      if (idx < 0) {
        setActiveStep(null);
        return;
      }

      try {
        const result = await fetchQueueSteps();
        const stepsList = result.steps || [];
        setSteps(stepsList);
        setQueueOp(result.op || null);
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

  // Carrega os últimos passos de insert/remove gerados pelo backend para a
  // lista ligada. Assim como a pilha e a fila, cada passo já traz `code_id`
  // explícito, mas aqui há 4 operações possíveis em vez de 2.
  useEffect(() => {
    const loadSllSteps = async () => {
      if (viewType !== 'sll') return;
      try {
        const result = await fetchSLLSteps();
        setSteps(result.steps || []);
        setSllOp(result.op || null);
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
    loadSllSteps();
  }, [stepParam, viewType]);

  // Registra atualizações ao vivo vindas da janela principal (Inserir/Remover
  // e Voltar/Próximo). Reconsulta /sll_steps a cada evento para não
  // dessincronizar o `sllOp` caso o usuário troque de operação.
  useEffect(() => {
    if (viewType !== 'sll') return;
    if (!window || !window.electronAPI || typeof window.electronAPI.onChildStep !== 'function') return;

    const handler = async (payload) => {
      const idx = (payload && typeof payload.step !== 'undefined') ? Number(payload.step) : -1;
      setStepIndex(idx);

      if (idx < 0) {
        setActiveStep(null);
        return;
      }

      try {
        const result = await fetchSLLSteps();
        const stepsList = result.steps || [];
        setSteps(stepsList);
        setSllOp(result.op || null);
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

  // Carrega os últimos passos de insert/remove gerados pelo backend para o
  // vetor de capacidade fixa. Assim como a pilha, cada passo já traz
  // `code_id` explícito.
  useEffect(() => {
    const loadArraySteps = async () => {
      if (viewType !== 'vector') return;
      try {
        const result = await fetchArraySteps();
        setSteps(result.steps || []);
        setArrayOp(result.op || null);
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
    loadArraySteps();
  }, [stepParam, viewType]);

  // Registra atualizações ao vivo vindas da janela principal (Inserir/Remover
  // e Voltar/Próximo). Reconsulta /array_steps a cada evento para não
  // dessincronizar o `arrayOp` caso o usuário troque de operação.
  useEffect(() => {
    if (viewType !== 'vector') return;
    if (!window || !window.electronAPI || typeof window.electronAPI.onChildStep !== 'function') return;

    const handler = async (payload) => {
      const idx = (payload && typeof payload.step !== 'undefined') ? Number(payload.step) : -1;
      setStepIndex(idx);

      if (idx < 0) {
        setActiveStep(null);
        return;
      }

      try {
        const result = await fetchArraySteps();
        const stepsList = result.steps || [];
        setSteps(stepsList);
        setArrayOp(result.op || null);
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

  // Gera o estilo do botão de seleção de linguagem, destacando o idioma ativo.
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
        {viewType === 'insertion-sort' && (
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
        {viewType === 'queue' && (
          <>
            <p style={{ margin: '0 0 8px', padding: '0 12px', fontSize: 12, color: '#9aa0a6' }}>
              {queueOp === 'dequeue' ? 'Simulando: dequeue() — Desenfileirar' : 'Simulando: enqueue() — Enfileirar'}
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
        {viewType === 'sll' && (
          <>
            <p style={{ margin: '0 0 8px', padding: '0 12px', fontSize: 12, color: '#9aa0a6' }}>
              {{
                insert_last: 'Simulando: insert_last() — Inserir no Fim',
                insert_first: 'Simulando: insert_first() — Inserir no Início',
                remove_first: 'Simulando: remove_first() — Remover do Início',
                remove_last: 'Simulando: remove_last() — Remover do Fim'
              }[sllOp] || 'Simulando: insert_last() — Inserir no Fim'}
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
        {viewType === 'vector' && (
          <>
            <p style={{ margin: '0 0 8px', padding: '0 12px', fontSize: 12, color: '#9aa0a6' }}>
              {arrayOp === 'remove' ? 'Simulando: remove() — Remover do Índice' : 'Simulando: insert() — Inserir no Índice'}
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
        {viewType === 'merge-sort' && (
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