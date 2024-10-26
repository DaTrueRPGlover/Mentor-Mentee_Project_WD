import React, { useState } from 'react';
import './CreateAccount.css';

function CreateAccount() {
  const [accounts, setAccounts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [accountType, setAccountType] = useState('mentee');

  const handleCreateAccount = () => {
    if (name.trim() && email.trim()) {
      // Add the new account to the list
      setAccounts([...accounts, { name, email, type: accountType }]);
      setName(''); // Clear the fields after account creation
      setEmail('');
    }
  };

  return (
    <div className="create-account">
      <h1>Create Mentee/Mentor Account</h1>
      <div className="rectangle">
        <input
            type="text"
            value={name}
            placeholder="Enter First Name"
        />
      </div>
      <button className="Submit">
          Submit
      </button>
      {/* <div className="account-form">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter name"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter email"
        />
        <select
          value={accountType}
          onChange={(e) => setAccountType(e.target.value)}
        >
          <option value="mentee">Mentee</option>
          <option value="mentor">Mentor</option>
        </select>
        <button onClick={handleCreateAccount}>Create Account</button>
      </div>

      <h2>Created Accounts</h2>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {account.name} ({account.email}) - <strong>{account.type}</strong>
          </li>
        ))}
      </ul> */}
    </div>
  );
}

export default CreateAccount;

