import React, { useEffect, useRef, useState } from "react";

// import PDF
import DogNutrition from "../Docs/dog_nutrition_final_fix.pdf";

// import pdfjd library
import * as pdfjsLib from "../../node_modules/pdfjs-dist/build/pdf";

// import pdfjs worker to manage CPU intensive tasks
import * as pdfjsWorker from "../../node_modules/pdfjs-dist/build/pdf.worker.entry";

// assgin the worker to pdfjs library
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFViewer = () => {
  const pdfContainer = useRef();

  // stores number of items based on which number of canvas elements needs to be created
  const [canvasElms, setCanvasElms] = useState([]);

  // stores and array of numbers to concat with canvaElms state
  let numPageArr = [];

  // stores the result of concatination of canvasElms and numPageArr
  let nElemArr = [];

  // state to store number of pages in a pdf document
  const [numPages, setNumPages] = useState(0);

  // state to store the pdf document
  const [pdfDoc, setPdfDoc] = useState([]);

  // height of a page
  const [pageHeight, setPageHeight] = useState(0);

  // function to create canvas elements
  const createElement = (numPages) => {
    for (let i = 1; i <= numPages; i++) {
      numPageArr.push(i);
    }
    nElemArr = canvasElms.concat(numPageArr);
    setCanvasElms(nElemArr);
  };

  // loads the document and updates the variables
  const loadDocument = () => {
    let loadingTask = pdfjsLib.getDocument(DogNutrition);
    loadingTask.promise.then((doc) => {
      setNumPages(doc.numPages);
      createElement(doc.numPages);
      setPdfDoc(doc);
    });
  };

  const getPageHeight = () => {
    pdfDoc.getPage(1).then((page) => {
      let viewport = page.getViewport({ scale: 1.5 });
      setPageHeight(Math.floor(viewport.height));
    });
  };

  // prints pages of the pdf document
  const printPages = () => {
    getPageHeight();
    for (let i = 1; i <= numPages; i++) {
      pdfDoc.getPage(i).then((page) => {
        let scale = 1.5; // width and height
        let viewport = page.getViewport({ scale: scale }); // gets the width and height of the page and scales it
        let canvas = document.getElementById(i); // gets the respective canvas element
        let context = canvas.getContext("2d"); // gets the context of the canvas element
        canvas.width = Math.floor(viewport.width); // calculates the width and assigns to the canvas
        canvas.height = Math.floor(viewport.height); // calculates the height and assigns to the canvas

        // information needed while rendeing the page
        let renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        // renders the page on screen based on the data provided by the argument
        page.render(renderContext);
      });
    }
  };

  const prevScrollY = useRef(0);
  const [scrollUp, setScrollUp] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  let pageContainer = document.getElementById("pdf_container");
  const documentHeight = pageHeight * numPages;
  const [pageCounter, setPageCounter] = useState(1);
  const [tempPageHeight, setTempPageHeight] = useState(0);

  const [lowerSide, setLowerSide] = useState(0);
  const [upperSide, setUpperSide] = useState(0);

  useEffect(() => {
    setTempPageHeight(pageHeight * pageCounter);
    setLowerSide(pageHeight * pageCounter - pageHeight);
    const handleScroll = () => {
      const currentScrollY = pageContainer.scrollTop;
      if (prevScrollY.current < currentScrollY && scrollUp) {
        setScrollUp(false);
      }
      if (prevScrollY.current > currentScrollY && !scrollUp) {
        setScrollUp(true);
      }

      prevScrollY.current = currentScrollY;

      if (prevScrollY.current > tempPageHeight && !scrollUp) {
        setPageCounter((preValue) => preValue + 1);
      }

      if (
        prevScrollY.current < pageHeight * pageCounter - pageHeight &&
        scrollUp
      ) {
        setPageCounter((preValue) => preValue - 1);
      }

      console.log("Page counter: " + pageCounter);
    };

    if (pageContainer == null) {
      return;
    } else {
      pageContainer.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => pageContainer.removeEventListener("scroll", handleScroll);
  }, [
    scrollUp,
    pageContainer,
    currentPage,
    documentHeight,
    numPages,
    pageCounter,
    tempPageHeight,
    pageHeight,
    lowerSide,
  ]);

  // listens to changes
  useEffect(() => {}, [
    canvasElms,
    pdfDoc,
    numPages,
    pageHeight,
    tempPageHeight,
  ]);

  // calls to load and print functions
  const printDocument = async () => {
    loadDocument();
    printPages();
  };

  return (
    <>
      <h1>PDF Viewer</h1>

      <button onClick={loadDocument}>Load Document</button>
      <button onClick={printPages}>Print Document</button>
      <p>
        <span>{pageCounter}</span>
        <span>of </span>
        <span>{numPages}</span>
      </p>
      <div ref={pdfContainer} className="pdf-container" id="pdf_container">
        {canvasElms.map((item) => (
          <canvas id={item}></canvas>
        ))}
      </div>
    </>
  );
};

export default PDFViewer;
