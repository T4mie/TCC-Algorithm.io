import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";

export default function SelectorBox({ props }) {
    return(
    <Link to={props.path}
    >
        <motion.div 
            whileHover={{scale:1.1,transition:{duration:0.1}}}
            whileTap={{scale:0.9}}
            style={{
                width: '120px',
                height: '120px',
                borderRadius: '8px',
                background: '#C5C5C5',
                color: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
            }}
        >
            {props.label}
        </motion.div>
    </Link>
    );
}