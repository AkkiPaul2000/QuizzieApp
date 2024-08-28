import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../utils/constant';
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';
import validator from 'validator'; // Import the validator library


const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Error state variables for validation
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    // Basic validation
    let isValid = true;

    // Name validation: at least 3 characters
    if (name.trim().length < 3) {
      setNameError('Invalid name.');
      isValid = false;
    }

    // Email validation using validator.js
    if (!validator.isEmail(email)) {
      setEmailError('Invalid email.');
      isValid = false;
    }

    // Password validation: at least 8 characters
    if (password.length < 8) {
      setPasswordError('Weak Password.');
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords doesn't match");
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    try {
      await axios.post(`${BACKEND_URL}/api/auth/register`, { name, email, password });
      toast.success('Registration successful! You can now log in.');
      navigate('/login');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.error || 'Registration failed. Please try again.');
    }
  };

  // Reset errors on input change
  const handleInputChange = (setter, errorSetter) => (e) => {
    setter(e.target.value);
    errorSetter('');  // Clear the specific error when the input changes
  };

  return (
    <div className='LoginForm'>
      {console.log(1+nameError,1+emailError,passwordError,confirmPasswordError)}
      <div className="loginDiv">
        <h2>QUIZZIE</h2>
        <div className='switchButtons'>
          <div className='switchButton1'>Sign Up</div>
          <div className='switchButton2' onClick={() => navigate('/login')}>Log In</div>
        </div>
        <form onSubmit={handleSubmit} noValidate> {/* noValidate attribute disables HTML form validation */}
          <div className='formInputs'>
            <div className='inputWrapper'>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleInputChange(setName, setNameError)}
                style={{ border: nameError ? '1px solid red' : '' }} // Conditionally apply red border
                />
              {nameError && <span className='errorText'>{nameError}</span>}
            </div>
            <div className='inputWrapper'>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleInputChange(setEmail, setEmailError)}
                style={{ border: nameError ? '1px solid red' : '' }} // Conditionally apply red border
              />
              {emailError && <span className='errorText'>{emailError}</span>}
            </div>
            <div className='inputWrapper'>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleInputChange(setPassword, setPasswordError)}
                style={{ border: nameError ? '1px solid red' : '' }} // Conditionally apply red border
              />
              {passwordError && <span className='Pass1errorText'>{passwordError}</span>}
            </div>
            <div className='inputWrapper'>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword, setConfirmPasswordError)}
                style={{ border: nameError ? '1px solid red' : '' }} // Conditionally apply red border
              />
              {confirmPasswordError && <span className='Pass2errorText'>{confirmPasswordError}</span>}
            </div>
          </div>
          <button type="submit" className='authButton'>Sign-Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
