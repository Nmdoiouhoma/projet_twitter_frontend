import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

interface Author {
  id: number;
  username: string;
}

interface Tweet {
  id: number;
  content: string;
  author: Author;
  imageUrl: string | null;
  likeCount: number;
  createdAt: string;
}

const Following = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem('authToken');
  const isAuthenticated = !!token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchFollowingTweets = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all tweets
        const allTweetsRes = await fetch('http://127.0.0.1:8000/api/tweets', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!allTweetsRes.ok) {
          throw new Error('Error while loading tweets');
        }

        const allTweetsData = await allTweetsRes.json();
        const allTweets: Tweet[] = Array.isArray(allTweetsData)
          ? allTweetsData
          : allTweetsData.results ?? [];

        // Fetch feed to know followed authors
        const feedRes = await fetch('http://127.0.0.1:8000/api/feed', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!feedRes.ok) {
          throw new Error('Error while loading feed');
        }

        const feedData = await feedRes.json();
        const feedTweets: Tweet[] = Array.isArray(feedData)
          ? feedData
          : feedData.results ?? [];

        const followedAuthorIds = new Set(feedTweets.map(t => t.author.id));

        // Following = tweets from followed users
        const followedTweets = allTweets.filter(
          (t) => followedAuthorIds.has(t.author.id),
        );

        setTweets(followedTweets);
      } catch (e: any) {
        setError(e.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingTweets();
  }, [isAuthenticated, token]);

  return (
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <div
        style={{
          padding: '1rem',
          maxWidth: '600px',
          margin: '0 auto',
        }}
      >
        <h1>Following</h1>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && tweets.length === 0 && (
          <p>No tweets yet.</p>
        )}
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tweets.map((tweet) => (
            <li
              key={tweet.id}
              style={{
                borderBottom: '1px solid #ddd',
                padding: '1rem 0',
              }}
            >
              <button
                type="button"
                onClick={() => navigate(`/profile/${tweet.author.username}`)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  margin: 0,
                  color: '#1DA1F2',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                @{tweet.author.username}
              </button>
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
                ❤️ {tweet.likeCount} · {tweet.createdAt}
              </small>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
};

export default Following;

