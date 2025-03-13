import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";

const ResultsPage = ({ filename, inputCols, outputCol }) => {
  const [results, setResults] = useState(null);
  const [bestModel, setBestModel] = useState(null);
  const [bestAccuracy, setBestAccuracy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const trainModel = async () => {
      try {
        setLoading(true);
        setError(null);
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await axios.post(`https://comparative-study-ml-backend.onrender.com/train`, {
          filename,
          input_cols: inputCols,
          output_col: outputCol,
        });

        if (response.data.results) {
          setResults(response.data.results);
          setBestModel(response.data.best_model);
          setBestAccuracy(response.data.best_accuracy);
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

  // Convert results to chart data format
  const chartData = results
    ? Object.entries(results).map(([model, metrics]) => ({
        name: model,
        accuracy: metrics.Accuracy !== undefined ? metrics.Accuracy : 0,
      }))
    : [];

  return (
    <div className="card p-4 shadow text-center mx-auto" style={{ maxWidth: "700px" }}>
      <h2>Model Accuracy</h2>

      {loading && <p className="text-center mt-3">Training models, please wait...</p>}

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      {results && !loading && (
        <>
          <table className="table table-bordered mt-3">
            <thead className="table-dark">
              <tr>
                <th>Model</th>
                <th>Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((data) => (
                <tr key={data.name} className={data.name === bestModel ? "table-success" : ""}>
                  <td>{data.name}</td>
                  <td>{data.accuracy}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Graph Section */}
          <div className="mt-4">
            <h4>Accuracy Comparison</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="accuracy" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {bestModel && (
            <div className="alert alert-info mt-3">
              <h4>Best Model: {bestModel}</h4>
              <p>Accuracy: {bestAccuracy}</p>
            </div>
          )}
        </>
      )}

      <button onClick={() => navigate("/")} className="btn btn-primary mt-3 w-100">
        Upload New File
      </button>
    </div>
  );
};

export default ResultsPage;
