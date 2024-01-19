// Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigate = useNavigate();

  const handleGoBack = async () => {
    navigate('/login');
  };

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


    } catch (error) {
      // Handle error, maybe show an error message to the user
      console.error('Registration error:', error);
    }

    navigate('/login');
  };

  return (
    <div className='onboarding'>
        <div className='main-wrapper register-form'>
            <div>
                <h2 className='logo-text'>EHSIBLY</h2>
                <p className='intro-text'>
                    EHSIBLY, the cutting-edge application designed for efficient accounting and seamless invoice management, is revolutionizing the way organizations handle their financial processes. Tailored to meet the evolving needs of businesses, EHSIBLY offers a comprehensive suite of tools and features that empower users to navigate the complexities of financial management with ease.
                </p>
            </div>
            <form className='rigister-login-form'>
                <button className='back-button' type="button" onClick={handleGoBack}>BACK</button>
                <h2>Register</h2>
                <div className='entry'>
                    <div className='entry-item'>
                        <label className='entry-item-label'>Username:</label>
                        <input className='landing-input-feild' type="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>
                </div>

                <div className='entry'>
                    <div className='entry-item'>
                        <label className='entry-item-label'>Email:</label>
                        <input className='landing-input-feild' type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className='entry'>
                    <div className='entry-item'>
                        <label className='entry-item-label'>Phone Number:</label>
                        <input className='landing-input-feild' type="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
                    </div>
                </div>

                <div className='entry'>
                    <div className='entry-item'>
                        <label className='entry-item-label'>Password:</label>
                        <input className='landing-input-feild' type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                </div>

                <button type="button" onClick={handleRegister}>
                    Register
                </button>
            </form>
        </div>
    </div>
  );
};

export default Register;
