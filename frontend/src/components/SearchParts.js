import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ApiService } from "../apiService";

function SearchParts() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("part_name");
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setHasSearched(true);
    setError(null);

    try {
      const results = await ApiService.searchParts(searchQuery, searchField);
      setSearchResults(results);
    } catch (err) {
      console.error("Error searching parts:", err);
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-parts">
      <h2>Search Parts</h2>

      <form onSubmit={handleSearch} className="search-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="searchField">Search in:</label>
            <select
              id="searchField"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
            >
              <option value="part_id">Part ID</option>
              <option value="part_name">Part Name</option>
              <option value="manufacturer">Manufacturer</option>
              <option value="quality_status">Quality Status</option>
              <option value="current_location">Location</option>
            </select>
          </div>

          <div className="form-group search-input">
            <label htmlFor="searchQuery">Search term:</label>
            <input
              type="text"
              id="searchQuery"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search term..."
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {error && <div className="error-message">Error: {error}</div>}

      {hasSearched && (
        <div className="search-results">
          <h3>Search Results</h3>

          {loading ? (
            <p>Searching...</p>
          ) : searchResults.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Manufacturer</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((part) => (
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
                      <Link to={`/parts/${part.part_id}`}>View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No parts found matching your search criteria.</p>
          )}
        </div>
      )}

      <div className="search-tips">
        <h4>Search Tips</h4>
        <ul>
          <li>Search for partial matches (e.g., "eng" will find "engine")</li>
          <li>Search by exact Part ID for precise lookup</li>
          <li>Use status search to find all "Passed" or "Failed" parts</li>
          <li>Search by location to see parts in specific areas</li>
        </ul>
      </div>
    </div>
  );
}

export default SearchParts;
