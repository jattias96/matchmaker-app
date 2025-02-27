import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Single } from '../../types/types'; // Adjust the import path as needed

interface Props {
  onAdd: (single: Omit<Single, "id">) => void;
}

const AddSinglePage: React.FC<Props> = ({ onAdd }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [occupation, setOccupation] = useState('');
  const [notes, setNotes] = useState('');
  const [aliyaPreference, setAliyaPreference] = useState('');
  const [location, setLocation] = useState('');
  const [religiousStatus, setReligiousStatus] = useState('');
  const [spousePreferences, setSpousePreferences] = useState('');
  const [height, setHeight] = useState('');
  const [previouslyMarried, setPreviouslyMarried] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [currentRelationshipStatus, setCurrentRelationshipStatus] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName && lastName && dateOfBirth && email && phoneNumber && occupation && religiousStatus && age && gender) {
      const newSingle: Omit<Single, "id"> = {
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
      console.log('Adding single:', newSingle);
      await onAdd(newSingle);
      // Reset form fields
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setEmail('');
      setPhoneNumber('');
      setOccupation('');
      setNotes('');
      setAliyaPreference('');
      setLocation('');
      setReligiousStatus('');
      setSpousePreferences('');
      setHeight('');
      setPreviouslyMarried(false);
      setHasChildren(false);
      setCurrentRelationshipStatus('');
      setAge('');
      setGender('');
      navigate('/options');
    } else {
      console.warn('Form incomplete');
    }
  };

  return (
    <div className="App">
      <h1>The Shadchan's Notebook</h1>
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
          <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g., 5ft10in or 170 cm" />
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddSinglePage;