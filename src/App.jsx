import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UploadPage from "./UploadPage";
import SelectColumnsPage from "./SelectColumnsPage";
import ResultsPage from "./ResultsPage";
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
  const [columns, setColumns] = useState([]);
  const [filename, setFilename] = useState("");
  const [inputCols, setInputCols] = useState([]);
  const [outputCol, setOutputCol] = useState("");

  return (
    <Router>
      <div className="min-vw-100 d-flex justify-content-center align-items-center">
        <Routes>
          <Route
            path="/"
            element={<UploadPage setColumns={setColumns} setFilename={setFilename} />}
          />
          <Route
            path="/select-columns"
            element={
              <SelectColumnsPage
                columns={columns}
                setInputCols={setInputCols}
                setOutputCol={setOutputCol}
                filename={filename}
              />
            }
          />
          <Route
            path="/results"
            element={
              <ResultsPage filename={filename} inputCols={inputCols} outputCol={outputCol} />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;