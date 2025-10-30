import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';


const AttendanceForm = () => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Basic validation
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage('Please fill in all required fields');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/attendance', formData);
      setMessage(response.data.message);
      setIsError(false);
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to submit attendance. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <div className="form-container">
      <div className="card">
        <div className="card-header bg-white">
          <h3 className="card-title mb-0 text-primary">
            <i className="fas fa-user-check me-2"></i>
            Mark Attendance
          </h3>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
              <i className={`fas ${isError ? 'fa-exclamation-triangle' : 'fa-check-circle'} me-2`}></i>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="employeeName" className="form-label fw-semibold">
                Employee Name *
              </label>
              <input
                type="text"
                className="form-control"
                id="employeeName"
                name="employeeName"
                value={formData.employeeName}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="employeeID" className="form-label fw-semibold">
                Employee ID *
              </label>
              <input
                type="text"
                className="form-control"
                id="employeeID"
                name="employeeID"
                value={formData.employeeID}
                onChange={handleChange}
                placeholder="Enter employee ID"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="date" className="form-label fw-semibold">
                Date
              </label>
              <input
                type="date"
                className="form-control"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="status" className="form-label fw-semibold">
                Attendance Status
              </label>
              <select
                className="form-select"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Submitting...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  Submit Attendance
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AttendanceForm;