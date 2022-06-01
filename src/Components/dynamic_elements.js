/**
 * Run a loop n number of times
 * Create an elements on every iteration
 * Add the element to the ref div
 */

import React, { useRef, useState } from "react";

const DynamicElement = () => {
  const containerRef = useRef();
  const [elmArray, setElemArray] = useState([]);

  const createElement = () => {
    let nItem = [2, 3, 5];
    let itemArr = elmArray.concat(nItem);
    setElemArray(itemArr);
  };
  return (
    <>
      <h3>Dynamic Elements</h3>
      <button onClick={createElement}>Create Elements</button>
      <div ref={containerRef}>
        {elmArray.map((ids) => (
          <canvas id={ids}></canvas>
        ))}
      </div>
    </>
  );
};

export default DynamicElement;
