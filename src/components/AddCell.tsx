import '../styles/add-cell.css';
import React from 'react';
import { useEnhanchedDispatch } from '../hooks';
import { insertCellAfter } from '../store';

interface AddCellProps {
  previuosCellId: string | null;
}

/**
 * JSX component that adds a type cell to the cell list
 * @param previuosCellId Id of the previous cell in the list  
 * @returns Add Cell action bar component
 */
const AddCell: React.FC<AddCellProps> = ({  previuosCellId }) => {
  const [insetCell] = useEnhanchedDispatch(insertCellAfter);

  return (
    <div className='add-cell'>
      <div className='add-buttons'>
        <button
          className='button is-rounded is-primary is-small'
          onClick={() => insetCell({ id: previuosCellId, cellType: 'code' })}>
          <span className='icon is-small'>
            <i className='fas fa-plus'></i>
          </span>
          <span>Code</span>
        </button>
        <button
          className='button is-rounded is-primary is-small'
          onClick={() => insetCell({ id: previuosCellId, cellType: 'text' })}>
          <span className='icon is-small'>
            <i className='fas fa-plus'></i>
          </span>
          <span>Text</span>
        </button>
      </div>
      <div className='divider'></div>
    </div>
  );
};

export default AddCell;
