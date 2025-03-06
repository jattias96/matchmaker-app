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
  const [isFiltersOpen, setIsFiltersOpen] = useState(true);
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
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:flex md:flex-col z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Shadchan's Notebook</h2>
          <button className="md:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>
        <nav className="space-y-2">
          <Link
            to="/"
            className="block text-gray-200 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            to="/matches"
            className="block text-gray-200 hover:text-white font-medium py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Matches
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8">
        <button
          className="md:hidden mb-6 p-2 text-gray-700 hover:text-gray-900"
          onClick={() => setIsSidebarOpen(true)}
        >
          <FaBars size={20} />
        </button>

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-800">The Shadchan's Notebook</h1>
          <Link
            to="/add"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            Add Single
          </Link>
        </header>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <button
            className="md:hidden w-full text-left text-gray-700 font-medium mb-4 flex items-center justify-between"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            Filters
            <span>{isFiltersOpen ? '▲' : '▼'}</span>
          </button>
          <div
            className={`flex flex-row items-center gap-4 overflow-x-auto ${
              isFiltersOpen ? 'block' : 'hidden md:flex'
            }`}
          >
            <input
              type="text"
              placeholder="Search by name or notes"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="min-w-[200px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="min-w-[120px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
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
              className="min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <input
              type="number"
              placeholder="Max Age"
              value={maxAge === '' ? '' : maxAge}
              onChange={(e) => setMaxAge(e.target.value === '' ? '' : Number(e.target.value))}
              className="min-w-[100px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <select
              value={filterReligiousStatus}
              onChange={(e) => setFilterReligiousStatus(e.target.value)}
              className="min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Religious Statuses</option>
              <option value="Orthodox">Orthodox</option>
              <option value="Conservative">Conservative</option>
              <option value="Reform">Reform</option>
            </select>
            <select
              value={filterPreviouslyMarried}
              onChange={(e) => setFilterPreviouslyMarried(e.target.value as '' | 'yes' | 'no')}
              className="min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Marital Statuses</option>
              <option value="yes">Previously Married</option>
              <option value="no">Never Married</option>
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | '')}
              className="min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">No Sort</option>
              <option value="asc">Age Ascending</option>
              <option value="desc">Age Descending</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <h2 className="text-lg font-semibold p-4 border-b border-gray-200 text-gray-800">
            Singles List ({filteredSingles.length})
          </h2>
          {filteredSingles.length === 0 ? (
            <p className="p-6 text-gray-500 text-center text-sm">
              No singles found. Adjust filters or add a new single.
            </p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        'Name',
                        'Age',
                        'Gender',
                        'Occupation',
                        'Religious Status',
                        'Marital Status',
                        'Notes',
                        'Actions',
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedSingles.map((single, index) => (
                      <tr
                        key={single.id}
                        className={`${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-gray-100 transition-colors`}
                      >
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {single.firstName} {single.lastName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{single.age}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{single.gender}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{single.occupation}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {single.religiousStatus}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {single.previouslyMarried ? 'Previously Married' : 'Never Married'}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {single.notes || 'N/A'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium space-x-3">
                          <Link
                            to={`/edit/${single.id}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() =>
                              handleDelete(single.id, `${single.firstName} ${single.lastName}`)
                            }
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 gap-4">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;