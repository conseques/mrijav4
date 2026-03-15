import React from 'react';
import icon from './Frame 264.png';
import styles from './Successfully.module.css';
const Successfully = ({onClose}) => {
    return (
        <div className={styles.container}>
            <img src={icon} alt=""/>
            <h2>All set!</h2>
            <p>Thanks for registering. We look forward to seeing you there.</p>
            <button onClick={onClose}>Back to Home page</button>
        </div>
    );
};

export default Successfully;