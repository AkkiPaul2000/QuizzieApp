import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../utils/auth';
import { BACKEND_URL } from '../../utils/constant';
import './Auth.css';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Basic validation
    let isValid = true;

    if (!email) {
      setEmailError(' Please enter your email.');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Plz enter your password.');
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/api/auth/login`, { email, password });
      login(response.data.token);  // Use login from useAuth
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || 'Login failed. Please check your credentials and try again.');
    }
  };

  const handleInputChange = (setter, errorSetter) => (e) => {
    setter(e.target.value);
    errorSetter('');  // Clear the specific error when the input changes
  };

  return (
    <div className='LoginForm'>
      <div className="loginDiv">
        <h2>QUIZZIE</h2>
        <div className='switchButtons'>
          <div className='switchButton2' onClick={() => navigate('/register')}>Sign Up</div>
          <div className='switchButton1'>Log In</div>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className='formInputs'>
            <div className='inputWrapper'>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChange(setEmail, setEmailError)}
                className={emailError ? 'inputError' : ''}
              />
              {emailError && <span className='errorText'>{emailError}</span>}
            </div>
            <div className='inputWrapper'>
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleInputChange(setPassword, setPasswordError)}
                className={passwordError ? 'inputError' : ''}
              />
              {passwordError && <span className='errorText'>{passwordError}</span>}
            </div>
          </div>
          <button type="submit" className='authButton'>Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
