import '../styles/codeCell.css';
import { useEffect } from 'react';
import CodeEditor from './CodeEditor';
import Preview from './Preview';
import Resizable from './Resizable';
import { Cell } from '../models';
import { Rootstate, useAppDispatch } from '../store';
import { useEnhanchedDispatch } from '../hooks';
import { updateCell, createBundle } from '../store';
import { useSelector } from 'react-redux';
import { useCumulativeCode } from '../hooks/useCumulativeCode';

interface CodeCellProps {
  cell: Cell;
}

/**
 * Code cell component which handles the entire code bundle and transpile process
 * @param cell Code cell to be displayed
 * @returns
 */
const CodeCell: React.FC<CodeCellProps> = ({ cell }) => {
  const dispatch = useAppDispatch();
  const [updateCellContent] = useEnhanchedDispatch(updateCell);

  const bundle = useSelector((state: Rootstate) => state.bundle[cell.id]);
  const cumulativeCode = useCumulativeCode(cell.id);
  const handleChange = (value: any) => {
    // update cell action with new content
    updateCellContent({ id: cell.id, content: value });
  };

  // debouncing logic to bundle code if user types and stops typing for 1 second
  useEffect(() => {
    // initial bundling proccess
    if (!bundle) {
      dispatch(createBundle({ cellId: cell.id, input: cumulativeCode }));
      return;
    }

    const timer = setTimeout(async () => {
      // bundle code and update state every .75 seconds of innactivity
      dispatch(createBundle({ cellId: cell.id, input: cumulativeCode }));
    }, 750);
    return () => clearTimeout(timer);
  }, [cell.id, cumulativeCode, createBundle]);

  return (
    <Resizable direction='Vertical'>
      <div
        style={{
          height: 'calc(100% - 10px)',
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Resizable direction='Horizontal'>
          <CodeEditor initialValue={cell.content} onChange={handleChange} />
        </Resizable>
        <div className='progress-wrapper'>
          {!bundle || bundle.loading ? (
            <div className='progress-cover'>
              <progress className='progress is-normal is-primary' max='100'>
                Loading
              </progress>
            </div>
          ) : (
            <Preview code={bundle.code} err={bundle.err} />
          )}
        </div>
      </div>
    </Resizable>
  );
};

export default CodeCell;
