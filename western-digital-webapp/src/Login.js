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
// import logo from './assets/WDC.png'; // Adjust the path as necessary


const logo = require('./assets/WDC.png');
console.log('Logo:', logo);
console.log('Type of Logo:', typeof logo);
function Login() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // For navigation after login
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
          // localStorage.setItem('mentorName', body.name); // Assuming 'firstname' is returned
          localStorage.setItem('userRole', body.role);
          // Login successful
          console.log('Login successful');
          console.log('User role:', body.role);
          // console.log('User name:', body.name);

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
            // Handle unknown role
            console.error('Unknown user role:', body.role);
            setErrorMessage('Unknown user role');
          }
        } else {
          // Login failed
          console.log('Invalid credentials');
          setErrorMessage(body.message || 'Invalid email or password');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setErrorMessage('An error occurred. Please try again later.');
        console.log('Error message:', errorMessage);
      });
  };


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
    </Container>
    </>
  );
}

export default Login;
