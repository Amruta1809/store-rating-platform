import { useEffect, useState } from 'react';
import api from '../../api/axios';
import RatingStars from '../../components/RatingStars.jsx';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/store-owner/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  if (error) {
    return (
      <div className="container">
        <div className="alert error">{error}</div>
      </div>
    );
  }

  if (!data) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2 className="page-title">{data.store.name}</h2>
      <p className="page-subtitle">{data.store.address || 'No address on file'}</p>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div className="card stat-card">
          <div className="value">{data.averageRating ? data.averageRating.toFixed(1) : '—'}</div>
          <div className="label">
            Average Rating {data.averageRating && <RatingStars value={data.averageRating} />}
          </div>
        </div>
        <div className="card stat-card">
          <div className="value">{data.raters.length}</div>
          <div className="label">Users Who Rated This Store</div>
        </div>
      </div>

      <h3 style={{ marginTop: 28 }}>Ratings Received</h3>
      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Rating</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#64748b', padding: 24 }}>
                  No ratings submitted yet
                </td>
              </tr>
            )}
            {data.raters.map((r) => (
              <tr key={r.ratingId}>
                <td>{r.user?.name}</td>
                <td>{r.user?.email}</td>
                <td>
                  <RatingStars value={r.rating} /> {r.rating}
                </td>
                <td>{new Date(r.ratedAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
