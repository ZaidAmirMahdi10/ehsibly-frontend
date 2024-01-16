// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        //  This is for local testing
        // const response = await axios.post('http://localhost:3001/login', {
        //   username,
        //   password,
        // });
        
        //  This is for Netlify
        const response = await axios.post('https://im-app-backend.netlify.app/.netlify/functions/login', {
            username,
            password,
        });



        const { token, user } = response.data;
  
        // Store the token, user ID, and username in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('username', user.username);
  
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
      }
    };
      
    return (
      <div>
        <h2>Login</h2>
        <form>
          <label>Username:</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
  
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
  
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
      </div>
    );
  };
  
  export default Login;
  