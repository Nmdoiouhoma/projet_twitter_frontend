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
        padding: '1rem',
        background: '#f0f0f0',
        display: 'flex',
        gap: '1rem',
      }}
    >
      <NavLink to="/">Home</NavLink>
      <NavLink to="/foryou">For You</NavLink>
      <NavLink to="/following">Following</NavLink>
      {userName && <NavLink to={`/profile/${userName}`}>Profile</NavLink>}
    </nav>
  );
};

export default NavBar;


