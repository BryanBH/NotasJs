import "../styles/cellList.css"
import React from 'react';
import { useSelector } from 'react-redux';
import { Rootstate } from '../store';
import CellListItem from './CellListItem';
import AddCell from './AddCell';

/**
 * High Level component which contains the list of cells
 * @returns Cell List Component
 */
const CellList: React.FC = () => {
  const cells = useSelector(({ cells: { order, data } }: Rootstate) =>
    //loop through order array, get id and return the object from with data
    order.map((id) => data[id])
  );

  const renderedCells = cells.map((cell) => (
    // React Fragment added to allow for key
    <React.Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell} />
      <AddCell previuosCellId={cell.id} />
    </React.Fragment>
  ));
  return (
    <div className="cell-list">
      <AddCell previuosCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
