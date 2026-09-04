import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { validateAddress, validateEmail } from '../../validators';

export default function AddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get('/admin/users', { params: { role: 'STORE_OWNER' } })
      .then((res) => setOwners(res.data.users))
      .catch(() => {});
  }, []);

  function validate() {
    const next = {
      name: !form.name || form.name.length > 60 ? 'Store name is required (max 60 characters)' : null,
      email: validateEmail(form.email),
      address: validateAddress(form.address),
    };
    setErrors(next);
    return Object.values(next).every((v) => !v);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    setSuccess('');
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = { ...form, ownerId: form.ownerId || undefined };
      await api.post('/admin/stores', payload);
      setSuccess('Store created successfully.');
      setTimeout(() => navigate('/admin/stores'), 800);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="page-title">Add Store</h2>
      <p className="page-subtitle">Register a new store on the platform</p>

      {serverError && <div className="alert error">{serverError}</div>}
      {success && <div className="alert success">{success}</div>}

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Store name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div className="form-group">
          <label>Address (max 400 characters)</label>
          <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          {errors.address && <span className="form-error">{errors.address}</span>}
        </div>
        <div className="form-group">
          <label>Store owner (optional)</label>
          <select value={form.ownerId} onChange={(e) => setForm({ ...form, ownerId: e.target.value })}>
            <option value="">No owner assigned</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>
          {owners.length === 0 && (
            <span style={{ fontSize: 12, color: '#64748b' }}>
              No STORE_OWNER accounts exist yet — create one first via "Add User".
            </span>
          )}
        </div>
        <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating...' : 'Create Store'}
        </button>
      </form>
    </div>
  );
}
