import '../styles/codeEditor.css';
import React, { useRef } from 'react';
import { Editor, OnChange } from '@monaco-editor/react';
import prettier from 'prettier';
import parser from 'prettier/parser-babel';

interface CodeEditorProps {
  initialValue: string;
  onChange: OnChange;
}

/**
 * Monaco code editor
 * @param initialValue Editor initial value
 * @returns
 */
const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  const handleEditorMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
  };

  const onFormatClick = () => {
    // get current value form editor
    const unformatted = editorRef.current.getValue();

    // format the value and remove the empty new line at the end of the code
    const formatted = prettier
      .format(unformatted, {
        parser: 'babel',
        plugins: [parser],
        semi: true,
        useTabs: false,
        bracketSameLine: true,
        singleQuote: true,
        jsxSingleQuote: true,
      })
      .replace(/\n$/, '');
    // set the format value back in the editor
    editorRef.current.setValue(formatted);
  };

  return (
    <div className='editor-wrapper'>
      <button
        className='button button-format is-primary is-small'
        onClick={onFormatClick}>
        Format
      </button>
      <Editor
        onMount={handleEditorMount}
        height='100%'
        language='javascript'
        theme='vs-dark'
        value={initialValue}
        onChange={onChange}
        options={{
          wordWrap: 'on',
          tabSize: 2,
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
