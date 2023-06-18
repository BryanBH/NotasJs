import CellList from './components/CellList';

import { useEnhanchedDispatch } from './hooks';
import { useEffect } from 'react';
import { insertCellAfter } from './store/slices/cellsSlice';
import { updateCell } from './store/slices/cellsSlice';

function App() {
  // initial code/ text editor for testing purposes
  const [insertCell] = useEnhanchedDispatch(insertCellAfter);
  useEffect(() => {
    insertCell({ id: null, cellType: 'code' });
   
  }, []);

  return (
    <div>
      <CellList />
    </div>
  );
}

export default App;
