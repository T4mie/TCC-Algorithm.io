import React from 'react';
import SelectorBox from '../components/SelectorBox';
import { Link } from 'react-router-dom';
import '../css/selector.css'
export default function Selector(){
    return(
    <div style={{width: '100%',height:'100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div className='selectorContainer'>
            <SelectorBox props={{ path: "/view/sll", label: "Lista Ligada Simples" }} />
            <SelectorBox props={{ path: "/view/vector", label: "Ir para Vetor" }} />
        </div>
    </div>
    );
}