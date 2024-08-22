import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '../../utils/constant';
import 'react-toastify/dist/ReactToastify.css';
import './Auth.css';

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

    // Name validation: at least 3 characters, only letters and spaces
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(name)) {
      setNameError('Please enter a valid name.');
      isValid = false;
    }

    // Email validation: simple email regex
    if (!email) {
      setEmailError('Please enter a valid email.');
      isValid = false;
    }

    // Password validation: at least 8 characters, one uppercase, one lowercase, one number, one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError('Entered a weak password.');
      isValid = false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      setConfirmPasswordError(`Passwords doesn't match`);
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
                className={nameError ? 'inputError' : ''}
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
                className={emailError ? 'inputError' : ''}
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
                className={passwordError ? 'inputError' : ''}
              />
              {passwordError && <span className='errorText'>{passwordError}</span>}
            </div>
            <div className='inputWrapper'>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleInputChange(setConfirmPassword, setConfirmPasswordError)}
                className={confirmPasswordError ? 'inputError' : ''}
              />
              {confirmPasswordError && <span className='errorText'>{confirmPasswordError}</span>}
            </div>
          </div>
          <button type="submit" className='authButton'>Sign-Up</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
