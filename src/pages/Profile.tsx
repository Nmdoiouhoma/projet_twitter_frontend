import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface Tweet {
  id: number;
  content: string;
  createdAt: string;
  imageUrl: string | null;
  likesCount: number;
}

interface UserProfile {
  id: number;
  username: string;
  firstname: string | null;
  lastname: string | null;
  email: string;
  createdAt: string;
  tweets: Tweet[];
  tweetsCount: number;
  profileImageUrl?: string | null;
}

const Profile = () => {
  const { userName } = useParams<{ userName: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState({
    firstname: '',
    lastname: '',
    email: '',
    userName: '',
  });


  const [newProfileImage, setNewProfileImage] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleProfileImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image');
      return;
    }

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploadingImage(true);
      const res = await fetch('http://127.0.0.1:8000/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (!res.ok) {
        throw new Error('Erreur lors de l’upload de l’image');
      }
      const data = await res.json();
      setNewProfileImage(data.url); 
    } catch (e: any) {
      setError(e.message ?? 'Erreur inconnue lors de l’upload.');
    } finally {
      setUploadingImage(false);
    }
  };

  const token = localStorage.getItem('authToken');
  const currentUserName = localStorage.getItem('currentUserName');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (!userName) {
      setError('Nom d’utilisateur manquant.');
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(
          `http://127.0.0.1:8000/api/profile/${encodeURIComponent(userName)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (res.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error(data.message || 'Erreur lors du chargement du profil.');
        }

        const loaded = data.data as UserProfile;
        setProfile(loaded);

        setFormState({
          firstname: loaded.firstname ?? '',
          lastname: loaded.lastname ?? '',
          email: loaded.email,
          userName: loaded.username,
        });
      } catch (e: any) {
        setError(e.message ?? 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, userName, navigate]);

  const isOwnProfile = profile && currentUserName === profile.username;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !token) return;

    try {
      setSaving(true);
      const res = await fetch(
        `http://127.0.0.1:8000/api/user/${encodeURIComponent(profile.username)}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstname: formState.firstname,
            lastname: formState.lastname,
            email: formState.email,
            userName: formState.userName,
            profileImageUrl: newProfileImage ?? profile.profileImageUrl ?? null,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok || data.success === false) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du profil.');
      }

      const newUserName: string = data.data?.userName ?? formState.userName;

      // Mettre à jour le state local
      setProfile((prev) =>
        prev
          ? {
            ...prev,
            firstname: formState.firstname,
            lastname: formState.lastname,
            email: formState.email,
            username: newUserName,
            profileImageUrl: newProfileImage ?? prev.profileImageUrl ?? null,
          }
          : prev,
      );

      if (currentUserName === profile.username) {
        localStorage.setItem('currentUserName', newUserName);
        if (newProfileImage) {
          localStorage.setItem('currentUserProfileImage', newProfileImage);
        }
        if (newUserName !== profile.username) {
          navigate(`/profile/${encodeURIComponent(newUserName)}`, { replace: true });
        }
      }

      setIsEditing(false);
    } catch (e: any) {
      setError(e.message ?? 'Erreur inconnue lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      if (token) {
        await fetch('http://127.0.0.1:8000/api/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch {
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUserName');
      localStorage.removeItem('currentUserProfileImage');
      navigate('/login');
    }
  };

  if (loading) {
    return <p style={{ padding: '1rem' }}>Chargement du profil...</p>;
  }

  if (error) {
    return (
      <div style={{ padding: '1rem' }}>
        <p style={{ color: 'red' }}>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: '1rem' }}>
        <p>Aucun profil à afficher.</p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      {/* En-tête profil avec photo + infos */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        {profile.profileImageUrl && (
          <img
            src={profile.profileImageUrl}
            alt={profile.username}
            style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid #1DA1F2',
            }}
          />
        )}
        <div>
          <h1 style={{ margin: 0 }}>@{profile.username}</h1>
          <p style={{ margin: '0.25rem 0' }}>
            {profile.firstname} {profile.lastname}
          </p>
          <p style={{ margin: '0.25rem 0' }}>{profile.email}</p>
          <p style={{ margin: '0.25rem 0' }}>Inscrit le : {profile.createdAt}</p>
          <p style={{ margin: '0.25rem 0' }}>Nombre de tweets : {profile.tweetsCount}</p>
        </div>
      </div>

      {/* Actions pour son propre profil */}
      {isOwnProfile && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #1DA1F2',
              backgroundColor: 'white',
              color: '#1DA1F2',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {isEditing ? 'Annuler' : 'Update profile'}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              border: '1px solid #e0245e',
              backgroundColor: '#e0245e',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Formulaire d'édition du profil */}
      {isOwnProfile && isEditing && (
        <form
          onSubmit={handleSaveProfile}
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            borderRadius: '8px',
            border: '1px solid #ddd',
            backgroundColor: '#f9f9f9',
          }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            <label>
              Prénom
              <input
                type="text"
                name="firstname"
                value={formState.firstname}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label>
              Nom
              <input
                type="text"
                name="lastname"
                value={formState.lastname}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label>
              Nom d'utilisateur
              <input
                type="text"
                name="userName"
                value={formState.userName}
                onChange={handleChange}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
              />
            </label>
          </div>

          <div style={{ marginBottom: '0.75rem' }}>
            <label>
              Photo de profil
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageSelect}
                style={{ display: 'block', marginTop: '0.25rem' }}
                disabled={uploadingImage}
              />
            </label>
            {uploadingImage && (
              <small style={{ color: '#666' }}>Upload en cours...</small>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#1DA1F2',
              color: 'white',
              fontWeight: 'bold',
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </form>
      )}

      <hr style={{ margin: '1.5rem 0' }} />

      <h2>Tweets</h2>
      {profile.tweets.length === 0 && <p>Aucun tweet pour le moment.</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {profile.tweets.map((tweet) => (
          <li
            key={tweet.id}
            style={{
              borderBottom: '1px solid #ddd',
              padding: '1rem 0',
            }}
          >
            <p style={{ margin: '0.25rem 0' }}>{tweet.content}</p>
            {tweet.imageUrl && (
              <img
                src={tweet.imageUrl}
                alt="Tweet"
                style={{
                  width: '100%',
                  maxHeight: '300px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginTop: '0.5rem',
                }}
              />
            )}
            <small>
              ❤️ {tweet.likesCount} · {tweet.createdAt}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
