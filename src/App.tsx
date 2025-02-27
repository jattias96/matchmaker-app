import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { Single, Match } from './types/types'; // Adjust the import path as needed
import { supabase } from './supabaseClient'; // Adjust the import path as needed
import Dashboard from './components/pages/Dashboard';
import AddSinglePage from './components/pages/AddSinglePage';
import EditSinglePage from './components/pages/EditSinglePage';
import OptionsPage from './components/pages/OptionsPage';
import MatchesPage from './components/pages/MatchesPage';

function App() {
  const [singles, setSingles] = useState<Single[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  const fetchData = async () => {
    try {
      const { data: singlesData, error: singlesError } = await supabase.from('singles').select('*');
      const { data: matchesData, error: matchesError } = await supabase.from('matches').select('*');
      if (singlesError) console.error('Singles fetch error:', singlesError);
      if (matchesError) console.error('Matches fetch error:', matchesError);
      console.log('Fetched singles:', singlesData);
      console.log('Fetched matches:', matchesData);
      setSingles(singlesData || []);
      setMatches(matchesData || []);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSingle = async (newSingle: Omit<Single, "id">) => {
    try {
      console.log('Attempting to insert single:', newSingle);
      const { data, error } = await supabase.from('singles').insert(newSingle).select();
      if (error) {
        console.error('Supabase insert error:', error.message, error.details, error.code);
        return;
      }
      if (data) {
        console.log('Inserted single:', data[0]); // Includes the auto-generated id
        await fetchData(); // Refresh data
      } else {
        console.warn('No data returned from insert');
      }
    } catch (error) {
      console.error('Unexpected error adding single:', error);
    }
  };

  const handleEditSingle = async (updatedSingle: Single) => {
    const { data, error } = await supabase
      .from('singles')
      .update(updatedSingle)
      .eq('id', updatedSingle.id)
      .select();
    if (data) setSingles((prev) => prev.map((s) => (s.id === updatedSingle.id ? data[0] : s)));
    if (error) console.error('Error editing single:', error);
  };

  const handleDeleteSingle = async (id: number) => {
    const { error } = await supabase.from('singles').delete().eq('id', id);
    if (!error) {
      setSingles((prev) => prev.filter((s) => s.id !== id));
      setMatches((prev) => prev.filter((m) => m.single1Id !== id && m.single2Id !== id));
    } else {
      console.error('Error deleting single:', error);
    }
  };

  const handleAddMatch = async (newMatch: Omit<Match, "id">) => {
    const { data, error } = await supabase.from('matches').insert(newMatch).select();
    if (data) setMatches((prev) => [...prev, data[0]]);
    if (error) console.error('Error adding match:', error);
  };

  const handleUpdateMatch = async (updatedMatch: Match) => {
    const { data, error } = await supabase
      .from('matches')
      .update(updatedMatch)
      .eq('id', updatedMatch.id)
      .select();
    if (data) setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? data[0] : m)));
    if (error) console.error('Error updating match:', error);
  };

  const handleDeleteMatch = async (id: number) => {
    const { error } = await supabase.from('matches').delete().eq('id', id);
    if (!error) setMatches((prev) => prev.filter((m) => m.id !== id));
    else console.error('Error deleting match:', error);
  };

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