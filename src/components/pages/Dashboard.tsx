import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Single } from '../../types/types';

interface Props {
  singles: Single[];
  onDelete: (id: number) => void;
}

const Dashboard: React.FC<Props> = ({ singles, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [minAge, setMinAge] = useState<number | ''>('');
  const [maxAge, setMaxAge] = useState<number | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  const filteredSingles = singles
    .filter((single) => 
      `${single.firstName} ${single.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      single.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((single) => (filterGender ? single.gender === filterGender : true))
    .filter((single) => (minAge !== '' ? single.age >= minAge : true))
    .filter((single) => (maxAge !== '' ? single.age <= maxAge : true))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.age - b.age;
      if (sortOrder === 'desc') return b.age - a.age;
      return 0;
    });

  return (
    <div className="App">
      <h1>The Shadchan's Notebook</h1>
      <nav className="menu">
        <Link to="/" className="menu-link">Dashboard</Link>
        <Link to="/matches" className="menu-link">Matches</Link>
      </nav>
      <Link to="/add" className="add-button">Add Single</Link>
      <div>
        <input type="text" placeholder="Search by name or notes" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input type="number" placeholder="Min Age" value={minAge} onChange={(e) => setMinAge(e.target.value === '' ? '' : Number(e.target.value))} />
        <input type="number" placeholder="Max Age" value={maxAge} onChange={(e) => setMaxAge(e.target.value === '' ? '' : Number(e.target.value))} />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}>
          <option value="">No Sort</option>
          <option value="asc">Sort Age Ascending</option>
          <option value="desc">Sort Age Descending</option>
        </select>
      </div>
      <h2>Singles List</h2>
      <ul>
        {filteredSingles.map((single) => (
          <li key={single.id}>
            {single.firstName} {single.lastName}, {single.age}, {single.gender} - {single.occupation}, {single.religiousStatus}, 
            {single.previouslyMarried ? 'Previously Married' : 'Never Married'}, Notes: {single.notes}
            <div className="actions">
              <Link to={`/edit/${single.id}`} className="edit-button">Edit</Link>
              <button onClick={() => onDelete(single.id)} className="delete-button">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;