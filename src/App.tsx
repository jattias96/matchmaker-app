import React, { useState, useEffect } from 'react';
import './App.css';

type Single = {
  id: number;
  name: string;
  occupation: string;
  religiousStatus: string;
  previouslyMarried: boolean;
  age: number;
  gender: string;
  notes: string;
};

function App() {
  const [singles, setSingles] = useState<Single[]>(() => {
    const saved = localStorage.getItem('singles');
    return saved ? JSON.parse(saved) : [];
  });
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [religiousStatus, setReligiousStatus] = useState('');
  const [previouslyMarried, setPreviouslyMarried] = useState(false);
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [notes, setNotes] = useState('');
  // Filter/Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [minAge, setMinAge] = useState<number | ''>('');
  const [maxAge, setMaxAge] = useState<number | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

  useEffect(() => {
    localStorage.setItem('singles', JSON.stringify(singles));
  }, [singles]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && occupation && religiousStatus && age && gender) {
      const newSingle: Single = {
        id: Date.now(),
        name,
        occupation,
        religiousStatus,
        previouslyMarried,
        age: Number(age),
        gender,
        notes,
      };
      setSingles([...singles, newSingle]);
      setName('');
      setOccupation('');
      setReligiousStatus('');
      setPreviouslyMarried(false);
      setAge('');
      setGender('');
      setNotes('');
    }
  };

  // Filter and sort logic
  const filteredSingles = singles
    .filter((single) => 
      single.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      <h1>Matchmaker App</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="text" placeholder="Occupation" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
        <input type="text" placeholder="Religious Status" value={religiousStatus} onChange={(e) => setReligiousStatus(e.target.value)} />
        <label>
          Previously Married:
          <input type="checkbox" checked={previouslyMarried} onChange={(e) => setPreviouslyMarried(e.target.checked)} />
        </label>
        <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit">Add Single</button>
      </form>
      <h2>Singles List</h2>
      <div>
        <input
          type="text"
          placeholder="Search by name or notes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterGender} onChange={(e) => setFilterGender(e.target.value)}>
          <option value="">All Genders</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="number"
          placeholder="Min Age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <input
          type="number"
          placeholder="Max Age"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}>
          <option value="">No Sort</option>
          <option value="asc">Sort Age Ascending</option>
          <option value="desc">Sort Age Descending</option>
        </select>
      </div>
      <ul>
        {filteredSingles.map((single) => (
          <li key={single.id}>
            {single.name}, {single.age}, {single.gender} - {single.occupation}, {single.religiousStatus}, 
            {single.previouslyMarried ? 'Previously Married' : 'Never Married'}, Notes: {single.notes}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;