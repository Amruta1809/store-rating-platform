import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { validateName, validateAddress, validateEmail, validatePassword } from '../../validators';

export default function AddUser() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'NORMAL' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const next = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      address: validateAddress(form.address),
      password: validatePassword(form.password),
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
      await api.post('/admin/users', form);
      setSuccess('User created successfully.');
      setTimeout(() => navigate('/admin/users'), 800);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h2 className="page-title">Add User</h2>
      <p className="page-subtitle">Create a normal, admin, or store owner account</p>

      {serverError && <div className="alert error">{serverError}</div>}
      {success && <div className="alert success">{success}</div>}

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Full name (20-60 characters)</label>
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
          <label>Password (8-16 chars, 1 uppercase, 1 special char)</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="NORMAL">Normal User</option>
            <option value="ADMIN">System Administrator</option>
            <option value="STORE_OWNER">Store Owner</option>
          </select>
        </div>
        <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}
