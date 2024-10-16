import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import MentorHome from './MentorHome';
import MenteeHome from './MenteeHome';
import AdminHome from './Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mentor-home" element={<MentorHome />} />
        <Route path="/mentee-home" element={<MenteeHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/home" element={<div>Home Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
