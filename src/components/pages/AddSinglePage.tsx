import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Updated import to include Link
import { Single } from '../../types/types';
import { toast } from 'react-toastify'; // Ensure this is installed and configured

interface Props {
  onAdd: (single: Omit<Single, 'id'>) => void;
}

const AddSinglePage: React.FC<Props> = ({ onAdd }) => {
  const [formData, setFormData] = useState<Omit<Single, 'id'>>({
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
  const [errors, setErrors] = useState<Partial<Record<keyof Omit<Single, 'id'>, string>>>({});
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const requiredFields: (keyof Omit<Single, 'id'>)[] = [
    'firstName',
    'lastName',
    'dateOfBirth',
    'email',
    'phoneNumber',
    'occupation',
    'religiousStatus',
    'age',
    'gender',
  ];

  const validateField = (name: keyof Omit<Single, 'id'>, value: any) => {
    if (requiredFields.includes(name) && !value) {
      return `${name.replace(/([A-Z])/g, ' $1').trim()} is required`;
    }
    if (name === 'email' && value && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email address';
    }
    if (name === 'age' && value && (Number(value) < 0 || Number(value) > 120)) {
      return 'Age must be between 0 and 120';
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof Omit<Single, 'id'>, type === 'checkbox' ? checked : value),
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as any;
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof Omit<Single, 'id'>, type === 'checkbox' ? checked : value),
    }));
  };

  const calculateAge = useCallback((dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age : 0;
  }, []);

  // Auto-calculate age when dateOfBirth changes
  useEffect(() => {
    if (formData.dateOfBirth) {
      const calculatedAge = calculateAge(formData.dateOfBirth);
      setFormData((prev) => ({ ...prev, age: calculatedAge }));
      setErrors((prev) => ({ ...prev, age: validateField('age', calculatedAge) }));
    }
  }, [formData.dateOfBirth, calculateAge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Partial<Record<keyof Omit<Single, 'id'>, string>> = {};
    requiredFields.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.warn('Please fix the errors in the form.');
      return;
    }

    const newSingle: Omit<Single, 'id'> = {
      ...formData,
      age: formData.dateOfBirth ? calculateAge(formData.dateOfBirth) : formData.age,
    };
    try {
      await onAdd(newSingle);
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
      toast.error('Failed to add single. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const handleClear = () => {
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
    setErrors({});
    setShowPreview(false);
    toast.info('Form cleared.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-purple-600 transition-colors">
            The Shadchan's Notebook
          </Link>
          <button
            onClick={handleCancel}
            className="text-gray-600 hover:text-gray-800 transition-colors"
            aria-label="Cancel and return to dashboard"
          >
            Cancel
          </button>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.firstName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.firstName}
                    aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                  />
                  {errors.firstName && (
                    <p id="firstName-error" className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.lastName ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.lastName}
                    aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                  />
                  {errors.lastName && (
                    <p id="lastName-error" className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="dateOfBirth">
                    Date of Birth
                  </label>
                  <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.dateOfBirth ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.dateOfBirth}
                    aria-describedby={errors.dateOfBirth ? 'dateOfBirth-error' : undefined}
                  />
                  {errors.dateOfBirth && (
                    <p id="dateOfBirth-error" className="text-red-500 text-xs mt-1">
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-red-500 text-xs mt-1">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="phoneNumber">
                    Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    type="text"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.phoneNumber ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.phoneNumber}
                    aria-describedby={errors.phoneNumber ? 'phoneNumber-error' : undefined}
                  />
                  {errors.phoneNumber && (
                    <p id="phoneNumber-error" className="text-red-500 text-xs mt-1">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="occupation">
                    Occupation
                  </label>
                  <input
                    id="occupation"
                    type="text"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.occupation ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.occupation}
                    aria-describedby={errors.occupation ? 'occupation-error' : undefined}
                  />
                  {errors.occupation && (
                    <p id="occupation-error" className="text-red-500 text-xs mt-1">
                      {errors.occupation}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Additional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="notes">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm h-24"
                    aria-label="Notes"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="aliyaPreference">
                    Aliya Preference
                  </label>
                  <input
                    id="aliyaPreference"
                    type="text"
                    name="aliyaPreference"
                    value={formData.aliyaPreference}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    aria-label="Aliya Preference"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="location">
                    Location
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    aria-label="Location"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="religiousStatus">
                    Religious Status
                  </label>
                  <input
                    id="religiousStatus"
                    type="text"
                    name="religiousStatus"
                    value={formData.religiousStatus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.religiousStatus ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.religiousStatus}
                    aria-describedby={errors.religiousStatus ? 'religiousStatus-error' : undefined}
                  />
                  {errors.religiousStatus && (
                    <p id="religiousStatus-error" className="text-red-500 text-xs mt-1">
                      {errors.religiousStatus}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="spousePreferences">
                    Spouse Preferences
                  </label>
                  <input
                    id="spousePreferences"
                    type="text"
                    name="spousePreferences"
                    value={formData.spousePreferences}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    aria-label="Spouse Preferences"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="height">
                    Height
                  </label>
                  <input
                    id="height"
                    type="text"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g., 5ft10in or 170 cm"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    aria-label="Height"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <input
                      type="checkbox"
                      name="previouslyMarried"
                      checked={formData.previouslyMarried}
                      onChange={handleChange}
                      className="mr-2"
                      aria-label="Previously Married"
                    />
                    Previously Married
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <input
                      type="checkbox"
                      name="hasChildren"
                      checked={formData.hasChildren}
                      onChange={handleChange}
                      className="mr-2"
                      aria-label="Has Children"
                    />
                    Has Children
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currentRelationshipStatus">
                    Current Relationship Status
                  </label>
                  <input
                    id="currentRelationshipStatus"
                    type="text"
                    name="currentRelationshipStatus"
                    value={formData.currentRelationshipStatus}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    aria-label="Current Relationship Status"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="age">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    name="age"
                    value={formData.age}
                    readOnly // Make age read-only since it's auto-calculated
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-sm"
                    aria-label="Age (auto-calculated)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="gender">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                      errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-purple-500'
                    }`}
                    aria-invalid={!!errors.gender}
                    aria-describedby={errors.gender ? 'gender-error' : undefined}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {errors.gender && (
                    <p id="gender-error" className="text-red-500 text-xs mt-1">
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-purple-600 hover:text-purple-800 transition-colors mb-4"
                aria-expanded={showPreview}
                aria-controls="preview-section"
              >
                {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
              {showPreview && (
                <div id="preview-section" className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Preview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                    <p><strong>First Name:</strong> {formData.firstName || 'N/A'}</p>
                    <p><strong>Last Name:</strong> {formData.lastName || 'N/A'}</p>
                    <p><strong>Date of Birth:</strong> {formData.dateOfBirth || 'N/A'}</p>
                    <p><strong>Email:</strong> {formData.email || 'N/A'}</p>
                    <p><strong>Phone Number:</strong> {formData.phoneNumber || 'N/A'}</p>
                    <p><strong>Occupation:</strong> {formData.occupation || 'N/A'}</p>
                    <p><strong>Notes:</strong> {formData.notes || 'N/A'}</p>
                    <p><strong>Aliya Preference:</strong> {formData.aliyaPreference || 'N/A'}</p>
                    <p><strong>Location:</strong> {formData.location || 'N/A'}</p>
                    <p><strong>Religious Status:</strong> {formData.religiousStatus || 'N/A'}</p>
                    <p><strong>Spouse Preferences:</strong> {formData.spousePreferences || 'N/A'}</p>
                    <p><strong>Height:</strong> {formData.height || 'N/A'}</p>
                    <p><strong>Previously Married:</strong> {formData.previouslyMarried ? 'Yes' : 'No'}</p>
                    <p><strong>Has Children:</strong> {formData.hasChildren ? 'Yes' : 'No'}</p>
                    <p><strong>Current Relationship Status:</strong> {formData.currentRelationshipStatus || 'N/A'}</p>
                    <p><strong>Age:</strong> {formData.age || 'N/A'}</p>
                    <p><strong>Gender:</strong> {formData.gender || 'N/A'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit, Cancel, and Clear Buttons */}
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
                aria-label="Submit form to add single"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
                aria-label="Cancel and return to dashboard"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
                aria-label="Clear form"
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSinglePage;