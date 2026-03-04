import { NavLink } from 'react-router-dom';

const NavBar = () => {
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
    </nav>
  );
};

export default NavBar;


