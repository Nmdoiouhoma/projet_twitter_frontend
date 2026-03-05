import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    lastname: '',
    firstName: '',
    password: ''
  });

  const [profileImage, setProfileImage] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploading(true);
      const res = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload error response:', errorText);
        throw new Error('Upload error');
      }

      const data = await res.json();
      setProfileImage(data.url);
      setPreviewImage(data.url);
      toast.success('Profile image uploaded successfully!');
    } catch (e: any) {
      toast.error('Upload error: ' + e.message);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setProfileImage('');
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
        profileImageUrl: profileImage || null,
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
      
      let msg = 'Error while signing up.';
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const data = error.response?.data;

        if (data && typeof data === 'object') {
          msg =
            (data as any).error ||
            (data as any).message ||
            (data as any).detail ||
            msg;
        } else if (typeof data === 'string' && data.trim()) {
          msg = data;
        } else if (status) {
          msg = `Signup failed (HTTP ${status})`;
        }
      }

      toast.error(msg);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1rem' }}>
      <ToastContainer />
      <h1>Create your account</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="lastname">Last name:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            required
            value={formData.lastname}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="firstName">First name:</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            required
            value={formData.firstName}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Section upload d'image de profil */}
        <div style={{ marginBottom: '1rem', border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', backgroundColor: '#f9f9f9' }}>
          <label htmlFor="profileImage" style={{ fontWeight: 'bold' }}>
            Profile Picture (Optional)
          </label>
          <input
            ref={fileInputRef}
            id="profileImage"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginTop: '0.5rem',
              boxSizing: 'border-box',
            }}
          />
          {uploading && (
            <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
              Uploading...
            </small>
          )}
        </div>

        {previewImage && (
          <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
            <img
              src={previewImage}
              alt="Profile Preview"
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'cover',
                borderRadius: '50%',
                border: '2px solid #1DA1F2',
              }}
            />
            <button
              type="button"
              onClick={removeImage}
              style={{
                marginTop: '0.5rem',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#ff6b6b',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              ✕ Remove image
            </button>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#1DA1F2',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Sign up
          </button>
          <button
            type="button"
            onClick={() => navigate('/login')}
            style={{
              flex: 1,
              padding: '0.75rem',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

export default Signup;