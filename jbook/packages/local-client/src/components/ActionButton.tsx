import "../styles/action-button.css"
import React from 'react';

interface ActionButtonProps {
  icon: string;
  onClick: any;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, onClick }) => {
  return (
    <button className=' action-button button is-primary is-small' onClick={onClick}>
      <span className='icon'>
        <i className={`fas ${icon}`}></i>
      </span>
    </button>
  );
};

export default ActionButton;
