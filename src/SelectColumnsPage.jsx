import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const SelectColumnsPage = ({ columns, setInputCols, setOutputCol, filename }) => {
  const [selectedInputs, setSelectedInputs] = useState([]);
  const [selectedOutput, setSelectedOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle checkbox selection for input columns
  const handleCheckboxChange = (col) => {
    setSelectedInputs((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  // Handle training the model
  const handleTrainModel = () => {
    if (!filename) return alert("No file uploaded. Please go back and upload a file.");
    if (selectedInputs.length === 0) return alert("Please select at least one input column.");
    if (!selectedOutput) return alert("Please select an output column.");

    setIsLoading(true);
    setInputCols(selectedInputs);
    setOutputCol(selectedOutput);

    setTimeout(() => {
      navigate("/results");
    }, 1000); // Simulate a delay before navigation
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="card p-4 shadow-lg" style={{ width: "500px" }}>
        <h2 className="mb-4 text-center">Select Columns</h2>

        {/* Input Columns Section */}
        <div className="mb-4">
          <label className="form-label fw-bold">Input Columns:</label>
          <div className="d-flex flex-wrap gap-2">
            {columns.map((col) => (
              <div key={col} className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`input-${col}`}
                  value={col}
                  onChange={() => handleCheckboxChange(col)}
                  checked={selectedInputs.includes(col)}
                />
                <label className="form-check-label" htmlFor={`input-${col}`}>
                  {col}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Output Column Section */}
        <div className="mb-4">
          <label className="form-label fw-bold">Output Column:</label>
          <select
            className="form-select"
            value={selectedOutput}
            onChange={(e) => setSelectedOutput(e.target.value)}
          >
            <option value="">Select Output Column</option>
            {columns.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        </div>

        {/* Train Models Button */}
        <button onClick={handleTrainModel} className="btn btn-success w-100" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2"></span>
              Processing...
            </>
          ) : (
            "Train Models"
          )}
        </button>
      </div>
    </div>
  );
};

export default SelectColumnsPage;
