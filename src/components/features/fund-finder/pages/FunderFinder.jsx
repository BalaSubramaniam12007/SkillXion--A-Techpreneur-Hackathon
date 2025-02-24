import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import FundingList from '../components/FundingList';

function FundFinder() {
  const [search, setSearch] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('/funding_data.json') // Temporary static file from scraper
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const filteredData = data.filter(item =>
    (item.title?.toLowerCase().includes(search.toLowerCase()) ||
     item.category?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-4xl mx-auto md:p-8">
      <h1 className="text-3xl font-bold mb-6">Fund Finder for Startups</h1>
      <SearchBar search={search} setSearch={setSearch} />
      {loading ? (
        <p className="text-gray-500 text-center">Loading opportunities...</p>
      ) : (
        <FundingList opportunities={filteredData} />
      )}
    </div>
  );
}

export default FundFinder;