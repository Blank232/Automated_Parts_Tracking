import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import "./App.css";
import PartsList from "./components/PartsList";
import AddPart from "./components/AddPart";
import PartDetails from "./components/PartDetails";
import Dashboard from "./components/Dashboard";
import SearchParts from "./components/SearchParts";

function NotFound() {
  return (
    <div className="not-found">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for doesn't exist.</p>
      <Link to="/" className="btn">
        Return to Dashboard
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Automotive Part Tracking System</h1>
          <nav>
            <ul>
              <li>
                <Link to="/">Dashboard</Link>
              </li>
              <li>
                <Link to="/parts">Parts List</Link>
              </li>
              <li>
                <Link to="/add">Add New Part</Link>
              </li>
              <li>
                <Link to="/search">Search</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/parts" element={<PartsList />} />
            <Route path="/parts/:partId" element={<PartDetails />} />
            <Route path="/add" element={<AddPart />} />
            <Route path="/search" element={<SearchParts />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" />} />
          </Routes>
        </main>
        <footer>
          <p>
            Automotive Part Tracking System &copy; {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
