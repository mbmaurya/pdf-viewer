import React, { useRef, useState } from "react";
import { useLocation } from "react-router-dom";

// import PDF
import DogNutrition from "../Docs/dog_nutrition_final_fix.pdf";

// import pdfjd library
import * as pdfjsLib from "../../node_modules/pdfjs-dist/build/pdf";

// import pdfjs worker to manage CPU intensive tasks
import * as pdfjsWorker from "../../node_modules/pdfjs-dist/build/pdf.worker.entry";

// assgin the worker to pdfjs library
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer = () => {
  const pdfContainerRef = useRef(null);
  const [canvasElms, setCanvasElms] = useState([]);
  const loadDocument = () => {
    let loadingTask = pdfjsLib.getDocument(DogNutrition);
    loadingTask.promise.then((doc) => {
      const numPages = doc.numPages;
      doc.getPage(1).then((page) => {
        let scale = 1.5;
        let viewport = page.getViewport({ scale: scale });
        console.log(viewport.width);
        console.log(viewport.height);
        let outputScale = window.devicePixelRatio || 1;
        let context = pdfContainerRef.current.getContext("2d");
        pdfContainerRef.current.width = Math.floor(viewport.width);
        pdfContainerRef.current.height = Math.floor(viewport.height);

        let transform =
          outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        let renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        page.render(renderContext);
      });
    });
  };

  return (
    <>
      <h1>PDF Viewer</h1>
      <button onClick={loadDocument}>Load Document</button>
      <canvas ref={pdfContainerRef}>{canvasElms}</canvas>
    </>
  );
};

export default PDFViewer;
