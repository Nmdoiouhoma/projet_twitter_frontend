import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
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
    console.log('Données du formulaire:', formData);

    // Appel API au backend avec axios
    try {
      // On adapte les clés envoyées pour correspondre au backend Symfony
      const payload = {
        email: formData.email,
        firstname: formData.firstName,
        lastname: formData.lastname,
        userName: formData.username,
        password: formData.password,
      };

      const response = await axios.post('http://127.0.0.1:8000/register', payload);
      console.log('Inscription réussie:', response.data);
      // ici tu peux par exemple rediriger vers la page de login
      // ou afficher un message de succès
    } catch (error) {
      console.error('Erreur inscription:', error);
      // ici tu peux gérer l'affichage d'un message d'erreur
    }
  };
  
  return (
    <div>
      <h1>Page d'inscription</h1>
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
          <label htmlFor="username">Nom d'utilisateur:</label>
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
          <label htmlFor="lastname">Nom:</label>
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
          <label htmlFor="firstName">Prénom:</label>
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
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  )
}

export default Signup