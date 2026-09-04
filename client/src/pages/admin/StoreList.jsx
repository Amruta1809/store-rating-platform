import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Table from '../../components/Table.jsx';
import FilterBar from '../../components/FilterBar.jsx';
import RatingStars from '../../components/RatingStars.jsx';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: false },
  { key: 'rating', label: 'Rating', sortable: false },
];

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [error, setError] = useState('');

  async function load() {
    try {
      const res = await api.get('/admin/stores', {
        params: { ...filters, sortBy: sort.sortBy, order: sort.order },
      });
      setStores(res.data.stores);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stores');
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  function handleSort(key) {
    setSort((prev) =>
      prev.sortBy === key ? { sortBy: key, order: prev.order === 'asc' ? 'desc' : 'asc' } : { sortBy: key, order: 'asc' }
    );
  }

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 className="page-title">Stores</h2>
          <p className="page-subtitle">All stores registered on the platform</p>
        </div>
        <Link to="/admin/stores/new" className="btn">
          + Add Store
        </Link>
      </div>

      {error && <div className="alert error">{error}</div>}

      <FilterBar
        fields={[
          { key: 'name', label: 'Filter by name', type: 'text' },
          { key: 'email', label: 'Filter by email', type: 'text' },
          { key: 'address', label: 'Filter by address', type: 'text' },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
      />

      <div className="card" style={{ padding: 0 }}>
        <Table
          columns={COLUMNS}
          rows={stores}
          sort={sort}
          onSort={handleSort}
          emptyMessage="No stores match these filters"
          renderCell={(key, row) => {
            if (key === 'rating')
              return row.rating ? (
                <span>
                  <RatingStars value={row.rating} /> {row.rating.toFixed(1)}
                </span>
              ) : (
                'No ratings yet'
              );
            return row[key] ?? '—';
          }}
        />
      </div>
    </div>
  );
}
