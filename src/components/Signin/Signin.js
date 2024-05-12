// src/components/SignIn/SignIn.js
import React, { useState } from 'react';
import { auth } from '../../firebase-config';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import '../Signin/Signin.css';
function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const validateForm = () => {
    let tempErrors = {};
    let formIsValid = true;

    if (!email) {
      formIsValid = false;
      tempErrors["email"] = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      formIsValid = false;
      tempErrors["email"] = "Email is not valid";
    }

    if (!password) {
      formIsValid = false;
      tempErrors["password"] = "Password is required";
    } else if (password.length < 8) {
      formIsValid = false;
      tempErrors["password"] = "Password must be at least 8 characters long";
    }
  setErrors(tempErrors);
  return formIsValid;
};

  const handleSignIn = async (event) => {
    event.preventDefault();
    if (validateForm()) {
    try  {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User logged in');
        navigate('/main');
       
      } catch (error) {
        console.error('Failed to sign in:', error.message);
        alert('Failed to sign in: ' + error.message); 
      }
    }
  };

  return (
    <div className="signin-container">
      <form className='formlogin' onSubmit={handleSignIn}>
        <h1>Sign In</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          
        />
        {errors.email && <p className='error-message'>{errors.email}</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          
        />
        {errors.password && <p className='error-message'>{errors.password}</p>}
        <p className='toLogin'>Or <a href='/singup' className='atoLogin'>Register</a> if you are dont have account</p>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}

export default SignIn;
