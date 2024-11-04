// login.js
import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockSharpIcon from '@mui/icons-material/LockSharp';
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const logo = require("./assets/WDC.png");

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate(); // For navigation after login

  // Handle form submission (login)
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:3001/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }), // Send email and password
    })
      .then((response) =>
        response.json().then((data) => ({
          status: response.status,
          body: data,
        }))
      )
      .then(({ status, body }) => {
        if (status === 200) {
          // Store user info in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              userId: body.userid,
              name: body.name,
              role: body.role,
              mentorkey: body.mentorkey,
              menteekey: body.menteekey,
              menteeList: body.menteeList || [],
            })
          );
          const user = JSON.parse(localStorage.getItem('user'));
          const userName = user.name
          console.log("whole user", user);
          console.log("Login successful");
          console.log("User id", body.userid)
          console.log("User role:", body.role);
          console.log("Mentor key", body.mentorkey);
          console.log("Mentee key",body.menteekey);
          console.log("userlocal",userName);
          // Redirect based on role
          if (body.role.toLowerCase() === "mentor") {
            navigate("/mentor-home"); // Adjust as needed
          } else if (body.role.toLowerCase() === "mentee") {
            navigate("/mentee-home");
          } else if (body.role.toLowerCase() === "admin") {
            navigate("/admin-home");
          } else {
            console.error("Unknown user role:", body.role);
            setErrorMessage("Unknown user role");
          }
        } else {
          console.log("Invalid credentials");
          setErrorMessage(body.message || "Invalid email or password");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred. Please try again later.");
      });
  };

  // Render the login form and the role buttons
  return (
    <>
       

      <CssBaseline />
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="center-container">
      <Container component="main" maxWidth="xs">
        <div className="login-container">
          <Avatar
            sx={{
              backgroundColor: "inherit", // Match the container's background
            }}
            className="login-avatar"
          >
            <LockSharpIcon
              sx={{
                backgroundColor: "inherit", // Match the container's background
                fontSize: 35,
              }}
            />
          </Avatar>

          <Typography component="h1" variant="h5" className="login-heading">
            Log In
          </Typography>

          <form className="login-form" onSubmit={handleSubmit}>
            {errorMessage && (
              <Typography variant="body2" className="login-error-message">
                {errorMessage}
              </Typography>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              placeholder="Username or Email"
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
              placeholder="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
            >
              Log In
            </button>
          </form>
        </div>

        {/* Add the buttons for direct navigation below the login form */}
        <Typography
          component="h1"
          variant="h6"
          className="welcome-message"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          Or choose your role:
        </Typography>
        <div
          className="button-container"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <button
            variant="contained"
            className="circle-button"
            onClick={() => navigate("/mentee-home")}
            style={{ borderRadius: "50%", padding: "20px 30px" }}
          >
            Mentee
          </button>
          <button
            variant="contained"
            className="circle-button"
            onClick={() => navigate("/mentor-home")}
            style={{ borderRadius: "50%", padding: "20px 30px" }}
          >
            Mentor
          </button>
          <button
            variant="contained"
            className="circle-button"
            onClick={() => navigate("/admin-home")}
            style={{ borderRadius: "50%", padding: "20px 30px" }}
          >
            Admin
          </button>
        </div>
        
      </Container>
      </div>


    </>
  );
}

export default Login;
