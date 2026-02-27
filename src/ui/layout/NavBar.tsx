import { NavLink } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav style={{ padding: '1rem', background: '#f0f0f0', display: 'flex', gap: '1rem' }}>
      <NavLink to="/">Accueil</NavLink>
      <NavLink to="/login">Connexion</NavLink>
      <NavLink to="/signup">Inscription</NavLink>
    </nav>
  );
}
export default NavBar;
