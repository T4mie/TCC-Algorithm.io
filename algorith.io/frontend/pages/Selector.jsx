import React from 'react';
import SelectorBox from '../components/SelectorBox';
import { Link } from 'react-router-dom';


export default function Selector(){
    return(
    <div style={{width: '100%',height:'100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{width: '90%',height:'90%', padding:'12px', display: 'grid', gridTemplateColumns: 'repeat(8, 0.5fr)', gap: '1px', borderColor: 'gray',borderRadius: '8px', borderWidth: '2px', borderStyle: 'solid'}}>
            <SelectorBox props={{ path: "/view/sll", label: "Ir para Lista Ligada" }} />
            <SelectorBox props={{ path: "/view/vector", label: "Ir para Vetor" }} />
            <SelectorBox props={{ path: "/view/outro-tipo", label: "Outro Tipo" }} />
        </div>
    </div>
    );
}