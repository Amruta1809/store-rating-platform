import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';
import RatingStars from '../../components/RatingStars.jsx';

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((res) => setUser(res.data.user))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load user'));
  }, [id]);

  return (
    <div className="container" style={{ maxWidth: 520 }}>
      <Link to="/admin/users" style={{ fontSize: 13 }}>
        ← Back to Users
      </Link>
      <h2 className="page-title" style={{ marginTop: 12 }}>
        User Detail
      </h2>

      {error && <div className="alert error">{error}</div>}

      {user && (
        <div className="card">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Address:</strong> {user.address || '—'}
          </p>
          <p>
            <strong>Role:</strong> <span className="badge">{user.role}</span>
          </p>
          {user.role === 'STORE_OWNER' && (
            <p>
              <strong>Store Rating:</strong>{' '}
              {user.rating != null ? (
                <>
                  <RatingStars value={user.rating} /> {user.rating.toFixed(1)} ({user.storeName})
                </>
              ) : (
                'No ratings yet'
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
