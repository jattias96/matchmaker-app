import React from 'react';
import { Link } from 'react-router-dom';

const OptionsPage: React.FC = () => {
  return (
    <div className="App">
      <h1>The Shadchan's Notebook</h1>
      <nav className="menu">
        <Link to="/" className="menu-link">Dashboard</Link>
        <Link to="/matches" className="menu-link">Matches</Link>
      </nav>
      <Link to="/add">Add Another Single</Link>
      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default OptionsPage;