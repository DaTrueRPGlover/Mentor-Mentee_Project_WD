import React, { useState } from 'react';
import './CreateAccount.css';
import logo from '../assets/WDC.png';
function CreateAccount() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accounts, setAccounts] = useState([]);

  const handleChange = (event) => setSelectedValue(event.target.value);

  const handleCreateAccount = (e) => {
    e.preventDefault(); // Prevent form submission behavior

    if (first.trim() && email.trim()) {
      setAccounts([
        ...accounts,
        { first, last, email, password, department: selectedValue, type: accountType }
      ]);
      // Clear input fields after creation
      setFirst('');
      setLast('');
      setEmail('');
      setPassword('');
      setSelectedValue('');
      setAccountType('');
    }
  };

  return (
    <div className="create-account">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Create Account</h2>
      <div className="rectangle">
        <form className="account-form" onSubmit={handleCreateAccount}>
          <h1>First name</h1>
          <input 
            type="text" 
            value={first} 
            placeholder="Enter First Name"
            onChange={(e) => setFirst(e.target.value)}
          />
          <h1>Last name</h1>
          <input 
            type="text" 
            value={last} 
            placeholder="Enter Last Name"
            onChange={(e) => setLast(e.target.value)}
          />
          <h1>Email</h1>
          <input 
            type="text" 
            value={email} 
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <h1>Password</h1>
          <input 
            type="password" 
            value={password} 
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <h1>Department</h1>
          <select value={selectedValue} onChange={handleChange}>
            <option value="">--Select Department--</option>
            <option value="dep1">Dep 1</option>
            <option value="dep2">Dep 2</option>
            <option value="dep3">Dep 3</option>
          </select>
          <h1>Role</h1>
          <select 
            value={accountType} 
            onChange={(e) => setAccountType(e.target.value)}
          >
            <option value="">--Select Role--</option>
            <option value="mentee">Mentee</option>
            <option value="mentor">Mentor</option>
          </select>
          
        </form>
        
      </div>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>
            {account.first} {account.last} ({account.email}) - 
            <strong> {account.department} / {account.type}</strong>
          </li>
        ))}
      </ul>
      <button type="submit" className="submit-button">
            Create Account
          </button>
    </div>
  );
}

export default CreateAccount;



// import React, { useState } from 'react';
// import './CreateAccount.css';

// function CreateAccount() {
//   const [accounts, setAccounts] = useState([]);
//   const [first, setFirstName] = useState('');
//   const [last, setLastName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [accountType, setAccountType] = useState('mentee');
//   const [selectedValue, setSelectedValue] = useState('');

//   const handleChange = (event) => {
//     setSelectedValue(event.target.value);
//   };
//   const handleCreateAccount = () => {
//     if (first.trim() && email.trim()) {
//       // Add the new account to the list
//       setAccounts([...accounts, { first, email, type: accountType }]);
//       setFirstName(''); // Clear the fields after account creation
//       setEmail('');
//     }
//   };

//   return (
//     <div className="create-account">
//       <h1>Create Mentee/Mentor Account</h1>
//       <div className="rectangle">
//         <input
//             type="text"
//             value={first}
//             placeholder="Enter First first"
//         />

//         <input
//             type="text"
//             value={last}
//             placeholder="Enter Last first"
//         />
//         <input
//             type="text"
//             value={email}
//             placeholder="Enter Email first"
//         />
//         <input
//             type="text"
//             value={password}
//             placeholder="Enter Last first"
//         />
//       <select id="options" value={selectedValue} onChange={handleChange}>
//         <option value="">--Select--</option>
//         <option value="apple">Dep 1</option>
//         <option value="banana">Dep 2</option>
//         <option value="orange">Dep 3</option>
//       </select>
//       <select id="options" value={selectedValue} onChange={handleChange}>
//         <option value="">--Select--</option>
//         <option value="apple">Mentee</option>
//         <option value="banana">Mentor</option>
//       </select>
        
        
//       </div>
      
//       <button className="Submit">
//           Create Account
//       </button>




      
//       {/* <div className="account-form">
//         <input
//           type="text"
//           value={first}
//           onChange={(e) => setFirstName(e.target.value)}
//           placeholder="Enter first"
//         />
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Enter email"
//         />
//         <select
//           value={accountType}
//           onChange={(e) => setAccountType(e.target.value)}
//         >
//           <option value="mentee">Mentee</option>
//           <option value="mentor">Mentor</option>
//         </select>
//         <button onClick={handleCreateAccount}>Create Account</button>
//       </div>

//       <h2>Created Accounts</h2>
//       <ul>
//         {accounts.map((account, index) => (
//           <li key={index}>
//             {account.first} ({account.email}) - <strong>{account.type}</strong>
//           </li>
//         ))}
//       </ul> */}
//     </div>
//   );
// }

// export default CreateAccount;