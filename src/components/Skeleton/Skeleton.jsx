import React from 'react';
import styles from './Skeleton.module.css';

const Skeleton = ({ width, height, borderRadius = '12px', className = '' }) => {
  return (
    <div 
      className={`${styles.skeleton} ${className}`} 
      style={{ width, height, borderRadius }}
    />
  );
};

export default Skeleton;
