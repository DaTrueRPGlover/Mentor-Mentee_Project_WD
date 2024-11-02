import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './MenteeMeetings.css';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

function MenteeMeetings() {
  const [meetings] = useState([
    { title: 'Meeting with John Doe', start: new Date(2024, 9, 25, 10, 0), end: new Date(2024, 9, 25, 11, 0) },
    { title: 'Meeting with Jane Smith', start: new Date(2024, 10, 1, 14, 0), end: new Date(2024, 10, 1, 15, 0) },
  ]);

  return (
    <div className="mentee-meetings">
      <h1>Scheduled Meetings</h1>
      <Calendar
        localizer={localizer}
        events={meetings}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
      />
      <div className="meeting-box">
        <textarea placeholder="Add meeting notes here..."></textarea>
        <button>Add Meeting</button>
      </div>
    </div>
  );
}

export default MenteeMeetings;
