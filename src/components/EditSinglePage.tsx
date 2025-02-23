import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Single } from '../types';
import { Link } from 'react-router-dom';

interface Props {
  singles: Single[];
  onEdit: (updatedSingle: Single) => void;
}

const EditSinglePage: React.FC<Props> = ({ singles, onEdit }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const single = singles.find((s) => s.id === Number(id));

  const [firstName, setFirstName] = useState(single?.firstName || '');
  const [lastName, setLastName] = useState(single?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState(single?.dateOfBirth || '');
  const [email, setEmail] = useState(single?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(single?.phoneNumber || '');
  const [occupation, setOccupation] = useState(single?.occupation || '');
  const [notes, setNotes] = useState(single?.notes || '');
  const [aliyaPreference, setAliyaPreference] = useState(single?.aliyaPreference || '');
  const [location, setLocation] = useState(single?.location || '');
  const [religiousStatus, setReligiousStatus] = useState(single?.religiousStatus || '');
  const [spousePreferences, setSpousePreferences] = useState(single?.spousePreferences || '');
  const [height, setHeight] = useState(single?.height || '');
  const [previouslyMarried, setPreviouslyMarried] = useState(single?.previouslyMarried || false);
  const [hasChildren, setHasChildren] = useState(single?.hasChildren || false);
  const [currentRelationshipStatus, setCurrentRelationshipStatus] = useState(single?.currentRelationshipStatus || '');
  const [age, setAge] = useState<number | ''>(single?.age || '');
  const [gender, setGender] = useState(single?.gender || '');

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && dateOfBirth && email && phoneNumber && occupation && religiousStatus && age && gender && id) {
      const updatedSingle: Single = {
        id: Number(id),
        firstName,
        lastName,
        dateOfBirth,
        email,
        phoneNumber,
        occupation,
        notes,
        aliyaPreference,
        location,
        religiousStatus,
        spousePreferences,
        height,
        previouslyMarried,
        hasChildren,
        currentRelationshipStatus,
        age: dateOfBirth ? calculateAge(dateOfBirth) : Number(age),
        gender,
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
        <div className="form-group">
          <label>First Name</label>
          <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Occupation</label>
          <input type="text" value={occupation} onChange={(e) => setOccupation(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Aliya Preference</label>
          <input type="text" value={aliyaPreference} onChange={(e) => setAliyaPreference(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Religious Status</label>
          <input type="text" value={religiousStatus} onChange={(e) => setReligiousStatus(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Spouse Preferences</label>
          <input type="text" value={spousePreferences} onChange={(e) => setSpousePreferences(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Height</label>
          <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 5ft10in or 170cm" />
        </div>
        <div className="form-group">
          <label>Previously Married</label>
          <input type="checkbox" checked={previouslyMarried} onChange={(e) => setPreviouslyMarried(e.target.checked)} />
        </div>
        <div className="form-group">
          <label>Has Children</label>
          <input type="checkbox" checked={hasChildren} onChange={(e) => setHasChildren(e.target.checked)} />
        </div>
        <div className="form-group">
          <label>Current Relationship Status</label>
          <input type="text" value={currentRelationshipStatus} onChange={(e) => setCurrentRelationshipStatus(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" value={age} onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))} />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditSinglePage;