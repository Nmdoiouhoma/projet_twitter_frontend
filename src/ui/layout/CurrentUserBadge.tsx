import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CurrentUserInfo {
  userName: string | null;
  profileImage: string | null;
}

const CurrentUserBadge = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<CurrentUserInfo>({
    userName: null,
    profileImage: null,
  });

  useEffect(() => {
    const userName = localStorage.getItem('currentUserName');
    const profileImage = localStorage.getItem('currentUserProfileImage');
    setUser({ userName, profileImage });
  }, []);

  if (!user.userName) {
    return null;
  }

  const handleClick = () => {
    navigate(`/profile/${user.userName}`);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '0.5rem 0.9rem',
        borderRadius: '999px',
        backgroundColor: '#ffffff',
        border: '1px solid #e1e8ed',
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
        cursor: 'pointer',
        zIndex: 1000,
      }}
    >
      {user.profileImage ? (
        <img
          src={user.profileImage}
          alt={user.userName || 'Profile'}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#1DA1F2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.9rem',
          }}
        >
          {user.userName.charAt(0).toUpperCase()}
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
        <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>@{user.userName}</span>
        <span style={{ fontSize: '0.75rem', color: '#657786' }}>View my profile</span>
      </div>
    </button>
  );
};

export default CurrentUserBadge;

