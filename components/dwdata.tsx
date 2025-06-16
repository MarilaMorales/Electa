// DownloadExcel.tsx
import React from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface PartyData {
  name: string;
  count: number;
  percent: number;
}

interface Props {
  data: PartyData[];
}

const DownloadExcel: React.FC<Props> = ({ data }) => {
  const handleDownload = () => {
    const formattedData = data.map(({ name, count, percent }) => ({
      Party: name,
      Votes: count,
      Percent: `${percent}%`,
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'VoteSummary');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'VoteSummary.xlsx');
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mb-4"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      Descargar Excel
    </button>
  );
};

export default DownloadExcel;
