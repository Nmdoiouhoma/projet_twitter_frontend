import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const NavBar = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUserName = localStorage.getItem('currentUserName');
    setUserName(storedUserName);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        left: '0',
        bottom: '0',
        top: '0',
        width: '230px',
        padding: '1.5rem 1rem',
        background: '#ffffff',
        borderRight: '1px solid #e1e8ed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '1rem',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h2
          style={{
            margin: 0,
            marginBottom: '1rem',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            color: '#1DA1F2',
          }}
        >
          TwitterClone
        </h2>
        <NavLink
          to="/"
          style={({ isActive }) => ({
            padding: '0.6rem 0.9rem',
            borderRadius: '999px',
            textDecoration: 'none',
            color: isActive ? '#1DA1F2' : '#14171A',
            fontWeight: isActive ? 'bold' : 500,
            backgroundColor: isActive ? '#e8f5fe' : 'transparent',
          })}
        >
          Home
        </NavLink>
        <NavLink
          to="/foryou"
          style={({ isActive }) => ({
            padding: '0.6rem 0.9rem',
            borderRadius: '999px',
            textDecoration: 'none',
            color: isActive ? '#1DA1F2' : '#14171A',
            fontWeight: isActive ? 'bold' : 500,
            backgroundColor: isActive ? '#e8f5fe' : 'transparent',
          })}
        >
          For You
        </NavLink>
        <NavLink
          to="/following"
          style={({ isActive }) => ({
            padding: '0.6rem 0.9rem',
            borderRadius: '999px',
            textDecoration: 'none',
            color: isActive ? '#1DA1F2' : '#14171A',
            fontWeight: isActive ? 'bold' : 500,
            backgroundColor: isActive ? '#e8f5fe' : 'transparent',
          })}
        >
          Following
        </NavLink>
        <NavLink
          to="/notifications"
          style={({ isActive }) => ({
            padding: '0.6rem 0.9rem',
            borderRadius: '999px',
            textDecoration: 'none',
            color: isActive ? '#1DA1F2' : '#14171A',
            fontWeight: isActive ? 'bold' : 500,
            backgroundColor: isActive ? '#e8f5fe' : 'transparent',
          })}
        >
          Notifications
        </NavLink>
        {userName && (
          <NavLink
            to={`/profile/${userName}`}
            style={({ isActive }) => ({
              padding: '0.6rem 0.9rem',
              borderRadius: '999px',
              textDecoration: 'none',
              color: isActive ? '#1DA1F2' : '#14171A',
              fontWeight: isActive ? 'bold' : 500,
              backgroundColor: isActive ? '#e8f5fe' : 'transparent',
            })}
          >
            Profile
          </NavLink>
        )}
      </div>
      <div
        style={{
          fontSize: '0.8rem',
          color: '#657786',
        }}
      >
        © {new Date().getFullYear()} TwitterClone
      </div>
    </nav>
  );
};

export default NavBar;


