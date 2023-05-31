import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataGrid = ({ endpoint, columns }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filterAttribute, setFilterAttribute] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${endpoint}?_start=${(currentPage - 1) * pageSize}&_limit=${pageSize}`);
      const totalCount = response.headers['x-total-count'];
      setTotalPages(Math.ceil(totalCount / pageSize));
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    let filtered = data;

    if (searchKeyword) {
      filtered = filtered.filter(item => {
        for (const column of columns) {
          const value = item[column.key] || '';
          if (value.toString().toLowerCase().includes(searchKeyword.toLowerCase())) {
            return true;
          }
        }
        return false;
      });
    }

    if (filterAttribute && filterValue) {
      filtered = filtered.filter(item => {
        const value = item[filterAttribute] || '';
        return value.toString() === filterValue;
      });
    }

    if (sortBy) {
      filtered.sort((a, b) => {
        const valueA = a[sortBy] || '';
        const valueB = b[sortBy] || '';

        if (sortOrder === 'asc') {
          return valueA.localeCompare(valueB);
        } else {
          return valueB.localeCompare(valueA);
        }
      });
    }

    setFilteredData(filtered);
  }, [data, searchKeyword, filterAttribute, filterValue, sortBy, sortOrder]);

  const handleSearch = event => {
    setSearchKeyword(event.target.value);
  };

  const handleFilterAttributeChange = event => {
    setFilterAttribute(event.target.value);
    setFilterValue('');
  };

  const handleFilterValueChange = event => {
    setFilterValue(event.target.value);
  };

  const handleSort = columnKey => {
    if (sortBy === columnKey) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(columnKey);
      setSortOrder('asc');
    }
  };

  const handlePageSizeChange = event => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div>
      <div>
        <input type="text" placeholder="Search..." value={searchKeyword} onChange={handleSearch} />
        <select value={filterAttribute} onChange={handleFilterAttributeChange}>
          <option value="">Select Attribute</option>
          {columns.map(column => (
            <option key={column.key} value={column.key}>
              {column.label}
            </option>
          ))}
        </select>
        {filterAttribute && (
          <select value={filterValue} onChange={handleFilterValueChange}>
            <option value="">Select Value</option>
            {data.map(item => (
              <option key={item[filterAttribute]} value={item[filterAttribute]}>
                {item[filterAttribute]}
              </option>
            ))}
          </select>
        )}
      </div>
      <table>
        <thead>
          <tr>
            {columns.map(column => (
              <th key={column.key} onClick={() => handleSort(column.key)}>
                {column.label}
                {sortBy === column.key && <span>{sortOrder === 'asc' ? '▲' : '▼'}</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map(item => (
            <tr key={item.id}>
              {columns.map(column => (
                <td key={column.key}>{item[column.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Prev
        </button>
        <span>{currentPage}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
        <select value={pageSize} onChange={handlePageSizeChange}>
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
        </select>
      </div>
    </div>
  );
};

export default DataGrid;
