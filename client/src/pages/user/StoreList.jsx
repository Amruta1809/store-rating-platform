import { useEffect, useState } from 'react';
import api from '../../api/axios';
import RatingStars from '../../components/RatingStars.jsx';
import FilterBar from '../../components/FilterBar.jsx';

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({});
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [savingId, setSavingId] = useState(null);

  async function load() {
    try {
      const res = await api.get('/stores', { params: filters });
      setStores(res.data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  async function handleRate(storeId, rating) {
    setSavingId(storeId);
    setMessage('');
    try {
      await api.put(`/ratings/${storeId}`, { rating });
      setMessage('Rating saved.');
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save rating');
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="container">
      <h2 className="page-title">Stores</h2>
      <p className="page-subtitle">Browse stores and submit or update your rating</p>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <FilterBar
        fields={[
          { key: 'name', label: 'Search by name', type: 'text' },
          { key: 'address', label: 'Search by address', type: 'text' },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
      />

      {stores.length === 0 && <p style={{ color: '#64748b' }}>No stores match your search.</p>}

      <div style={{ display: 'grid', gap: 14 }}>
        {stores.map((store) => (
          <div className="card" key={store.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ margin: '0 0 4px' }}>{store.name}</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>{store.address || 'No address on file'}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#64748b' }}>Overall Rating</div>
                <div>
                  {store.overallRating ? (
                    <>
                      <RatingStars value={store.overallRating} /> {store.overallRating.toFixed(1)}
                    </>
                  ) : (
                    'No ratings yet'
                  )}
                </div>
              </div>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '14px 0' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                {store.myRating ? 'Your rating (click to change):' : 'Submit your rating:'}
              </span>
              <RatingStars
                value={store.myRating || 0}
                size={22}
                onChange={(rating) => handleRate(store.id, rating)}
              />
              {savingId === store.id && <span style={{ fontSize: 12, color: '#64748b' }}>Saving...</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
