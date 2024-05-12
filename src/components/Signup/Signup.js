import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import '../Signup/Signup.css'
function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('client');
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

    if (!confirmPassword) {
      formIsValid = false;
      tempErrors["confirmPassword"] = "Confirming password is required";
    } else if (password !== confirmPassword) {
      formIsValid = false;
      tempErrors["confirmPassword"] = "Passwords do not match";
    }


    setErrors(tempErrors);
    return formIsValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          email,
          phone,
          role
        });
        navigate('/singin'); 
      } catch (error) {
        console.error("Error in user registration:", error);
      }
    }
  };

  return (
    <div className="form_wrapper">
      
    <form className='form' onSubmit={handleSubmit}>
        <h1>Registration</h1>
      <input type="text" value={firstName} required onChange={(e) => setFirstName(e.target.value)} placeholder="First Name" />
      

      <input type="text" value={lastName} required onChange={(e) => setLastName(e.target.value)} placeholder="Last Name" />
      

      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      {errors.email && <p className='error-message'>{errors.email}</p>}

      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      {errors.password && <p className='error-message'>{errors.password}</p>}

      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
      {errors.confirmPassword && <p className='error-message'>{errors.confirmPassword}</p>}

      <input type="tel" value={phone} required onChange={(e) => setPhone(e.target.value)} placeholder="Phone Number" />
      

      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="client">Client</option>
        <option value="consultant">Consultant</option>
      </select>
        <p className='toLogin'>Or <a href='/singin' className='atoLogin'>login</a> if you are alredy registered</p>
      <button type="submit">Sign Up</button>
    </form>
    </div>
  );
}

export default Signup;

