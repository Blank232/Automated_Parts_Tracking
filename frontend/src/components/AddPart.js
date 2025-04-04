import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApiService } from "../apiService";

function AddPart() {
  const navigate = useNavigate();
  const [part, setPart] = useState({
    part_name: "",
    manufacturer: "",
    production_date: "",
    quality_status: "Pending",
    current_location: "Warehouse",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPart((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await ApiService.addPart(part);
      setLoading(false);
      if (response.success) {
        alert(`Part added successfully with ID: ${response.part_id}`);
        navigate("/parts");
      }
    } catch (err) {
      console.error("Error adding part:", err);
      setError(err.message);
      setLoading(false);
      alert(`Failed to add part: ${err.message}`);
    }
  };

  return (
    <div className="add-part">
      <h2>Add New Part</h2>
      {error && <div className="error-message">Error: {error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Part Name:</label>
          <input
            type="text"
            name="part_name"
            value={part.part_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Manufacturer:</label>
          <input
            type="text"
            name="manufacturer"
            value={part.manufacturer}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Production Date:</label>
          <input
            type="date"
            name="production_date"
            value={part.production_date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quality Status:</label>
          <select
            name="quality_status"
            value={part.quality_status}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
          </select>
        </div>
        <div className="form-group">
          <label>Current Location:</label>
          <input
            type="text"
            name="current_location"
            value={part.current_location}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Part"}
        </button>
      </form>
    </div>
  );
}

export default AddPart;
