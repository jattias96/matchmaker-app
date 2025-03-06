import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Single } from '../../types/types'; // Adjust if moving types.ts
import { toast } from 'react-toastify'; // Optional: Add react-toastify for notifications

interface Props {
  onAdd: (single: Omit<Single, "id">) => void;
}

const AddSinglePage: React.FC<Props> = ({ onAdd }) => {
  const [formData, setFormData] = useState<Omit<Single, "id">>({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phoneNumber: '',
    occupation: '',
    notes: '',
    aliyaPreference: '',
    location: '',
    religiousStatus: '',
    spousePreferences: '',
    height: '',
    previouslyMarried: false,
    hasChildren: false,
    currentRelationshipStatus: '',
    age: 0,
    gender: '',
  });
  const navigate = useNavigate();

  const calculateAge = useCallback((dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0; // Fallback for invalid dates
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredFields = ['firstName', 'lastName', 'dateOfBirth', 'email', 'phoneNumber', 'occupation', 'religiousStatus', 'age', 'gender'];
    if (requiredFields.every((field) => formData[field as keyof Omit<Single, "id">])) {
      const newSingle: Omit<Single, "id"> = {
        ...formData,
        age: formData.dateOfBirth ? calculateAge(formData.dateOfBirth) || Number(formData.age) : Number(formData.age),
      };
      console.log('Adding single:', newSingle);
      try {
        await onAdd(newSingle);
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          email: '',
          phoneNumber: '',
          occupation: '',
          notes: '',
          aliyaPreference: '',
          location: '',
          religiousStatus: '',
          spousePreferences: '',
          height: '',
          previouslyMarried: false,
          hasChildren: false,
          currentRelationshipStatus: '',
          age: 0,
          gender: '',
        });
        navigate('/options');
      } catch (error) {
        console.error('Error adding single:', error);
        toast.error('Failed to add single. Please try again.'); // Optional: Requires react-toastify
      }
    } else {
      console.warn('Form incomplete');
      toast.warn('Please fill all required fields.'); // Optional
    }
  };

  return (
    <div className="App">
      <h1>The Shadchan's Notebook</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name</label>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Date of Birth</label>
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Occupation</label>
          <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Notes</label>
          <textarea name="notes" value={formData.notes} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Aliya Preference</label>
          <input type="text" name="aliyaPreference" value={formData.aliyaPreference} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Religious Status</label>
          <input type="text" name="religiousStatus" value={formData.religiousStatus} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Spouse Preferences</label>
          <input type="text" name="spousePreferences" value={formData.spousePreferences} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Height</label>
          <input type="text" name="height" value={formData.height} onChange={handleChange} placeholder="e.g., 5ft10in or 170 cm" />
        </div>
        <div className="form-group">
          <label>Previously Married</label>
          <input type="checkbox" name="previouslyMarried" checked={formData.previouslyMarried} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Has Children</label>
          <input type="checkbox" name="hasChildren" checked={formData.hasChildren} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Current Relationship Status</label>
          <input type="text" name="currentRelationshipStatus" value={formData.currentRelationshipStatus} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={formData.age} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <select name="gender" value={formData.gender} onChange={handleChange} required>
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