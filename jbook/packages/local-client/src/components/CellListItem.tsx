import '../styles/cell-list-item.css';
import React from 'react';
import { Cell } from '../models';
import CodeCell from './CodeCell';
import TextEditor from './TextEditor';
import ActionBar from './ActionBar';

interface CellListItemProps {
  cell: Cell;
}

/**
 *
 * @param cell Cell with unique id, cell type, and content
 * @returns Component with correct Editor depending on the cell type
 */
const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
  let child: JSX.Element;
  if (cell.type === 'code') {
    child = (
      <>
        <div className='action-bar-wrapper'>
          <ActionBar id={cell.id} />
        </div>
        <CodeCell cell={cell} />
      </>
    );
  } else {
    child = (
      <>
        <TextEditor cell={cell} />
        <ActionBar id={cell.id} />
      </>
    );
  }

  return <div className='cell-list-item'>{child}</div>;
};

export default CellListItem;
