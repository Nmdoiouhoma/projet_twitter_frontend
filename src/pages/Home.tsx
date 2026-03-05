import ProtectedRoute from '../ProtectedRoute';

const Home = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <div
      style={{
        padding: '1.5rem',
      }}
    >
      <ProtectedRoute isAuthenticated={isAuthenticated}>
        <header
          style={{
            marginBottom: '1.5rem',
            borderBottom: '1px solid #e1e8ed',
            paddingBottom: '1rem',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '1.6rem',
              fontWeight: 'bold',
            }}
          >
            Accueil
          </h1>
          <p style={{ margin: '0.5rem 0', color: '#657786' }}>
            Retrouvez rapidement ce qui se passe sur votre réseau.
          </p>
        </header>

        <section
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '1.5rem',
          }}
        >
          {/* Colonne principale */}
          <div>
            <div
              style={{
                border: '1px solid #e1e8ed',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#f5f8fa',
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontSize: '1.1rem',
                }}
              >
                Commencer
              </h2>
              <p style={{ marginBottom: '0.75rem', color: '#657786' }}>
                Utilisez les onglets <strong>For You</strong> et <strong>Following</strong> pour
                explorer votre fil personnalisé.
              </p>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: '1.2rem',
                  color: '#657786',
                  fontSize: '0.95rem',
                }}
              >
                <li>Publiez un nouveau tweet depuis l’onglet For You.</li>
                <li>Aimez les tweets qui vous plaisent.</li>
                <li>Visitez les profils pour découvrir d’autres utilisateurs.</li>
              </ul>
            </div>

            <div
              style={{
                border: '1px solid #e1e8ed',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: '#fff',
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  fontSize: '1.1rem',
                }}
              >
                Activité récente
              </h2>
              <p style={{ marginBottom: '0.5rem', color: '#657786' }}>
                Consultez vos dernières notifications pour voir qui vous suit, aime vos tweets
                ou interagit avec votre contenu.
              </p>
              <p style={{ fontSize: '0.9rem', color: '#657786' }}>
                Rendez-vous dans l’onglet <strong>Notifications</strong> pour en savoir plus.
              </p>
            </div>
          </div>

          {/* Colonne côté droit */}
          <aside>
            <div
              style={{
                border: '1px solid #e1e8ed',
                borderRadius: '12px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: '#f5f8fa',
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                }}
              >
                Astuce
              </h3>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#657786' }}>
                Mettez à jour votre photo de profil et vos informations dans l’onglet{' '}
                <strong>Profile</strong> pour que les autres vous reconnaissent plus facilement.
              </p>
            </div>

            <div
              style={{
                border: '1px solid #e1e8ed',
                borderRadius: '12px',
                padding: '1rem',
                backgroundColor: '#fff',
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  fontSize: '1rem',
                  marginBottom: '0.5rem',
                }}
              >
                Liens rapides
              </h3>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: '0.9rem',
                }}
              >
                <li style={{ marginBottom: '0.4rem' }}>• Ouvrir le fil For You</li>
                <li style={{ marginBottom: '0.4rem' }}>• Voir les comptes que vous suivez</li>
                <li style={{ marginBottom: '0.4rem' }}>• Accéder à votre profil</li>
              </ul>
            </div>
          </aside>
        </section>
      </ProtectedRoute>
    </div>
  )
}

export default Home
