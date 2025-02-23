import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from 'react-router-dom';
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

type Match = {
  id: number;
  single1Id: number;
  single2Id: number;
  status: 'Idea' | 'Suggested' | 'Dating' | 'Serious' | 'Engaged' | 'Married';
  archived: boolean;
};

// Dashboard (Main List Page)
const Dashboard: React.FC<{ singles: Single[]; onDelete: (id: number) => void }> = ({ singles, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [minAge, setMinAge] = useState<number | ''>('');
  const [maxAge, setMaxAge] = useState<number | ''>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | ''>('');

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
            {single.name}, {single.age}, {single.gender} - {single.occupation}, {single.religiousStatus}, 
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

// Add Single Page
const AddSinglePage: React.FC<{ onAdd: (single: Single) => void }> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [religiousStatus, setReligiousStatus] = useState('');
  const [previouslyMarried, setPreviouslyMarried] = useState(false);
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

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
      onAdd(newSingle);
      setName('');
      setOccupation('');
      setReligiousStatus('');
      setPreviouslyMarried(false);
      setAge('');
      setGender('');
      setNotes('');
      navigate('/options');
    }
  };

  return (
    <div className="App">
      <h1>The Shadchan's Notebook</h1>
      <nav className="menu">
        <Link to="/" className="menu-link">Dashboard</Link>
        <Link to="/matches" className="menu-link">Matches</Link>
      </nav>
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
        </select>
        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

// Edit Single Page
const EditSinglePage: React.FC<{ singles: Single[]; onEdit: (updatedSingle: Single) => void }> = ({ singles, onEdit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const single = singles.find((s) => s.id === Number(id));

  const [name, setName] = useState(single?.name || '');
  const [occupation, setOccupation] = useState(single?.occupation || '');
  const [religiousStatus, setReligiousStatus] = useState(single?.religiousStatus || '');
  const [previouslyMarried, setPreviouslyMarried] = useState(single?.previouslyMarried || false);
  const [age, setAge] = useState<number | ''>(single?.age || '');
  const [gender, setGender] = useState(single?.gender || '');
  const [notes, setNotes] = useState(single?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && occupation && religiousStatus && age && gender && id) {
      const updatedSingle: Single = {
        id: Number(id),
        name,
        occupation,
        religiousStatus,
        previouslyMarried,
        age: Number(age),
        gender,
        notes,
      };
      onEdit(updatedSingle);
      navigate('/');
    }
  };

  if (!single) return <div>Single not found</div>;

  return (
    <div className="App">
      <h1>The Shadchan's Notebook</h1>
      <nav className="menu">
        <Link to="/" className="menu-link">Dashboard</Link>
        <Link to="/matches" className="menu-link">Matches</Link>
      </nav>
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
        </select>
        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

// Options Page
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

// Matches Page
const MatchesPage: React.FC<{
  singles: Single[];
  matches: Match[];
  onAddMatch: (match: Match) => void;
  onUpdateMatch: (match: Match) => void;
  onDeleteMatch: (id: number) => void;
}> = ({ singles, matches, onAddMatch, onUpdateMatch, onDeleteMatch }) => {
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
        single1?.name.toLowerCase().includes(searchIndividual.toLowerCase()) ||
        single2?.name.toLowerCase().includes(searchIndividual.toLowerCase())
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
              {single.name} ({single.gender}, {single.age})
            </option>
          ))}
        </select>
        <select value={single2Id} onChange={(e) => setSingle2Id(Number(e.target.value))}>
          <option value="">Select Second Single</option>
          {singles.map((single) => (
            <option key={single.id} value={single.id}>
              {single.name} ({single.gender}, {single.age})
            </option>
          ))}
        </select>
        <button type="submit">Add Match</button>
      </form>
      <h2>Current Matches</h2>
      <div>
        <input
          type="text"
          placeholder="Search by individual name"
          value={searchIndividual}
          onChange={(e) => setSearchIndividual(e.target.value)}
        />
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
              {single1?.name} & {single2?.name} - Status: {match.status}
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
              {single1?.name} & {single2?.name} - Status: {match.status}
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

// Main App Component
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

  const handleAddSingle = (newSingle: Single) => {
    setSingles((prev) => [...prev, newSingle]);
  };

  const handleEditSingle = (updatedSingle: Single) => {
    setSingles((prev) => prev.map((s) => (s.id === updatedSingle.id ? updatedSingle : s)));
  };

  const handleDeleteSingle = (id: number) => {
    setSingles((prev) => prev.filter((s) => s.id !== id));
    setMatches((prev) => prev.filter((m) => m.single1Id !== id && m.single2Id !== id));
  };

  const handleAddMatch = (newMatch: Match) => {
    setMatches((prev) => [...prev, newMatch]);
  };

  const handleUpdateMatch = (updatedMatch: Match) => {
    setMatches((prev) => prev.map((m) => (m.id === updatedMatch.id ? updatedMatch : m)));
  };

  const handleDeleteMatch = (id: number) => {
    setMatches((prev) => prev.filter((m) => m.id !== id));
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