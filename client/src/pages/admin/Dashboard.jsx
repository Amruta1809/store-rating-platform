import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load dashboard'));
  }, []);

  return (
    <div className="container">
      <h2 className="page-title">Admin Dashboard</h2>
      <p className="page-subtitle">Platform-wide overview</p>

      {error && <div className="alert error">{error}</div>}

      {stats && (
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="value">{stats.totalUsers}</div>
            <div className="label">Total Users</div>
          </div>
          <div className="card stat-card">
            <div className="value">{stats.totalStores}</div>
            <div className="label">Total Stores</div>
          </div>
          <div className="card stat-card">
            <div className="value">{stats.totalRatings}</div>
            <div className="label">Total Ratings Submitted</div>
          </div>
        </div>
      )}
    </div>
  );
}
