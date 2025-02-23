import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Single, Match } from './types';
import Dashboard from './components/Dashboard';
import AddSinglePage from './components/AddSinglePage';
import EditSinglePage from './components/EditSinglePage';
import OptionsPage from './components/OptionsPage';
import MatchesPage from './components/MatchesPage';

function App() {
  const [singles, setSingles] = useState<Single[]>(() => {
    const saved = localStorage.getItem('singles');
    return saved ? JSON.parse(saved) : [];
  });
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('matches');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('singles', JSON.stringify(singles));
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [singles, matches]);

  const handleAddSingle = (newSingle: Single) => setSingles((prev) => [...prev, newSingle]);
  const handleEditSingle = (updatedSingle: Single) => setSingles((prev) => prev.map((s) => (s.id === updatedSingle.id ? updatedSingle : s)));
  const handleDeleteSingle = (id: number) => {
    setSingles((prev) => prev.filter((s) => s.id !== id));
    setMatches((prev) => prev.filter((m) => m.single1Id !== id && m.single2Id !== id));
  };
  const handleAddMatch = (newMatch: Match) => setMatches((prev) => [...prev, newMatch]);
  const handleUpdateMatch = (updatedMatch: Match) => setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)));
  const handleDeleteMatch = (id: number) => setMatches((prev) => prev.filter((m) => m.id !== id));

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard singles={singles} onDelete={handleDeleteSingle} />} />
        <Route path="/add" element={<AddSinglePage onAdd={handleAddSingle} />} />
        <Route path="/options" element={<OptionsPage />} />
        <Route path="/edit/:id" element={<EditSinglePage singles={singles} onEdit={handleEditSingle} />} />
        <Route
          path="/matches"
          element={
            <MatchesPage
              singles={singles}
              matches={matches}
              onAddMatch={handleAddMatch}
              onUpdateMatch={handleUpdateMatch}
              onDeleteMatch={handleDeleteMatch}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;