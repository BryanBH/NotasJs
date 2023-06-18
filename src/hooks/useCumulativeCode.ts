import { useSelector } from 'react-redux';
import { Rootstate } from '../store';

/**
 * Hook to select all code cell's and combine their contents to allow for code to be shared between cells
 * @param cellId Id of cell
 * @returns string of cumulative code cell content which includes the show function
 */
export const useCumulativeCode = (cellId: string) => {
  return useSelector((state: Rootstate) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);
    const showFunction = `
      import _React from 'react';
      import _ReactDOM from 'react-dom/client';
      
      var show = (value) => {
        const root = document.querySelector('#root');
        if (typeof value === 'object'){
          // check if object is a jsx element
          if(value.$$typeof && value.props){
            _ReactDOM.createRoot(root).render(value)
          } else {
            root.innerHTML = JSON.stringify(value);
          }
        } else {
          root.innerHTML = value;
        }
      }
      `;
    const showFuncNoop = 'var show = () =>{}';
    const cumulativeCode = [];

    // loop through ordered array and add the contenet of all the cells of type code to the array
    for (let c of orderedCells) {
      if (c.type === 'code') {
        // if current cell, give real show function
        if (c.id === cellId) {
          cumulativeCode.push(showFunction);
        } else {
          // if previous cell, give empty show function
          cumulativeCode.push(showFuncNoop);
        }
        cumulativeCode.push(c.content);
      }
      // exclude current cell
      if (c.id === cellId) {
        break;
      }
    }
    // return array of cumulative code contents
    return cumulativeCode;
  }).join('\n');
};
