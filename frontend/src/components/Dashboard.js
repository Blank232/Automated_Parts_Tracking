import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ApiService } from "../apiService";

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [recentParts, setRecentParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch summary data
        const summaryData = await ApiService.getSummary();
        setSummary(summaryData);

        // Fetch parts for recent parts list
        const partsData = await ApiService.getParts();
        // Sort by timestamp to get the most recent parts
        const sorted = [...partsData].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setRecentParts(sorted.slice(0, 5)); // Get top 5 most recent

        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Parts</h3>
          <div className="stat-value">{summary?.total_parts || 0}</div>
        </div>

        <div className="stat-card">
          <h3>Manufacturers</h3>
          <div className="stat-value">
            {summary?.manufacturers?.length || 0}
          </div>
        </div>

        <div className="stat-card">
          <h3>QC Passed</h3>
          <div className="stat-value">
            {summary?.quality_status?.Passed || 0}
          </div>
        </div>

        <div className="stat-card">
          <h3>QC Failed</h3>
          <div className="stat-value">
            {summary?.quality_status?.Failed || 0}
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h3>Recent Parts</h3>
        {recentParts.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Status</th>
                <th>Added</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentParts.map((part) => (
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
                  <td>{new Date(part.timestamp).toLocaleString()}</td>
                  <td>
                    <Link to={`/parts/${part.part_id}`}>Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>
            No parts in the system yet.{" "}
            <Link to="/add">Add your first part</Link>.
          </p>
        )}
      </div>

      <div className="dashboard-section">
        <h3>Manufacturer Distribution</h3>
        {summary?.manufacturers && summary.manufacturers.length > 0 ? (
          <div className="manufacturer-list">
            <ul>
              {summary.manufacturers.map((mfr, index) => (
                <li key={index}>{mfr}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No manufacturer data available.</p>
        )}
      </div>

      <div className="dashboard-actions">
        <Link to="/add" className="btn">
          Add New Part
        </Link>
        <Link to="/parts" className="btn">
          View All Parts
        </Link>
        <Link to="/search" className="btn">
          Search Parts
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;
