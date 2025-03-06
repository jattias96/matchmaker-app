import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Single } from '../../types/types';
import { FaBars, FaTimes } from 'react-icons/fa';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterReligiousStatus, setFilterReligiousStatus] = useState('');
  const [filterPreviouslyMarried, setFilterPreviouslyMarried] = useState<'' | 'yes' | 'no'>('');
  const itemsPerPage = 10;

  const filteredSingles = singles
    .filter((single) =>
      `${single.firstName} ${single.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      single.notes.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((single) => (filterGender ? single.gender === filterGender : true))
    .filter((single) => (minAge !== '' ? single.age >= minAge : true))
    .filter((single) => (maxAge !== '' ? single.age <= maxAge : true))
    .filter((single) =>
      filterReligiousStatus ? single.religiousStatus === filterReligiousStatus : true
    )
    .filter((single) =>
      filterPreviouslyMarried
        ? filterPreviouslyMarried === 'yes'
          ? single.previouslyMarried
          : !single.previouslyMarried
        : true
    )
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.age - b.age;
      if (sortOrder === 'desc') return b.age - a.age;
      return 0;
    });

  const totalPages = Math.ceil(filteredSingles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSingles = filteredSingles.slice(startIndex, endIndex);

  const handleDelete = (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-6 transform transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:flex md:flex-col z-50`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Shadchan's Notebook</h2>
          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="space-y-4">
          <Link to="/" className="block text-gray-300 hover:text-white font-medium py-2 px-4 rounded hover:bg-gray-700">
            Dashboard
          </Link>
          <Link to="/matches" className="block text-gray-300 hover:text-white font-medium py-2 px-4 rounded hover:bg-gray-700">
            Matches
          </Link>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <button className="md:hidden mb-4 p-2 text-gray-800" onClick={() => setIsSidebarOpen(true)}>
          <FaBars size={24} />
        </button>

        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <Link to="/add" className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Add Single
          </Link>
        </header>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <input
              type="text"
              placeholder="Search by name or notes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="number"
              placeholder="Min Age"
              value={minAge === '' ? '' : minAge}
              onChange={(e) => setMinAge(e.target.value === '' ? '' : Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Max Age"
              value={maxAge === '' ? '' : maxAge}
              onChange={(e) => setMaxAge(e.target.value === '' ? '' : Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterReligiousStatus}
              onChange={(e) => setFilterReligiousStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Religious Statuses</option>
              <option value="Orthodox">Orthodox</option>
              <option value="Conservative">Conservative</option>
              <option value="Reform">Reform</option>
            </select>
            <select
              value={filterPreviouslyMarried}
              onChange={(e) => setFilterPreviouslyMarried(e.target.value as '' | 'yes' | 'no')}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Marital Statuses</option>
              <option value="yes">Previously Married</option>
              <option value="no">Never Married</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No Sort</option>
              <option value="asc">Sort Age Ascending</option>
              <option value="desc">Sort Age Descending</option>
            </select>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <h2 className="text-xl font-semibold p-4 border-b border-gray-200">
            Singles List ({filteredSingles.length})
          </h2>
          {filteredSingles.length === 0 ? (
            <p className="p-4 text-gray-500 text-center">
              No singles found. Try adjusting your filters or add a new single.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Occupation
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Religious Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Marital Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedSingles.map((single) => (
                      <tr key={single.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {single.firstName} {single.lastName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {single.age}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {single.gender}
                        </td>
                        <td className="px-6 py-3 text-left text-sm text-gray-900">
                          {single.occupation}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {single.religiousStatus}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {single.previouslyMarried ? 'Previously Married' : 'Never Married'}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {single.notes || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link to={`/edit/${single.id}`} className="text-blue-600 hover:text-blue-800 mr-4">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(single.id, `${single.firstName} ${single.lastName}`)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-between items-center p-4 border-t border-gray-200">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;