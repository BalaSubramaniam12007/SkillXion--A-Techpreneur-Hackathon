import React from 'react';

function SearchBar({ search, setSearch }) {
  return (
    <input
      type="text"
      placeholder="Search by industry or keyword..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full p-3 mb-6 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

export default SearchBar;