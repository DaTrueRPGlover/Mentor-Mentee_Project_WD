import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
// Main Menus
import MentorHome from './main_menus/MentorHome';
import MenteeHome from './main_menus/MenteeHome';
import AdminHome from './main_menus/AdminHome';
// Mentee Pages
import InteractWithMentor from './mentee_pages/InteractWithMentor';
import TodoProgression from './mentee_pages/TodoProgression';
import MenteeMeetings from './mentee_pages/MenteeMeetings';
import CheckHW from './mentee_pages/checkHW';
import HomeworkEach from "./mentee_pages/homeworkeach";
// Mentor Pages
import InteractWithMentee from './mentor_pages/InteractWithMentee';
import AssignHomework from './mentor_pages/AssignHomework';
import MentorMeetings from './mentor_pages/MentorMeetings';
import WriteProgression from './mentor_pages/WriteMenteeProgression';
// Admin Pages
import SeeInteractions from './admin_pages/SeeInteractions';
import AssignMentor from './admin_pages/AssignMentor';
import ViewProgressions from './admin_pages/ViewProgression';
import CreateAccount from './admin_pages/CreateAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mentor-home" element={<MentorHome />} />
        <Route path="/mentee-home" element={<MenteeHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        {/* mentor-home -> mentor_pages */}
        <Route path="/interact-with-mentee" element={<InteractWithMentee />} />
        <Route path="/assign-homework" element={<AssignHomework />} />
        <Route path="/mentor-meetings" element={<MentorMeetings />} />
        <Route path="/write-mentee-progression" element={<WriteProgression />} />
        {/* admin-home -> admin_pages */}
        <Route path="/see-interactions" element={<SeeInteractions />} />
        <Route path="/assign-mentor" element={<AssignMentor />} />
        <Route path="/view-progressions" element={<ViewProgressions />} />
        <Route path="/create-account" element={<CreateAccount />} />
        {/* mentee-home -> mentee_pages */}
        <Route path="/interact-mentor" element={<InteractWithMentor />} />
        <Route path="/todo-progression" element={<TodoProgression />} />
        <Route path="/mentee-meetings" element={<MenteeMeetings />} />
        <Route path="/check-hw" element={<CheckHW />} />
        <Route path="/homework/:homeworkId" element={<HomeworkEach />} />
      </Routes>
    </Router>
  );
}

export default App;
