// src/components/CreateAccountForm.js

import React, { useState } from 'react';
// import './CreateAccountForm.css'; // Create a corresponding CSS file or adjust as needed
import { useNavigate } from "react-router-dom";

function CreateAccountForm() {
  const navigate = useNavigate();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [accountType, setAccountType] = useState("");
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.className = isDarkMode ? "" : "dark-mode";
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    // Construct the data object to send to the backend
    const accountData = {
      name: first,
      lastname: last,
      email,
      password,
      department: selectedValue,
      role: accountType,
    };

    console.log('Account Data:', JSON.stringify(accountData));

    try {
      const response = await fetch('http://localhost:3001/api/accounts/createAccount', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountData),
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const newAccount = await response.json();
        setAccounts([...accounts, newAccount]);

        // Clear input fields after creation
        setFirst('');
        setLast('');
        setEmail('');
        setPassword('');
        setSelectedValue('');
        setAccountType('');
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error creating account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Error creating account');
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="create-account-form">
      <h2>Create Account</h2>
      <form className="account-form" onSubmit={handleCreateAccount}>
        <input
          type="text"
          value={first}
          placeholder="Enter First Name"
          onChange={(e) => setFirst(e.target.value)}
          required
        />
        <input
          type="text"
          value={last}
          placeholder="Enter Last Name"
          onChange={(e) => setLast(e.target.value)}
          required
        />
        <input
          type="email"
          value={email}
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          value={password}
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          required
        >
          <option value="">--Select Department--</option>
          <option value="GST">GST</option>
          <option value="FBU">FBU</option>
          <option value="WHM">WHM</option>
          <option value="MP">MP</option>
          <option value="JAPAN">Japan</option>
          <option value="WDIN">WDIN</option>
        </select>
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
          required
        >
          <option value="">--Select Role--</option>
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>
        <button type="submit" className="submit-button">Create Account</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {"Account created successfully:"} {account.name} {account.lastname} ({account.email}) - 
            <strong> {account.department} / {account.role}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CreateAccountForm;
