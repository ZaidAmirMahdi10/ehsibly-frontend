// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleGoToGegister = async () => {
      navigate('/register');
    };

    const handleLogin = async () => {
      try {
        //  This is for local testing
        // const response = await axios.post('http://localhost:3001/login', {
        //   email,
        //   password,
        // });
        
        //  This is for Netlify
        const response = await axios.post('https://im-app-backend.netlify.app/.netlify/functions/login', {
            email,
            password,
        });



        const { token, user } = response.data;
  
        // Store the token, user ID, and email in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('email', user.email);
  
        navigate('/dashboard');
      } catch (error) {
        console.error('Login error:', error);
      }
    };
      
    return (
      <div className='onboarding'>
        <div className='main-wrapper'>
            <div>
                <h2 className='logo-text'>EHSIBLY</h2>
                <p className='intro-text'>
                    EHSIBLY, the cutting-edge application designed for efficient accounting and seamless invoice management, is revolutionizing the way organizations handle their financial processes. Tailored to meet the evolving needs of businesses, EHSIBLY offers a comprehensive suite of tools and features that empower users to navigate the complexities of financial management with ease.
                </p>
            </div>
            <form className='rigister-login-form' id='login-form'>
                <h2>Login</h2>
                <div className='entry'>
                    <div className='entry-item'>
                        <label className='entry-item-label'>Email:</label>
                        <input className='landing-input-feild' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className='entry'>
                    <div className='entry-item'>
                        <label className='entry-item-label'>Password:</label>
                        <input className='landing-input-feild' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                <button type="button" onClick={handleLogin}>
                  Login
                </button>
                
                <p className='login-or-register'>Or</p>

                <button type="button" onClick={handleGoToGegister}>
                  Register an account
                </button>
            </form>
        </div>
      </div>
    );
  };
  
  export default Login;
  