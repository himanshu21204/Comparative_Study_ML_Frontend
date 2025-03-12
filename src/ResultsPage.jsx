import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ResultsPage = ({ filename, inputCols, outputCol }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const trainModel = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.post("https://comparative-study-ml-backend.onrender.com/train", {
          filename,
          input_cols: inputCols,
          output_col: outputCol,
        });
        
        if (response.data.results) {
          setResults(response.data.results);
        } else {
          setError("No results received from the server.");
        }
      } catch (err) {
        setError("Error training models: " + (err.response?.data?.error || err.message));
      } finally {
        setLoading(false);
      }
    };

    if (filename && inputCols.length > 0 && outputCol) {
      trainModel();
    }
  }, [filename, inputCols, outputCol]);

  return (
    <div className="card p-4 shadow text-center mx-auto" style={{ maxWidth: "600px" }}>
      <h2>Model Accuracy</h2>

      {loading && <p className="text-center mt-3">Training models, please wait...</p>}

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {results && !loading && (
        <table className="table table-bordered mt-3">
          <thead className="table-dark">
            <tr>
              <th>Model</th>
              <th>Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(results).map(([model, metrics]) => (
              <tr key={model}>
                <td>{model}</td>
                <td>{metrics.Accuracy !== undefined ? metrics.Accuracy : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={() => navigate("/")} className="btn btn-primary mt-3 w-100">
        Upload New File
      </button>
    </div>
  );
};

export default ResultsPage;
