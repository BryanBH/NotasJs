import React, { useEffect, useRef } from 'react';
import '../styles/preview.css';
interface PreviewProps {
  // bundled code
  code: string;
  // empty string if bundle was successful, otherwise a string with the specific error
  err: string;
}

/**
 * method to assign bundled code display to the iframe
 * Also handles errors to be displayed on screen
 */
const html = `
    <html>
      <head></head>
      <body>
        <div id='root'></div>
        <script>
        const handleError = (err) =>{
          const root = document.querySelector("#root"); 
          root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>'
          console.error(err);
        }
        window.addEventListener('error', (event) => {
          event.preventDefault();
          handleError(event.error);
        })

        // event listening for parent message with bundled code
          window.addEventListener('message', (event) => {
            // run that code
            try{
              eval(event.data)
            } catch(err){
              handleError(err)
            }
          },false)
        </script>
      </body>
    </html>
  `;

/**
 *
 * @param code bundled code to be displayed
 * @param err code errors to be displayed
 * @returns
 */
const Preview: React.FC<PreviewProps> = ({ code, err }) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, '*');
    }, 50);
  }, [code]);

  return (
    <div className='preview-wrapper'>
      <iframe
        title='Code Preview'
        ref={iframe}
        sandbox='allow-scripts'
        srcDoc={html}
      />
      {err && (
        <div className='preview-error'>
          <h4>Compile Error</h4>
          {err}
        </div>
      )}
    </div>
  );
};

export default Preview;
