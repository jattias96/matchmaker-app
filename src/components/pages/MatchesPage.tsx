import React, { useState } from 'react';
import { Single, Match } from '../../types/types';
import { Link } from 'react-router-dom';

interface Props {
  singles: Single[];
  matches: Match[];
  onAddMatch: (match: Match) => void;
  onUpdateMatch: (match: Match) => void;
  onDeleteMatch: (id: number) => void;
}

const MatchesPage: React.FC<Props> = ({ singles, matches, onAddMatch, onUpdateMatch, onDeleteMatch }) => {
  const [single1Id, setSingle1Id] = useState<number | ''>('');
  const [single2Id, setSingle2Id] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchIndividual, setSearchIndividual] = useState('');

  const handleAddMatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (single1Id && single2Id && single1Id !== single2Id) {
      const newMatch: Match = {
        id: Date.now(),
        single1Id: Number(single1Id),
        single2Id: Number(single2Id),
        status: 'Idea',
        archived: false,
      };
      onAddMatch(newMatch);
      setSingle1Id('');
      setSingle2Id('');
    }
  };

  const filteredMatches = matches
    .filter((match) => (statusFilter ? match.status === statusFilter : true))
    .filter((match) => !match.archived)
    .filter((match) => {
      if (!searchIndividual) return true;
      const single1 = singles.find((s) => s.id === match.single1Id);
      const single2 = singles.find((s) => s.id === match.single2Id);
      return (
        `${single1?.firstName} ${single1?.lastName}`.toLowerCase().includes(searchIndividual.toLowerCase()) ||
        `${single2?.firstName} ${single2?.lastName}`.toLowerCase().includes(searchIndividual.toLowerCase())
      );
    });

  const archivedMatches = matches.filter((match) => match.archived);

  return (
    <div className="App">
      <h1>The Shadchan's Notebook</h1>
      <nav className="menu">
        <Link to="/" className="menu-link">Dashboard</Link>
        <Link to="/matches" className="menu-link">Matches</Link>
      </nav>
      <h2>Create a New Match</h2>
      <form onSubmit={handleAddMatch}>
        <select value={single1Id} onChange={(e) => setSingle1Id(Number(e.target.value))}>
          <option value="">Select First Single</option>
          {singles.map((single) => (
            <option key={single.id} value={single.id}>
              {single.firstName} {single.lastName} ({single.gender}, {single.age})
            </option>
          ))}
        </select>
        <select value={single2Id} onChange={(e) => setSingle2Id(Number(e.target.value))}>
          <option value="">Select Second Single</option>
          {singles.map((single) => (
            <option key={single.id} value={single.id}>
              {single.firstName} {single.lastName} ({single.gender}, {single.age})
            </option>
          ))}
        </select>
        <button type="submit">Add Match</button>
      </form>
      <h2>Current Matches</h2>
      <div>
        <input type="text" placeholder="Search by individual name" value={searchIndividual} onChange={(e) => setSearchIndividual(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Idea">Idea</option>
          <option value="Suggested">Suggested</option>
          <option value="Dating">Dating</option>
          <option value="Serious">Serious</option>
          <option value="Engaged">Engaged</option>
          <option value="Married">Married</option>
        </select>
      </div>
      <ul>
        {filteredMatches.map((match) => {
          const single1 = singles.find((s) => s.id === match.single1Id);
          const single2 = singles.find((s) => s.id === match.single2Id);
          return (
            <li key={match.id}>
              {single1?.firstName} {single1?.lastName} & {single2?.firstName} {single2?.lastName} - Status: {match.status}
              <div className="actions">
                <select
                  value={match.status}
                  onChange={(e) => onUpdateMatch({ ...match, status: e.target.value as Match['status'] })}
                >
                  <option value="Idea">Idea</option>
                  <option value="Suggested">Suggested</option>
                  <option value="Dating">Dating</option>
                  <option value="Serious">Serious</option>
                  <option value="Engaged">Engaged</option>
                  <option value="Married">Married</option>
                </select>
                <button onClick={() => onUpdateMatch({ ...match, archived: true })}>Archive</button>
                <button onClick={() => onDeleteMatch(match.id)} className="delete-button">Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
      <h2>Archived Matches</h2>
      <ul>
        {archivedMatches.map((match) => {
          const single1 = singles.find((s) => s.id === match.single1Id);
          const single2 = singles.find((s) => s.id === match.single2Id);
          return (
            <li key={match.id}>
              {single1?.firstName} {single1?.lastName} & {single2?.firstName} {single2?.lastName} - Status: {match.status}
              <div className="actions">
                <button onClick={() => onUpdateMatch({ ...match, archived: false })}>Restore</button>
                <button onClick={() => onDeleteMatch(match.id)} className="delete-button">Delete</button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MatchesPage;