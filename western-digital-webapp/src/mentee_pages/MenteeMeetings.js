import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
//date format (yyyy,mm-1,dd,hr,min)
function MenteeMeetings() {
  const [meetings] = useState([
    {
      title: 'Meeting with John Doe',
      start: new Date(2024, 9, 25, 10, 0),
      end: new Date(2024, 9, 25, 11, 0),
      mentor: 'John Doe',
      link: 'https://zoom.us/j/123456789',
    },
    {
      title: 'Meeting with Jane Smith',
      start: new Date(2024, 10, 1, 14, 0),
      end: new Date(2024, 10, 1, 15, 0),
      mentor: 'Jane Smith',
      link: 'https://zoom.us/j/987654321',
    },
  ]);

  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSelectEvent = (event) => {
    setSelectedMeeting(event);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMeeting(null);
  };

  return (
    <div className="mentee-meetings">
      <Calendar
        localizer={localizer}
        events={meetings}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={handleSelectEvent}
        className="calendar"
        style={{ backgroundColor: 'white' }}
      />

      {/* Modal for Meeting Details */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth={true}
        BackdropProps={{
          className: 'MuiBackdrop-root', // Applying custom class for the backdrop
        }}
        PaperProps={{
          className: 'MuiPaper-root', // Applying custom class for the modal paper
        }}
      >
        <DialogTitle className="MuiDialogTitle-root">
          Meeting Details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey',
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent className="MuiDialogContent-root">
          {selectedMeeting && (
            <div>
              <p>
                <strong>Title:</strong> {selectedMeeting.title}
              </p>
              <p>
                <strong>Mentor:</strong> {selectedMeeting.mentor}
              </p>
              <p>
                <strong>Start Time:</strong>{' '}
                {selectedMeeting.start.toLocaleString()}
              </p>
              <p>
                <strong>End Time:</strong>{' '}
                {selectedMeeting.end.toLocaleString()}
              </p>
              <p>
                <strong>Meeting Link:</strong>{' '}
                <a
                  href={selectedMeeting.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="meeting-link" // Added a custom class for the meeting link
                >
                  {selectedMeeting.link}
                </a>
              </p>
            </div>
          )}
        </DialogContent>
        <DialogActions className="MuiDialogActions-root">
          <Button onClick={handleClose} className="MuiButton-root">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MenteeMeetings;
