import React from 'react';
import { Link } from 'react-router-dom';

export default function Selector(){
    return(
    <div>
        <h1>Selector</h1>
        <Link to="/view/sll">Ir para Lista Ligada</Link>
        <Link to="/view/vector">Ir para Vetor</Link>
        <Link to="/view/outro-tipo">Outro Tipo</Link>
    </div>);
}