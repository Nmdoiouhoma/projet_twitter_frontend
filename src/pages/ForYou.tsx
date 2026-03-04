import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
          // Token expiré ou invalide
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

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image');
      return;
    }
  
    // Direct file upload
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
      alert('Upload error: ' + e.message);
    }
  };
  
  const handleTweetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!tweetContent.trim()) {
      alert('Tweet cannot be empty');
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
      alert(e.message);
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

  return (
    <div
      style={{
        padding: '1rem',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1>For You</h1>
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
              <strong>@{tweet.author.username}</strong>
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
    </div>
  );
};

export default ForYou;