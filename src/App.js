import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('form');

  return (
    <div className="App d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-primary shadow-sm">
        <div className="container">
          <span className="navbar-brand mb-0 h1">
            <i className="fas fa-clipboard-list me-2"></i>
            Employee Attendance Tracker
          </span>
          <div className="navbar-nav flex-row">
            <button 
              className={`nav-link btn ${currentView === 'form' ? 'btn-light' : 'btn-outline-light'} me-2`}
              onClick={() => setCurrentView('form')}
            >
              Mark Attendance
            </button>
            <button 
              className={`nav-link btn ${currentView === 'dashboard' ? 'btn-light' : 'btn-outline-light'}`}
              onClick={() => setCurrentView('dashboard')}
            >
              View Records
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4 flex-grow-1">
        {currentView === 'form' ? <AttendanceForm /> : <AttendanceDashboard />}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="mb-0">&copy; 2024 Employee Attendance Tracker</p>
        </div>
      </footer>
    </div>
  );
}

export default App;