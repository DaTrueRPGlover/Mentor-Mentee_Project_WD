import React, { useState } from "react";
import {
  TextField,
  Container,
  Typography,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockSharpIcon from '@mui/icons-material/LockSharp';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Import motion from framer-motion
import "./Login.css"; // Import the CSS file

const logo = require("./assets/WDC.png");

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false); // Track logging in state
  const [moveUp, setMoveUp] = useState(false); // State to trigger the movement
  const navigate = useNavigate(); // For navigation after login

  // Handle form submission (login)
  const handleSubmit = (e) => {
    console.log("Login form submitted");
    e.preventDefault();
    setIsLoggingIn(true); // Set logging in state to true

    fetch("http://localhost:3001/api/users/login", {
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

          // Trigger upward movement after successful login
          setMoveUp(true);

          // Redirect based on role
          if (body.role.toLowerCase() === "mentor") {
            setTimeout(() => navigate("/mentor-home"), 1000); // Add delay to let animation complete
          } else if (body.role.toLowerCase() === "mentee") {
            setTimeout(() => navigate("/mentee-home"), 1000);
          } else if (body.role.toLowerCase() === "admin") {
            setTimeout(() => navigate("/admin-home"), 1000);
          } else {
            console.error("Unknown user role:", body.role);
            setErrorMessage("Unknown user role");
            setIsLoggingIn(false); // Reset the button to 'Log In'
          }
        } else {
          console.log("Invalid credentials");
          setErrorMessage(body.message || "Invalid email or password");
          setIsLoggingIn(false); // Reset the button to 'Log In'
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred. Please try again later.");
        setIsLoggingIn(false); // Reset the button to 'Log In'
      });
  };

  return (
    <>
      <CssBaseline />
      <img src={logo} alt="Logo" className="login-logo" />
      <div className="center-container">
        <Container component="main" maxWidth="xs">
          <motion.div className="login-container">
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

            <Typography component="h1" variant="h5" className="login-heading1">
              Log In
            </Typography>

            <form className="login-form" onSubmit={handleSubmit}>
              {errorMessage && (
                <Typography variant="body2" className="login-error-message">
                  {errorMessage}
                </Typography>
              )}

              <div className="input-container">
                <input
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  placeholder="Username"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="invisible-input" // Apply invisible input class
                  onFocus={(e) => e.target.style.opacity = 1} // Reveal input on focus
                />
              </div>

              <div className="input-container">
                <input
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
                  className="invisible-input" // Apply invisible input class
                  onFocus={(e) => e.target.style.opacity = 1} // Reveal input on focus
                />
              </div>

              {/* Animate the button */}
              <motion.button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
                disabled={isLoggingIn} // Disable button during login
                initial={{ scale: 1 }}
                animate={{
                  scale: isLoggingIn ? 1.05 : 1, // Slightly scale up the button when logging in
                  backgroundColor: isLoggingIn ? "#1565c0" : "#86a8e7", // Change color
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {isLoggingIn ? "Logging in..." : "Log In"} {/* Change text */}
              </motion.button>
            </form>
          </motion.div>
        </Container>
      </div>
    </>
  );
}

export default Login;
