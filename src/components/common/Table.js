import React, { useState } from 'react';
import styled from 'styled-components';
import { IoSearch, IoDownloadOutline } from 'react-icons/io5';
import { exportToExcel, exportToCSV } from '../../utils/exportUtils';

const TableContainer = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const TableHeader = styled.div`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SearchInput = styled.div`
  position: relative;
  flex: 1;
  max-width: 300px;

  input {
    padding-left: 2.5rem;
  }

  svg {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background-color: #f8fafc;
    font-weight: 600;
    color: #475569;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  tr:hover {
    background-color: #f8fafc;
  }

  td {
    color: #1e293b;
    font-size: 0.95rem;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #f1f5f9;
    border-color: #cbd5e1;
  }
`;

const Table = ({ columns, data, title, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(row => 
    Object.values(row).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleExport = (type) => {
    if (onExport) {
      onExport(type, filteredData);
    } else {
      // Default export behavior
      if (type === 'excel') exportToExcel(filteredData, title || 'data');
      if (type === 'csv') exportToCSV(filteredData, title || 'data');
    }
  };

  return (
    <TableContainer>
      <TableHeader>
        <SearchInput>
          <IoSearch />
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchInput>
        <Actions>
          <Button onClick={() => handleExport('excel')}>
            <IoDownloadOutline /> Excel
          </Button>
          <Button onClick={() => handleExport('csv')}>
            <IoDownloadOutline /> CSV
          </Button>
        </Actions>
      </TableHeader>
      <div style={{ overflowX: 'auto' }}>
        <StyledTable>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </StyledTable>
      </div>
    </TableContainer>
  );
};

export default Table;
