const Login = () => {
  return (
    <div>
      <h1>Page de connexion</h1>
      <form>
        <div>
          <label htmlFor="email">Email ou nom d'utilisateur:</label>
          <input type="text" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Mot de passe:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Se connecter</button>
      </form>
    </div>
  )
}

export default Login
