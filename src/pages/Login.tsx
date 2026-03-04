import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
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
    console.log('Login form data:', formData);

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login',
        formData
      );

      console.log('Login success:', response.data);

      // store token for protected routes
      localStorage.setItem('authToken', response.data.token);

      toast.success('Login successful!');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      const msg = error?.response?.data?.error || 'Error while logging in.';
      toast.error(msg);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Sign in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email or username:</label>
          <input
            type="text"
            id="email"
            name="email"
            required
            value={formData.email}
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
        <button type="submit">Sign in</button>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          style={{ marginLeft: '1rem' }}
        >
          Create account
        </button>
      </form>
    </div>
  );
};

export default Login;