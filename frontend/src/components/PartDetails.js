import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ApiService } from "../apiService";

function PartDetails() {
  const { partId } = useParams();
  const navigate = useNavigate();
  const [part, setPart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPart, setEditedPart] = useState(null);

  useEffect(() => {
    fetchPartDetails();
  }, [partId]);

  const fetchPartDetails = async () => {
    try {
      const data = await ApiService.getPartById(partId);
      setPart(data);
      setEditedPart(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching part details:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPart((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await ApiService.updatePart(partId, editedPart);
      setIsEditing(false);
      await fetchPartDetails();
      alert("Part updated successfully");
    } catch (err) {
      console.error("Error updating part:", err);
      setError(err.message);
      alert(`Failed to update part: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !part) {
    return <div>Loading part details...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!part) {
    return <div>Part not found</div>;
  }

  return (
    <div className="part-details">
      <h2>Part Details: {part.part_name}</h2>
      <div className="action-buttons">
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Part"}
        </button>
        <button onClick={() => navigate("/parts")}>Back to List</button>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Part Name:</label>
            <input
              type="text"
              name="part_name"
              value={editedPart.part_name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Manufacturer:</label>
            <input
              type="text"
              name="manufacturer"
              value={editedPart.manufacturer}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Production Date:</label>
            <input
              type="date"
              name="production_date"
              value={editedPart.production_date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Quality Status:</label>
            <select
              name="quality_status"
              value={editedPart.quality_status}
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
              value={editedPart.current_location}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      ) : (
        <div className="part-info">
          <table>
            <tbody>
              <tr>
                <th>Part ID:</th>
                <td>{part.part_id}</td>
              </tr>
              <tr>
                <th>Part Name:</th>
                <td>{part.part_name}</td>
              </tr>
              <tr>
                <th>Manufacturer:</th>
                <td>{part.manufacturer}</td>
              </tr>
              <tr>
                <th>Production Date:</th>
                <td>{part.production_date}</td>
              </tr>
              <tr>
                <th>Quality Status:</th>
                <td>
                  <span
                    className={`status-badge ${part.quality_status.toLowerCase()}`}
                  >
                    {part.quality_status}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Current Location:</th>
                <td>{part.current_location}</td>
              </tr>
              <tr>
                <th>Last Updated:</th>
                <td>{new Date(part.timestamp).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PartDetails;
