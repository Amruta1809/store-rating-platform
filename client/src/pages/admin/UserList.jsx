import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import Table from '../../components/Table.jsx';
import FilterBar from '../../components/FilterBar.jsx';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'address', label: 'Address', sortable: false },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'rating', label: 'Rating', sortable: false },
  { key: 'actions', label: '', sortable: false },
];

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });
  const [error, setError] = useState('');

  async function load() {
    try {
      const res = await api.get('/admin/users', {
        params: { ...filters, sortBy: sort.sortBy, order: sort.order },
      });
      setUsers(res.data.users);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
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
          <h2 className="page-title">Users</h2>
          <p className="page-subtitle">All normal, admin, and store owner accounts</p>
        </div>
        <Link to="/admin/users/new" className="btn">
          + Add User
        </Link>
      </div>

      {error && <div className="alert error">{error}</div>}

      <FilterBar
        fields={[
          { key: 'name', label: 'Filter by name', type: 'text' },
          { key: 'email', label: 'Filter by email', type: 'text' },
          { key: 'address', label: 'Filter by address', type: 'text' },
          {
            key: 'role',
            label: 'Filter by role',
            type: 'select',
            options: ['ADMIN', 'NORMAL', 'STORE_OWNER'],
          },
        ]}
        values={filters}
        onChange={(key, value) => setFilters((f) => ({ ...f, [key]: value }))}
      />

      <div className="card" style={{ padding: 0 }}>
        <Table
          columns={COLUMNS}
          rows={users}
          sort={sort}
          onSort={handleSort}
          emptyMessage="No users match these filters"
          renderCell={(key, row) => {
            if (key === 'rating') return row.rating != null ? row.rating.toFixed(1) : '—';
            if (key === 'actions')
              return (
                <Link to={`/admin/users/${row.id}`} style={{ fontSize: 13 }}>
                  View
                </Link>
              );
            return row[key] ?? '—';
          }}
        />
      </div>
    </div>
  );
}
