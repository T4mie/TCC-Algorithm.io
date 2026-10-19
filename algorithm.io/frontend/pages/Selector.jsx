import React from 'react';
import SelectorBox from '../components/SelectorBox';
import { motion } from 'framer-motion';
import '../css/selector.css';
import SLLIcon from '../icons/SLL.svg';
import VectorIcon from '../icons/Vector.svg';
import StackIcon from '../icons/Stack.svg';
import LogoIcon from '../icons/LogoAlgorithmio.svg';
import HelpWidget from '../components/HelpWidget';

// Tela inicial: exibe os cartões de seleção de estrutura de dados
// (lista ligada, vetor, fila, pilha) e o widget de ajuda geral do projeto.
export default function Selector() {
  return (
    <motion.div className="selectorPage" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.75 }} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
        <img className="selectorLogo" src={LogoIcon} alt="Algorithm.io" />
        <div className="selectorContainer">
          {/* Seção 1 */}
          <div className="selectorSection">
            <h3 className="sectionTitle">Seção 1</h3>
            <hr className="sectionDivider" />
            <div className="sectionCards">
              <SelectorBox props={{ path: '/view/sll', icon: SLLIcon, label: 'Lista Simplesmente Ligada' }} />
              <SelectorBox props={{ path: '/view/vector', icon: VectorIcon, label: 'Vetor' }} />
            </div>
          </div>

          {/* Seção 2 */}
          <div className="selectorSection">
            <h3 className="sectionTitle">Seção 2</h3>
            <hr className="sectionDivider" />
            <div className="sectionCards">
              <SelectorBox props={{ path: '/view/queue', icon: SLLIcon, label: 'Fila' }} />
              <SelectorBox props={{ path: '/view/stack', icon: StackIcon, label: 'Pilha' }} />
            </div>
          </div>
        </div>
      </div>
      <HelpWidget label={`O Algorithm.io é um projeto de ensino que visa facilitar o aprendizado de algoritmos e estruturas de dados trazendo elementos conceituais para elementos visuais.\n\nO que são estruturas de dados? \n\nEstruturas de dados são formas organizadas de armazenar e manipular dados em um programa. Estruturas como vetores e listas são exemplos comuns, as estruturas que inserimos no projeto. \n\nNo momento, oferece conteúdos sobre Listas Simplesmente Ligadas, Vetores, Filas e Pilhas com planos de incluir outras estruturas de dados como listas duplamente ligadas, árvores binárias, etc.`} sizeScale={0.6} />
    </motion.div>
  );
}
