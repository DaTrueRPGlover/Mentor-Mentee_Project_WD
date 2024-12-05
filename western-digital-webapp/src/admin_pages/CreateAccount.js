import React, { useState } from 'react';
import './CreateAccount.css';
import { useNavigate } from "react-router-dom";
import logo from '../assets/WDC.png';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
function CreateAccount() {
  //Initialize navigate
  const navigate = useNavigate();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [accountType, setAccountType] = useState("");
  const [error, setError] = useState(null);
  const [accounts, setAccounts] = useState([]);


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



  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="create-account">
           <AppBar position="static" color="primary">
        <Toolbar>
        <Button
            className="logo-button"
            onClick={() => navigate("/admin-home")}
          >
            <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
            </Button>

            <Typography variant="h6" sx={{ flexGrow: 1 }}>

             Create Account
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
      
      {/* <div className="rectangle" > */}
        <div className="whiterectangle" >
          <form className="account-form" onSubmit={handleCreateAccount}>
            <h1 className="welcome-message1">
              Create Account
            </h1>
            <input className='input1' 
              type="text" 
              value={first} 
              placeholder="Enter First Name"
              onChange={(e) => setFirst(e.target.value)}
            />
            <input className='input1' 
              type="text" 
              value={last} 
              placeholder="Enter Last Name"
              onChange={(e) => setLast(e.target.value)}
            />
            <input className='input1' 
              type="text" 
              value={email} 
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input className='input1' 
              type="password" 
              value={password} 
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <h3>Department</h3> */}
            <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
              <option value="">--Select Department--</option>
              <option value="GST">GST</option>
              <option value="FBU">FBU</option>
              <option value="WHM">WHM</option>
              <option value="MP">MP</option>
              <option value="JAPAN">Japan</option>
              <option value="WDIN">WDIN</option>
            </select>
            {/* <h3>Role</h3> */}
            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
              <option value="">--Select Role--</option>
              <option value="mentee">Mentee</option>
              <option value="mentor">Mentor</option>
            </select>
            <div className="space"></div>
            <button type="submit" className="submit-button">Create Account</button>
          </form>
        </div>
      {/* </div> */}

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
