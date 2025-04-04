import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ApiService } from "../apiService";

function PartsList() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const data = await ApiService.getParts();
        setParts(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching parts:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchParts();
  }, []);

  if (loading) {
    return <div>Loading parts...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="parts-list">
      <h2>All Parts</h2>
      {parts.length === 0 ? (
        <p>
          No parts available. <Link to="/add">Add a new part</Link>.
        </p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Manufacturer</th>
              <th>Quality Status</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part) => (
              <tr key={part.part_id}>
                <td>{part.part_id}</td>
                <td>{part.part_name}</td>
                <td>{part.manufacturer}</td>
                <td>
                  <span
                    className={`status-badge ${part.quality_status.toLowerCase()}`}
                  >
                    {part.quality_status}
                  </span>
                </td>
                <td>{part.current_location}</td>
                <td>
                  <Link to={`/parts/${part.part_id}`}>Details</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PartsList;
