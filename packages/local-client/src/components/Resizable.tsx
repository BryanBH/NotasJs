import React, { useState, useEffect } from 'react';
import '../styles/resizable.css';
import { ResizableBox, ResizableBoxProps } from 'react-resizable';

interface ResizableProps {
  direction: 'Horizontal' | 'Vertical';
  children: React.ReactNode;
}

/**
 * Resizable wrapper for cells
 * @param direction direction of resizable content
 * @returns
 */
const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
  // get window dimensions
  const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return { width, height };
  };

  const [windowDimension, setWindowDimension] = useState(getWindowDimensions());
  // width state for Horizontal direction
  const [width, setWidth] = useState(window.innerWidth * 0.75);

  // add event listener to recalculate the window dimensions
  useEffect(() => {
    let timer: any;
    const onResize = () => {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        setWindowDimension(getWindowDimensions());
        // reduce current width of code editor to avoid iframe dissapearing if window to empty
        if (window.innerWidth * 0.75 < width) {
          setWidth(window.innerWidth * 0.75);
        }
      }, 100);
    };
    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, [width]);

  let resizableProps: ResizableBoxProps;

  if (direction === 'Horizontal') {
    resizableProps = {
      className: 'resize-horizontal',
      width,
      height: Infinity,
      resizeHandles: ['e'],
      maxConstraints: [windowDimension.width * 0.75, Infinity],
      minConstraints: [windowDimension.width * 0.2, Infinity],
      onResizeStop: (event, data) => {
        setWidth(data.size.width);
      },
    };
  } else {
    resizableProps = {
      width: Infinity,
      height: 500,
      resizeHandles: ['s'],
      maxConstraints: [Infinity, windowDimension.height * 0.9],
      minConstraints: [Infinity, 50],
    };
  }

  return <ResizableBox {...resizableProps}>{children}</ResizableBox>;
};

export default Resizable;
