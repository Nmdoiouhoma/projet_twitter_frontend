import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Author {
  id: number;
  username: string;
}

interface Tweet {
  id: number;
  content: string;
  imageUrl: string | null;
  author: Author;
  likeCount: number;
  createdAt: string;
  likedByCurrentUser?: boolean;
}

const ForYou = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [tweetContent, setTweetContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Nouveaux états pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Author[]>([]);
  const [searching, setSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchFeed = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch('http://127.0.0.1:8000/api/tweets', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem('authToken');
          navigate('/login');
          return;
        }

        if (!res.ok) {
          throw new Error('Error while loading feed');
        }

        const data = await res.json();
        console.log('ForYou /api/tweets response:', data);
        const tweetsData: Tweet[] = Array.isArray(data)
          ? data
          : Array.isArray((data as any).results)
            ? (data as any).results
            : Array.isArray((data as any)['hydra:member'])
              ? (data as any)['hydra:member']
              : Object.values(data as any);
        setTweets(tweetsData);
      } catch (e: any) {
        setError(e.message ?? 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [token, navigate]);

  const handleSearchUser = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    try {
      setSearching(true);
      const res = await fetch(`http://127.0.0.1:8000/api/user/${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          // Adapter la forme de la réponse backend (userName -> username)
          const apiUser = data.data as { id: number; userName?: string; username?: string };
          const normalizedUser: Author = {
            id: apiUser.id,
            username: apiUser.username ?? apiUser.userName ?? '',
          };
          setSearchResults([normalizedUser]);
          setShowSearchResults(true);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(true);
      }
    } catch (e: any) {
      console.error('Search error:', e.message);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (username: string) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
    navigate(`/profile/${username}`);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image');
      return;
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Upload error response:', errorText);
        throw new Error('Upload error');
      }

      const data = await res.json();
      setImageUrl(data.url);
      setPreviewImage(data.url);
    } catch (e: any) {
      toast.error('Upload error: ' + e.message);
    }
  };
  
  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tweetContent.trim()) {
      toast.error('Tweet cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('http://127.0.0.1:8000/api/tweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: tweetContent.trim(),
          imageUrl: imageUrl || null,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Error while creating tweet');
        }

      const newTweet = await res.json();
      setTweets([newTweet, ...tweets]);
      setTweetContent('');
      setImageUrl('');
      setPreviewImage('');

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (e: any) {
      toast.error(e.message ?? 'Error while creating tweet');
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUrlChange = (url: string) => {
    setImageUrl(url);
    setPreviewImage(url);
  };

  const removeImage = () => {
    setImageUrl('');
    setPreviewImage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleToggleLike = async (tweet: Tweet) => {
    if (!token) {
      navigate('/login');
      return;
    }
  
    const currentlyLiked = !!tweet.likedByCurrentUser;
  
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/tweets/${tweet.id}/like`, {
        method: currentlyLiked ? 'DELETE' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (res.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/login');
        return;
      }
  
      // Lire d'abord comme texte
      const raw = await res.text();
      let data: any = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        // pas du JSON, on laisse data = null
      }
  
      if (!res.ok) {
        const backendError =
          data?.error ||
          data?.message ||
          raw || // si c'est une page HTML, tu verras au moins quelque chose dans les logs
          'Error while toggling like';
  
        // Cas particulier "Already liked"
        if (!currentlyLiked && res.status === 400 && backendError.includes('Already liked')) {
          // On tente un unlike direct
          const unlikeRes = await fetch(
            `http://127.0.0.1:8000/api/tweets/${tweet.id}/like`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
  
          if (unlikeRes.status === 401) {
            localStorage.removeItem('authToken');
            navigate('/login');
            return;
          }
  
          const unlikeRaw = await unlikeRes.text();
          let unlikeData: any = null;
          try {
            unlikeData = unlikeRaw ? JSON.parse(unlikeRaw) : null;
          } catch {
            // ignore
          }
  
          if (!unlikeRes.ok) {
            throw new Error(
              unlikeData?.error || unlikeData?.message || 'Error while unliking tweet',
            );
          }
  
          setTweets((prevTweets) =>
            prevTweets.map((t) =>
              t.id === tweet.id
                ? {
                    ...t,
                    likeCount:
                      typeof unlikeData?.likeCount === 'number'
                        ? unlikeData.likeCount
                        : Math.max(0, t.likeCount - 1),
                    likedByCurrentUser: false,
                  }
                : t,
            ),
          );
          toast.success('Like retiré');
          return;
        }
  
        throw new Error(backendError);
      }
  
      // Succès
      setTweets((prevTweets) =>
        prevTweets.map((t) =>
          t.id === tweet.id
            ? {
                ...t,
                likeCount:
                  typeof data?.likeCount === 'number'
                    ? data.likeCount
                    : t.likeCount + (currentlyLiked ? -1 : 1),
                likedByCurrentUser: !currentlyLiked,
              }
            : t,
        ),
      );
      toast.success(currentlyLiked ? 'Like retiré' : 'Tweet liké');
    } catch (e: any) {
      console.error('Like toggle error:', e);
      toast.error(e.message ?? 'Unknown error while toggling like');
    }
  };

  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1>For You</h1>
      <ToastContainer />

      {/* Barre de recherche */}
      <div
        style={{
          marginBottom: '1.5rem',
          position: 'relative',
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchUser(e.target.value)}
          placeholder="Search users by username..."
          style={{
            width: '100%',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '20px',
            fontFamily: 'inherit',
          }}
        />
        {searching && (
          <small style={{ color: '#666', marginTop: '0.25rem', display: 'block' }}>
            Searching...
          </small>
        )}
        {showSearchResults && searchResults.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderTop: 'none',
              borderRadius: '0 0 20px 20px',
              zIndex: 10,
            }}
          >
            {searchResults.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => handleSelectUser(user.username)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: 'none',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderBottom: '1px solid #eee',
                  fontSize: '1rem',
                }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f0f0f0';
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white';
                }}
              >
                @{user.username}
              </button>
            ))}
          </div>
        )}
        {showSearchResults && searchResults.length === 0 && searchQuery.trim() && !searching && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderTop: 'none',
              borderRadius: '0 0 20px 20px',
              padding: '0.75rem',
              color: '#666',
              textAlign: 'center',
              zIndex: 10,
            }}
          >
            No users found
          </div>
        )}
      </div>

      {/* Formulaire de tweet */}
      <form
        onSubmit={handleTweetSubmit}
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '1.5rem',
          backgroundColor: '#f9f9f9',
        }}
      >
        <textarea
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          placeholder="What's happening?"
          style={{
            width: '100%',
            height: '100px',
            padding: '0.75rem',
            fontSize: '1rem',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontFamily: 'inherit',
            resize: 'vertical',
          }}
          maxLength={280}
        />
        <div
          style={{
            marginTop: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <small style={{ color: '#666' }}>
            {tweetContent.length}/280 characters
          </small>
        </div>

        {previewImage && (
          <div style={{ marginBottom: '1rem' }}>
            <img
              src={previewImage}
              alt="Preview"
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
            <button
              type="button"
              onClick={() => removeImage()}
              style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem' }}
            >
              ✕ Remove image
            </button>
          </div>
        )}

        <div
          style={{
            marginBottom: '1rem',
            display: 'flex',
            gap: '0.5rem',
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              htmlFor="fileInput"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
              }}
            >
              Select an image
            </label>
            <input
              ref={fileInputRef}
              id="fileInput"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{
                width: '100%',
                padding: '0.5rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={imageUrl.startsWith('data:') ? '' : imageUrl}
            onChange={(e) => handleImageUrlChange(e.target.value)}
            placeholder="Or paste an image / GIF URL"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '0.9rem',
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="submit"
            disabled={submitting || !tweetContent.trim()}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#1DA1F2',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting || !tweetContent.trim() ? 0.6 : 1,
            }}
          >
            {submitting ? 'Posting...' : 'Tweet'}
          </button>
        </div>
      </form>

      {/* Liste des tweets */}
      <div>
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
              <div
                style={{
                  marginTop: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleLike(tweet)}
                  style={{
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: tweet.likedByCurrentUser ? '#e0245e' : '#666',
                  }}
                >
                  {tweet.likedByCurrentUser ? '♥' : '♡'}
                </button>
                <small>
                  {tweet.likeCount} · {tweet.createdAt}
                </small>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ForYou;