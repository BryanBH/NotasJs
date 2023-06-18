import '../styles/action-bar.css';
import React from 'react';
import ActionButton from './ActionButton';
import { useEnhanchedDispatch } from '../hooks';
import { moveCellByID, deleteCellByID } from '../store';
interface ActionBarProps {
  id: string;
}

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const [moveCell] = useEnhanchedDispatch(moveCellByID);
  const [deleteCell] = useEnhanchedDispatch(deleteCellByID);
  return (
    <div className='action-bar'>
      <ActionButton
        icon='fa-arrow-up'
        onClick={() => moveCell({ id: id, direction: 'up' })}
      />
      <ActionButton
        icon='fa-arrow-down'
        onClick={() => moveCell({ id, direction: 'down' })}
      />
      <ActionButton icon='fa-times' onClick={() => deleteCell(id)} />
    </div>
  );
};

export default ActionBar;
