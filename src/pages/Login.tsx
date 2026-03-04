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

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/login',
        formData
      );

      console.log('Connexion réussie:', response.data);

      // on stocke le token pour les routes protégées
      localStorage.setItem('authToken', response.data.token);

      toast.success("Connexion réussie !");
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      console.error('Erreur connexion:', error);
      const msg = error?.response?.data?.error || "Erreur lors de la connexion.";
      toast.error(msg);
    }
  };

  return (
    <div>
      <ToastContainer />
      <h1>Page de connexion</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email ou nom d'utilisateur:</label>
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
          <label htmlFor="password">Mot de passe:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;