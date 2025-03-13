import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const UploadPage = ({ setColumns, setFilename }) => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file first");

    setIsLoading(true);
    let formData = new FormData();
    formData.append("file", file);
    const API_URL = process.env.APP_API_URL;
    try {
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setColumns(response.data.columns);
      setFilename(file.name);
      navigate("/select-columns");
    } catch (error) {
      alert("Error uploading file: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-4 shadow-lg mx-auto" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Upload Your Dataset</h2>
      <input type="file" className="form-control mb-3" onChange={handleFileChange} />
      <button onClick={uploadFile} disabled={isLoading} className="btn btn-primary w-100">
        {isLoading ? (
          <>
            <span className="spinner-border spinner-border-sm me-2"></span>
            Uploading...
          </>
        ) : (
          "Upload File"
        )}
      </button>
    </div>
  );
};

export default UploadPage;
