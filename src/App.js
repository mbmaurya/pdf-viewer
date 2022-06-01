import logo from "./logo.svg";
import "./App.css";
import PDFViewer from "./Components/pdf-viewer";
import DynamicElement from "./Components/dynamic_elements";

function App() {
  return (
    <div>
      <PDFViewer />
      <DynamicElement />
    </div>
  );
}

export default App;
