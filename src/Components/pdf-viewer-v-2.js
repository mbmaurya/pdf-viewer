import React, { createRef, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
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
  const refs = useRef([]);
  const [canvasElms, setCanvasElms] = useState([]);
  const elements = [];
  const refArray = [];

  // const createRefs = (arr) => {
  //   const refElements = useRef(arr.map(() => createRef()));
  //   return refElements;
  // };
  const refElements = useRef(refArray.map(() => createRef()));
  useEffect(() => {
    // CreateRefs(refArray);
    console.log("Use effect run");
  });

  // const createCanvasElms = new Promise((resolve, reject, numOfPages) => {
  //   for (let i = 1; i <= numOfPages; i++) {
  //         elements.push(<canvas key={`page-${i}`} id={`page-${i}`}></canvas>);
  //       }
  //       return elements;
  // })

  const createCanvasElms = async (numOfPages) => {
    for (let i = 1; i <= numOfPages; i++) {
      elements.push(<canvas key={`page-${i}`} id={`page-${i}`}></canvas>);
      // console.log(`Pushed Canvas element with id page-${i} to elements array`);
    }

    return elements;
  };

  const addCanvasToDom = async (rootElm, canvasElms) => {
    // canvasElms.map((el) => {
    //   rootElm.render(el);
    //   return el;
    // });
    rootElm.render(
      canvasElms.map((el) => {
        // console.log(`Added ${el} to dom`);
        // console.log({ el });
        return el;
      })
    );
  };

  const printPages = (numOfPages, doc) => {
    for (let i = 1; i < numOfPages; i++) {
      doc.getPage(i).then((page) => {
        let scale = 1;
        let viewport = page.getViewport({ scale: scale });
        let outputScale = window.devicePixelRatio || 1;

        let canvas = elements[i].current;
        console.log(elements[i].ref);
        // let context = canvas.getContext("2d");
        // canvas.width = Math.floor(viewport.width * outputScale);
        // canvas.height = Math.floor(viewport.height * outputScale);
        // canvas.style.width = Math.floor(viewport.width) + "px";
        // canvas.style.height = Math.floor(viewport.height) + "px";

        // let transform =
        //   outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

        // let renderContext = {
        //   canvasContext: context,
        //   transform: transform,
        //   viewport: viewport,
        // };
        // page.render(renderContext);
      });
    }
  };

  const loadDocument = async () => {
    let loadingTask = pdfjsLib.getDocument(DogNutrition);
    let root = ReactDOM.createRoot(pdfContainerRef.current);

    loadingTask.promise
      .then(async (doc) => {
        const numPages = doc.numPages;
        for (let i = 1; i <= numPages; i++) {
          refArray.push(`page-${i}`);
        }
        console.log(refArray);

        console.log(refElements);
        // const refElements = CreateRefs(refArray);
        // for (let i = 1; i <= numPages; i++) {
        //   elements.push(
        //     <canvas ref={refElements.current[i]} id={`page-${i}`}></canvas>
        //   );
        // }
        // let canvasElement = <canvas id="random" ref={refElements[0]} />;
        // root.render(elements);
        // printPages(numPages, doc);
      })

      // for (let i = 1; i <= numPages; i++) {
      //   elements.push(<canvas id={`page-${i}`}></canvas>);
      // }

      // .then(addCanvasToDom(root, elements))
      // .then(printPages(numPages, doc));
      // createCanvasElms(numPages);
      // addCanvasToDom(root, elements);
      // for (let i = 1; i <= numPages; i++) {
      //   doc.getPage(i).then(function (page) {
      //     var scale = 1.5;
      //     var viewport = page.getViewport({ scale: scale });
      //     var outputScale = window.devicePixelRatio || 1;

      //     var canvas = document.getElementById(`page-${i}`);
      //     console.log(canvas);
      //     var context = canvas.getContext("2d");

      //     canvas.width = Math.floor(viewport.width * outputScale);
      //     canvas.height = Math.floor(viewport.height * outputScale);
      //     canvas.style.width = Math.floor(viewport.width) + "px";
      //     canvas.style.height = Math.floor(viewport.height) + "px";

      //     var transform =
      //       outputScale !== 1 ? [outputScale, 0, 0, outputScale, 0, 0] : null;

      //     var renderContext = {
      //       canvasContext: context,
      //       transform: transform,
      //       viewport: viewport,
      //     };
      //     page.render(renderContext);
      //     console.log(page);
      //   });
      // }

      // console.log("# Document loaded");
      // console.log("Number of pages: " + numPages);
      // console.log();
      // let lastPromise;
      // lastPromise = doc.getMetadata().then((data) => {
      //   console.log("# Metadata is Loaded");
      //   console.log("## Info");
      //   console.log(JSON.stringify(data.info, null, 2));
      //   console.log();
      //   if (data.metadata) {
      //     console.log("## Metadata");
      //     console.log(JSON.stringify(data.metadata.getAll(), null, 2));
      //     console.log();
      //   }
      // });
      // const loadPage = (pageNum) => {
      //   return doc
      //     .getPage(pageNum)
      //     .then((page) => {
      //       console.log("# Page " + pageNum);
      //       const viewport = page.getViewport({ scale: 1.0 });
      //       console.log("Size: " + viewport.width + "x" + viewport.height);
      //       console.log();
      //       // let newCanvas = React.createElement("canvas", {
      //       //   width: viewport.width,
      //       //   height: viewport.height,
      //       //   id: `page-${pageNum}`,
      //       // });
      //       // setCanvasElms(canvasElms.unshift(newCanvas));
      //       // console.log(canvasElms);
      //       // newCanvas.setAttribute("id", `page-${pageNum}`);
      //       // pdfContainerRef.current.appendChild(newCanvas);
      //       // newCanvas.height = viewport.height;
      //       // newCanvas.width = viewport.width;
      //       // let canvasElm = canvasElms[pageNum - 1];
      //       // console.log(canvasElm);
      //       // let context = canvasElm.getContext("2d");
      //       // newCanvas.current.width = Math.floor(viewport.width);
      //       // newCanvas.current.height = Math.floor(viewport.height);
      //       // console.log(pdfContainerRef.current);
      //       // const root = ReactDOM.createRoot(
      //       //   document.getElementById("page_container")
      //       // );
      //       // const newCanvas = (
      //       //   <canvas
      //       //     width={viewport.width}
      //       //     height={viewport.height}
      //       //     id={`page-${pageNum}`}
      //       //   ></canvas>
      //       // );
      //       // root.render(newCanvas);
      //       // console.log(newCanvas);
      //       createCanvasElms(numPages, viewport.width, viewport.height);
      //       const root = ReactDOM.createRoot(pdfContainerRef.current);
      //       addCanvasToDom(root, elements);
      //       console.log(document.getElementById(`page-${pageNum}`));
      //       const context = document
      //         .getElementById(`page-${pageNum}`)
      //         .getContext("2d");
      //       let renderContext = {
      //         canvasContext: context,
      //         viewport: viewport,
      //       };
      //       page.render(renderContext);
      //       return page.getTextContent().then((content) => {
      //         const strings = content.items.map((item) => {
      //           return item.str;
      //         });
      //         console.log("## Text Content");
      //         console.log(strings.join(" "));
      //         page.cleanup();
      //       });
      //     })
      //     .then(() => {
      //       console.log();
      //     });
      // };
      // for (let i = 1; i <= numPages; i++) {
      //   lastPromise = lastPromise.then(loadPage.bind(null, i));
      // }
      // return lastPromise;

      .then(
        () => {
          console.log("# End of Document");
          console.log(document.getElementById("page-1"));
        },
        (err) => {
          console.error("Error: " + err);
        }
      );
  };

  return (
    <>
      <h1>PDF Viewer</h1>
      <button onClick={loadDocument}>Load Document</button>
      {/* <canvas ref={pdfContainerRef}></canvas> */}
      <div ref={pdfContainerRef} id="page_container"></div>

      <canvas id="the-canvas"></canvas>
    </>
  );
};

export default PDFViewer;
