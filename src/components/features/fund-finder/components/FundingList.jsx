import React from 'react';

function FundingList({ opportunities }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {opportunities.map(item => (
        <div
          key={item.id}
          className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          <h3 className="text-lg font-semibold">{item.title}</h3>
          <p className="text-gray-600">Category: {item.category || 'N/A'}</p>
          <p className="text-gray-600">Deadline: {item.deadline || 'Open'}</p>
          <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}

export default FundingList;