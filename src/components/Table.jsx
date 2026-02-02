import React from "react";
import { Database } from "lucide-react";

/**
 * @desc    Modern Compact Ledger Table
 * Optimized for high-density registry data and mobile responsiveness.
 */
const Table = ({ headers, data, renderRow }) => {
  return (
    <div className="w-full overflow-hidden bg-white rounded-[2rem] border border-slate-100 shadow-sm transition-all">
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              {headers.map((header, idx) => (
                <th
                  key={idx}
                  className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.length > 0 ? (
              data.map((item, idx) => renderRow(item, idx))
            ) : (
              <tr>
                <td colSpan={headers.length} className="p-0">
                  <div className="py-20 flex flex-col items-center justify-center grayscale opacity-20">
                    <Database size={48} className="mb-4 text-slate-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      No Node Records Discovered
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Subtle bottom accent line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-slate-100 to-transparent" />
    </div>
  );
};

export default Table;
