import ProtectedRoute from '../ProtectedRoute';

const Home = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <div>
      <h1>Page d'accueil</h1>
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <p>Bienvenue sur la page d'accueil !</p>
      </ProtectedRoute>
    </div>
  )
}

export default Home
