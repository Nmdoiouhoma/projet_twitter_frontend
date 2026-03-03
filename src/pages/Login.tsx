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
    console.log('Données du formulaire:', formData);
    
    // Appel API au backend avec axios
    try {
      const response = await axios.post('http://127.0.0.1:8000/login', formData);
      console.log('Connexion réussie:', response.data);

      toast.success("Connexion réussie !");
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Erreur connexion:', error);
      toast.error("Erreur lors de la connexion.");
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Page de connexion</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email ou nom d'utilisateur:</label>
          <input type="text" id="email" name="email" required value={formData.email} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input type="password" id="password" name="password" required value={formData.password} onChange={handleChange} />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}

export default Login
