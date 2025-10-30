import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AttendanceDashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/attendance');
      setAttendanceRecords(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch attendance records. Make sure the backend server is running.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterByDate = async () => {
    if (!filterDate) {
      fetchAttendanceRecords();
      return;
    }

    try {
      setLoading(true);
      // FIXED: Use URL parameter instead of query parameter
      const response = await axios.get(`http://localhost:5000/api/attendance/filter/${filterDate}`);
      setAttendanceRecords(response.data);
      setError('');
    } catch (error) {
      setError('Failed to filter records. Make sure the date format is correct (YYYY-MM-DD).');
      console.error('Filter Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchAttendanceRecords();
      return;
    }

    try {
      setLoading(true);
      // FIXED: Use URL parameter instead of query parameter
      const response = await axios.get(`http://localhost:5000/api/attendance/search/${searchTerm}`);
      setAttendanceRecords(response.data);
      setError('');
    } catch (error) {
      // If search endpoint doesn't exist, fall back to client-side filtering
      console.log('Search endpoint not available, falling back to client-side filtering');
      try {
        const allResponse = await axios.get('http://localhost:5000/api/attendance');
        const filtered = allResponse.data.filter(record =>
          record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.employeeID.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setAttendanceRecords(filtered);
        setError('');
      } catch (fallbackError) {
        setError('Failed to search records');
        console.error('Search Error:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm('Are you sure you want to delete this attendance record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/attendance/${id}`);
        setAttendanceRecords(attendanceRecords.filter(record => record.id !== id));
      } catch (error) {
        setError('Failed to delete record');
        console.error('Error:', error);
      }
    }
  };

  const clearFilters = () => {
    setFilterDate('');
    setSearchTerm('');
    fetchAttendanceRecords();
  };

  // For real-time search (optional - remove if you prefer button search)
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 500);
      return () => clearTimeout(timeoutId);
    } else if (searchTerm === '') {
      fetchAttendanceRecords();
    }
  }, [searchTerm]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Loading attendance records...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">
          <i className="fas fa-chart-bar me-2"></i>
          Attendance Records
        </h3>
        <button className="btn btn-outline-primary" onClick={fetchAttendanceRecords}>
          <i className="fas fa-sync-alt me-2"></i>
          Refresh
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {/* Bonus Features: Filter and Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-calendar"></i>
            </span>
            <input
              type="date"
              className="form-control"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleFilterByDate}>
              Filter by Date
            </button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">
              <i className="fas fa-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-secondary" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
        {(filterDate || searchTerm) && (
          <div className="col-12 mt-2">
            <button className="btn btn-sm btn-outline-secondary" onClick={clearFilters}>
              <i className="fas fa-times me-1"></i>
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {attendanceRecords.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="fas fa-info-circle me-2"></i>
          No attendance records found.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Employee Name</th>
                <th>Employee ID</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="fw-semibold">{record.employeeName}</td>
                  <td className="text-muted">{record.employeeID}</td>
                  <td>{new Date(record.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</td>
                  <td>
                    <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                      {record.status === 'Present' ? 'Present' : 'Absent'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteRecord(record.id)}
                      title="Delete record"
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-3 text-muted small">
        <i className="fas fa-database me-1"></i>
        Total Records: {attendanceRecords.length}
        {filterDate && ` • Filtered by: ${filterDate}`}
        {searchTerm && ` • Searching: "${searchTerm}"`}
      </div>
    </div>
  );
};

export default AttendanceDashboard;