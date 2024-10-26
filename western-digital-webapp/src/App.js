import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
//Main Menus
import MentorHome from './assets/main_menus/MentorHome';
import MenteeHome from './assets/main_menus/MenteeHome';
import AdminHome from './assets/main_menus/AdminHome';
//Mentee Pages
import InteractWithMentor from './assets/mentee_pages/InteractWithMentor';
import TodoProgression from './assets/mentee_pages/TodoProgression';
import MenteeMeetings from './assets/mentee_pages/MenteeMeetings';
//Mentor Pages
import InteractWithMentee from './assets/mentor_pages/InteractWithMentee';
import AssignHomework from './assets/mentor_pages/AssignHomework';
import MentorMeetings from './assets/mentor_pages/MentorMeetings';
import WriteProgression from './assets/mentor_pages/WriteMenteeProgression';
//Admin Pages
import SeeInteractions from './assets/admin_pages/SeeInteractions';
import AssignMentors from './assets/admin_pages/AssignMentor';
import ViewProgressions from './assets/admin_pages/ViewProgression';
import CreateAccount from './assets/admin_pages/CreateAccount';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/mentor-home" element={<MentorHome />} />
        <Route path="/mentee-home" element={<MenteeHome />} />
        <Route path="/admin-home" element={<AdminHome />} />
        {/* mentor-home -> mentor_pages */}
        <Route path="/interact-with-mentee" element={<InteractWithMentee/>} />
        <Route path="/assign-homework" element={<AssignHomework />} />
        <Route path="/mentor-meetings" element={<MentorMeetings />} />
        <Route path="/write-mentee-progression" element={<WriteProgression />} />
        {/* admin-home -> admin_pages */}
        <Route path="/see-interactions" element={<SeeInteractions />} />
        <Route path="/assign-mentor" element={<AssignMentors />} />
        <Route path="/view-progressions" element={<ViewProgressions />} />
        <Route path="/create-account" element={<CreateAccount />} />
        {/* mentee-home -> mentee_pages */}
        <Route path="/interact-mentor" element={<InteractWithMentor />} />
        <Route path="/todo-progression" element={<TodoProgression />} />
        <Route path="/mentee-meetings" element={<MenteeMeetings />} />

      </Routes>
    </Router>
    
  );
}

export default App;
