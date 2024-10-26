import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Avatar,
  CssBaseline,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const logo = require('./assets/WDC.png');

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // For navigation after login

  // Handle form submission (login)
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // Send email and password
    })
      .then((response) => response.json().then(data => ({
        status: response.status,
        body: data
      })))
      .then(({ status, body }) => {
        if (status === 200) {
          localStorage.setItem('userRole', body.role);
          console.log('Login successful');
          console.log('User role:', body.role);

          // Redirect based on role
          if (body.role === 'Mentor') {
            localStorage.setItem('mentorName', body.name);
            navigate('/mentor-home');
          } else if (body.role === 'Mentee') {
            localStorage.setItem('menteeName', body.name);
            navigate('/mentee-home');
          } else if (body.role === 'Admin') {
            localStorage.setItem('adminName', body.name);
            navigate('/admin-home');
          } else {
            console.error('Unknown user role:', body.role);
            setErrorMessage('Unknown user role');
          }
        } else {
          console.log('Invalid credentials');
          setErrorMessage(body.message || 'Invalid email or password');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again later.');
      });
  };

  // Render the login form and the role buttons
  return (
    <>
      <CssBaseline />
      <img src={logo} alt="Logo" className="logo" />
      <Container component="main" maxWidth="xs">
        <div className="login-container">
          <Avatar className="login-avatar">
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5" className="login-heading">
            Log In
          </Typography>
          <form className="login-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <Typography variant="body2" color="error" className="error-message">
                {errorMessage}
              </Typography>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
            >
              Log In
            </Button>
          </form>
        </div>

        {/* Add the buttons for direct navigation below the login form */}
        <Typography component="h1" variant="h6" className="welcome-message" style={{ textAlign: 'center', marginTop: '20px' }}>
          Or choose your role:
        </Typography>
        <div className="button-container" style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <Button
            variant="contained"
            className="circle-button"
            onClick={() => navigate('/mentee-home')}
            style={{ borderRadius: '50%', padding: '20px 30px' }}
          >
            Mentee
          </Button>
          <Button
            variant="contained"
            className="circle-button"
            onClick={() => navigate('/mentor-home')}
            style={{ borderRadius: '50%', padding: '20px 30px' }}
          >
            Mentor
          </Button>
          <Button
            variant="contained"
            className="circle-button"
            onClick={() => navigate('/admin-home')}
            style={{ borderRadius: '50%', padding: '20px 30px' }}
          >
            Admin
          </Button>
        </div>
      </Container>
    </>
  );
}

export default Login;

