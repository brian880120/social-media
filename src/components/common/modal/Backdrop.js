import React from 'react';
import './Backdrop.css';

const Backdrop = (props) => {
    const component = <div className="backdrop" onClick={props.clicked}></div>;
    return props.isOpen ? component : null;
};

export default Backdrop;
