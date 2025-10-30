// src/utils/api.js
import axios from "axios";

const BACKEND_URL = "https://attendance-dtnh.onrender.com";

export const api = axios.create({
  baseURL: BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Attendance API functions

// Get all attendance records
export const getAttendance = async () => {
  const response = await api.get("/api/attendance");
  return response.data;
};

// Create a new attendance record
export const createAttendance = async (data) => {
  const response = await api.post("/api/attendance", data);
  return response.data;
};

// Delete attendance record by ID
export const deleteAttendance = async (id) => {
  const response = await api.delete(`/api/attendance/${id}`);
  return response.data;
};

// Filter attendance by date (YYYY-MM-DD)
export const filterAttendanceByDate = async (date) => {
  const response = await api.get(`/api/attendance/filter/${date}`);
  return response.data;
};

// Search attendance by name or ID
export const searchAttendance = async (term) => {
  try {
    const response = await api.get(`/api/attendance/search/${term}`);
    return response.data;
  } catch (error) {
    // fallback to client-side filtering if backend search not available
    const allRecords = await getAttendance();
    return allRecords.filter(
      (record) =>
        record.employeeName.toLowerCase().includes(term.toLowerCase()) ||
        record.employeeID.toLowerCase().includes(term.toLowerCase())
    );
  }
};
