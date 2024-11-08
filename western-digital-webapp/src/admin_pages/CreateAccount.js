import React, { useState } from 'react';
import './CreateAccount.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';

function CreateAccount() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState(null);

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
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error creating account');
      }
    } catch (error) {
      console.error('Error creating account:', error);
      setError('Error creating account');
    }
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="create-account">
      <header className="header-container">
        <div className="top-header">
          <button
            className="logo-button"
            onClick={() => navigate("/admin-home")}
          >
            <img src={logo} alt="Logo" className="logo" />
          </button>

          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
        <div className="container">
          <h1 className="welcome-message">Create Mentor/Mentee Account</h1>
        </div>
      </header>

      <div className="rectangle">
        <div className="whiterectangle">
          <form className="account-form" onSubmit={handleCreateAccount}>
            <input 
              type="text" 
              value={first} 
              placeholder="Enter First Name"
              onChange={(e) => setFirst(e.target.value)}
            />
            <input 
              type="text" 
              value={last} 
              placeholder="Enter Last Name"
              onChange={(e) => setLast(e.target.value)}
            />
            <input 
              type="text" 
              value={email} 
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input 
              type="password" 
              value={password} 
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <h3>Department</h3>
            <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
              <option value="">--Select Department--</option>
              <option value="GST">GST</option>
              <option value="FBU">FBU</option>
              <option value="WHM">WHM</option>
              <option value="MP">MP</option>
              <option value="JAPAN">Japan</option>
              <option value="WDIN">WDIN</option>
            </select>
            <h3>Role</h3>
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="">--Select Role--</option>
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
            </select>
            <div className="space"></div>
            <button type="submit" className="submit-button">Create Account</button>
          </form>
        </div>
      </div>

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

export default CreateAccount;
