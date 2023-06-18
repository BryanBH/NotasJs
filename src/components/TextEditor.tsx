import '../styles/textEditor.css';
import React, { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { Cell } from '../models';
import { useEnhanchedDispatch } from '../hooks';
import { updateCell } from '../store/slices/cellsSlice';

interface TextEditorProps {
  cell: Cell;
}

const TextEditor: React.FC<TextEditorProps> = ({ cell }) => {
  const [editing, setEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [updateCellContent] = useEnhanchedDispatch(updateCell);

  // Event listener to switch between editor and preview markdown
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        editorRef.current &&
        event.target &&
        editorRef.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };

    document.addEventListener('click', listener, { capture: true });

    return () => document.removeEventListener('click', listener);
  }, []);

  const handleChange = (value:  string ) => {
    updateCell({id: cell.id, content: value})
  }

  if (editing) {
    return (
      <div className='text-editor' ref={editorRef}>
        <MDEditor
          value={cell.content}
          onChange={(value) => {
            updateCellContent({id: cell.id, content: value || ''})
          }}
        />
      </div>
    );
  }

  return (
    <div className='text-editor card tcard' onClick={() => setEditing(true)}>
      <div className='card-content'>
        <MDEditor.Markdown source={cell.content} />
      </div>
    </div>
  );
};

export default TextEditor;
