// src/components/homeworkeach.js
import React, { useMemo } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import "./homeworkeach.css";

import logo from "../assets/WDC2.png";
import chat from "../assets/chat.png";
import write from "../assets/write.png";
import assign from "../assets/assign.png";
import calendar from "../assets/calendar.png";
import logout from "../assets/logout.png";

/** Replace this with your real data fetch.
 * For now, a tiny mock so the page renders.
 */
const MOCK_HOMEWORK = [
  {
    id: "1",
    title: "Math Worksheet",
    subject: "Math",
    points: 20,
    period: "Period 2",
    description:
      "Complete exercises 1–20 on page 42. Show all work. Upload a clear photo.",
    resources: [
      { label: "Worksheet PDF", href: "#" },
      { label: "Example Solutions", href: "#" },
    ],
  },
  {
    id: "2",
    title: "Science Lab Report",
    subject: "Science",
    points: 30,
    period: "Period 4",
    description:
      "Write a 1–2 page report on your chemical reaction experiment. Include hypothesis, method, results, and conclusion.",
    resources: [{ label: "Lab Template", href: "#" }],
  },
];

export default function HomeworkEach() {
  const navigate = useNavigate();
  const { id } = useParams();

  const hw = useMemo(
    () => MOCK_HOMEWORK.find((h) => h.id === id) || MOCK_HOMEWORK[0],
    [id]
  );

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="hw-each-page">
      {/* Topbar */}
      <header className="header">
        <div className="logo-title">
          <img src={logo} alt="logo" className="logo" />
          <h1 className="title">Homework Details</h1>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-main">
          <button
            className="icon"
            onClick={() => navigate("/interact-mentor")}
            aria-label="Chat"
          >
            <img src={chat} alt="Chat" />
          </button>
          <button
            className="icon"
            onClick={() => navigate("/todo-progression")}
            aria-label="Write"
          >
            <img src={write} alt="Write" />
          </button>
          {/* Highlight Assign/Check HW as active for homework detail */}
          <button
            className="icon active"
            onClick={() => navigate("/check-hw")}
            aria-label="Assigned Homework"
          >
            <img src={assign} alt="Assign" />
          </button>
          <button
            className="icon"
            onClick={() => navigate("/mentee-meetings")}
            aria-label="Calendar"
          >
            <img src={calendar} alt="Calendar" />
          </button>
        </div>

        {/* Logout pinned at bottom */}
        <div className="logout-container">
          <button
            className="icon logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <img src={logout} alt="Logout" />
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="homework-detail">
        <article className="detail-card">
          <h2 className="hw-title">{hw.title}</h2>
          <p className="hw-subject"><strong>Subject:</strong> {hw.subject}</p>
          <p className="hw-points"><strong>Points:</strong> {hw.points}</p>
          <p className="hw-period"><strong>Class:</strong> {hw.period}</p>

          <h3>Instructions</h3>
          <p className="hw-description">{hw.description}</p>

          {hw.resources?.length ? (
            <>
              <h3>Resources</h3>
              <ul className="hw-resources">
                {hw.resources.map((r, i) => (
                  <li key={i}>
                    <a href={r.href}>{r.label}</a>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          <div className="back-link">
            <Link to="/check-hw">← Back to Assigned Homework</Link>
          </div>
        </article>
      </main>
    </div>
  );
}
