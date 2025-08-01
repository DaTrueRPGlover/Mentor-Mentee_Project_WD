import React, { useState } from "react";
import {
  Container,
  Typography,
  Avatar,
  CssBaseline,
} from "@mui/material";
import LockSharpIcon from "@mui/icons-material/LockSharp";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Login.css";

const logo = require("./assets/WDC2.png");

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const navigate = useNavigate();

  // Handle form submission (login)
  const handleSubmit = (e) => {
    console.log("Login form submitted");
    e.preventDefault();
    setIsLoggingIn(true);

    fetch("http://localhost:3001/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
      .then((response) =>
        response.json().then((data) => ({
          status: response.status,
          body: data,
        }))
      )
      .then(({ status, body }) => {
        if (status === 200) {
          sessionStorage.setItem(
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
          setMoveUp(true);

          if (body.role.toLowerCase() === "mentor") {
            setTimeout(() => navigate("/interact-with-mentee"), 1000);
          } else if (body.role.toLowerCase() === "mentee") {
            setTimeout(() => navigate("/interact-mentor"), 1000);
          } else if (body.role.toLowerCase() === "admin") {
            setTimeout(() => navigate("/assign-mentor"), 1000);
          } else {
            console.error("Unknown user role:", body.role);
            setErrorMessage("Unknown user role");
            setIsLoggingIn(false);
          }
        } else {
          console.log("Invalid credentials");
          setErrorMessage(body.message || "Invalid email or password");
          setIsLoggingIn(false);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setErrorMessage("An error occurred. Please try again later.");
        setIsLoggingIn(false);
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
                backgroundColor: "inherit",
              }}
              className="login-avatar"
            >
              <LockSharpIcon
                sx={{
                  backgroundColor: "inherit",
                  fontSize: 35,
                }}
              />
            </Avatar>

            <Typography component="h1" variant="h5" className="login-heading1">
              Log In
            </Typography>

            {errorMessage && (
              <Typography variant="body2" className="login-error-message">
                {errorMessage}
              </Typography>
            )}

            <form className="login-form" onSubmit={handleSubmit}>
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
                  className="invisible-input"
                  onFocus={(e) => (e.target.style.opacity = 1)}
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
                  className="invisible-input"
                  onFocus={(e) => (e.target.style.opacity = 1)}
                />
              </div>

              <motion.button
                type="submit"
                fullWidth
                variant="contained"
                className="login-button"
                disabled={isLoggingIn}
                initial={{ scale: 1 }}
                animate={{
                  scale: isLoggingIn ? 1.05 : 1,
                  backgroundColor: isLoggingIn ? "#1565c0" : "#86a8e7",
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                {isLoggingIn ? "Logging in..." : "Log In"}
              </motion.button>
            </form>
          </motion.div>
          <button onClick={() => navigate('/see-interactions')}>
            Go to Admin Home
          </button>
          <button onClick={() => navigate('/interact-mentor')}>
            Go to Mentee Home
          </button>
          <button onClick={() => navigate('/interact-with-mentee')}>
            Go to Mentor Home
          </button>
        </Container>
      </div>
    </>
  );
}

export default Login;
