import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type NotificationType = 'follow' | 'like' | string;

interface RawNotification {
  id: number;
  type?: NotificationType;
  createdAt?: string;
  isRead?: boolean;
  followerUsername?: string;
  follower?: { username?: string };
  likerUsername?: string;
  liker?: { username?: string };
  tweetContent?: string;
  tweet?: { content?: string };
  actorProfileImageUrl?: string | null;
}

interface NormalizedNotification {
  id: number;
  type: NotificationType;
  message: string;
  createdAt: string;
  isRead: boolean;
  actorUsername?: string;
  actorProfileImageUrl?: string | null;
}

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NormalizedNotification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchNotifications = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://127.0.0.1:8000/api/notifications', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          const msg =
            (data && (data.error || data.message)) ||
            'Erreur lors du chargement des notifications.';
          throw new Error(msg);
        }

        const raw: RawNotification[] = await res.json();

        const normalized: NormalizedNotification[] = raw.map((item) => {
          const type: NotificationType = item.type ?? 'unknown';
          const createdAt = item.createdAt ?? '';
          const isRead = item.isRead ?? false;

          let message = 'Notification';
           // Username de la personne à l'origine de la notif
          const actorUsername =
            item.followerUsername ||
            item.follower?.username ||
            item.likerUsername ||
            item.liker?.username ||
            'Un utilisateur';

          if (type === 'follow') {
            message = `${actorUsername} a commencé à vous suivre.`;
          } else if (type === 'like') {
            const tweetText =
              item.tweetContent ||
              item.tweet?.content ||
              'votre tweet';
            message = `${actorUsername} a aimé ${tweetText}.`;
          }

          return {
            id: item.id,
            type,
            message,
            createdAt,
            isRead,
            actorUsername,
            actorProfileImageUrl: item.actorProfileImageUrl ?? null,
          };
        });

        setNotifications(normalized);
      } catch (e: any) {
        const msg =
          e?.message ??
          'Erreur inconnue lors du chargement des notifications.';
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [token, navigate]);

  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <ToastContainer />
      <h1>Notifications</h1>

      {loading && <p>Chargement des notifications...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && notifications.length === 0 && (
        <p>Aucune notification pour le moment.</p>
      )}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {notifications.map((notif) => (
          <li
            key={notif.id}
            style={{
              borderBottom: '1px solid #ddd',
              padding: '0.75rem 0',
              backgroundColor: notif.isRead ? '#fff' : '#f5f8fa',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              {/* Avatar de la personne à l'origine de la notif */}
              {notif.actorProfileImageUrl ? (
                <img
                  src={notif.actorProfileImageUrl}
                  alt={notif.actorUsername || 'Utilisateur'}
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid #1DA1F2',
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
                  {(notif.actorUsername || 'U').charAt(0).toUpperCase()}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Pseudo à côté de la notif */}
                {notif.actorUsername && (
                  <span
                    style={{
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      marginBottom: '0.1rem',
                    }}
                  >
                    @{notif.actorUsername}
                  </span>
                )}
                <p style={{ margin: 0 }}>{notif.message}</p>
                {notif.createdAt && (
                  <small style={{ color: '#555' }}>{notif.createdAt}</small>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;

