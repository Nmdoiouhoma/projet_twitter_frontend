import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    lastname: '',
    firstName: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Signup form data:', formData);

    try {
      const payload = {
        email: formData.email,
        firstname: formData.firstName,
        lastname: formData.lastname,
        userName: formData.username,
        password: formData.password,
      };

      const response = await axios.post(
        'http://127.0.0.1:8000/api/register',
        payload
      );
      console.log('Signup success:', response.data);

      toast.success('Signup successful!');
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error: any) {
      console.error('Signup error:', error);
      const msg = error?.response?.data?.error || 'Error while signing up.';
      toast.error(msg);
    }
  };
  
  return (
    <div>
      <ToastContainer />
      <h1>Create your account</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            required 
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username" 
            name="username" 
            required 
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="lastname">Last name:</label>
          <input 
            type="text" 
            id="lastname" 
            name="lastname" 
            required 
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="firstName">First name:</label>
          <input 
            type="text" 
            id="firstName" 
            name="firstName" 
            required 
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            required 
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Sign up</button>
        <button
          type="button"
          onClick={() => navigate('/login')}
          style={{ marginLeft: '1rem' }}
        >
          Sign in
        </button>
      </form>
    </div>
  );
}

export default Signup;