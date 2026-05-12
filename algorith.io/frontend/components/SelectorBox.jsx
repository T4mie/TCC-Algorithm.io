import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import '../css/selector.css';

export default function SelectorBox({props}) {
    // Variantes para controlar o movimento de subida
    const slideVariants = {
        initial: { y: 0 },
        hover: { y: "-100%" } // Sobe 100% da altura para mostrar o texto
    };

    return (
        <Link to={props.path} style={{ textDecoration: "none" }}>
            <motion.div 
                className='selectorBox'
                initial="initial"
                whileHover="hover"
                whileTap={{ scale: 0.95 }}
            >   
                <motion.div 
                    className="content-wrapper"
                    variants={slideVariants}
                    transition={{ type: "tween", ease: "easeInOut", duration: 0.2 }}
                >
                    <div className="box-section icon-section">
                        <img src={props.icon} alt={props.label} />
                    </div>

                    <div className="box-section text-section">
                        {props.label}
                    </div>
                </motion.div>
            </motion.div>
        </Link>
    );
}
