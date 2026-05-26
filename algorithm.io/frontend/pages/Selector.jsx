import React from 'react';
import SelectorBox from '../components/SelectorBox';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import '../css/selector.css'
import SLLIcon from '../icons/SLL.png'
import VectorIcon from '../icons/Vector.png'
export default function Selector(){
    return(
    <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.75}} style={{width: '100%',height:'100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px'}}>
            <h1 style={{fontSize:'2.5rem'}}>Algorithm.io</h1>
            <div className='selectorContainer'>
                <SelectorBox props={{ path: "/view/sll", icon:SLLIcon,label: "Lista Simplesmente Ligada" }} />
                <SelectorBox props={{ path: "/view/vector", icon:VectorIcon, label:"Vetor" }} />
            </div>
        </div>
    </motion.div>
    );
}