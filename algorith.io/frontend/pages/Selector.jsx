import React from 'react';
import { Link } from 'react-router-dom';
export default function Selector(){
    return(
    <div>
        <h1>Selector</h1>
        <Link to="/view">Ir para View</Link>
    </div>);
}