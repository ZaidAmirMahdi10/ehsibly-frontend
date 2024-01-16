// Register.js
import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleRegister = async () => {
    try {
      //  This is for local testing
    //   const response = await axios.post('http://localhost:3001/register', {
    //     email,
    //     username,
    //     password,
    //     phoneNumber,
    //   });

      //  This is for Netlify
      const response = await axios.post('https://im-app-backend.netlify.app/.netlify/functions/register', {
        email,
        username,
        password,
        phoneNumber,
      });



      // Handle success, maybe redirect to login or show a success message
      console.log(response.data);
    } catch (error) {
      // Handle error, maybe show an error message to the user
      console.error('Registration error:', error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form>
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label>Username:</label>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Phone Number:</label>
        <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

        <button type="button" onClick={handleRegister}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
