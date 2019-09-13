import React from 'react';
import './Modal.css';
import Backdrop from './Backdrop';

const Modal = props => {
    let className = 'modal-container';

    className += props.isOpen ? ' modal-show' : ' modal-hide';

    return (
        <React.Fragment>
            <Backdrop isOpen={props.isOpen} clicked={props.onClose} />
            <div className={className}>
                {props.children}
            </div>
        </React.Fragment>
    );
};

export default Modal;
