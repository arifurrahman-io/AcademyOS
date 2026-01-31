import React from 'react';

const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b">
            {headers.map((header, idx) => (
              <th key={idx} className="p-4 font-semibold text-gray-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {data.length > 0 ? (
            data.map((item, idx) => renderRow(item, idx))
          ) : (
            <tr>
              <td colSpan={headers.length} className="p-8 text-center text-gray-500">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;