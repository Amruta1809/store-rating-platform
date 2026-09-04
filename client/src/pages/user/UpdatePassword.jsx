import { useState } from 'react';
import api from '../../api/axios';
import { validatePassword } from '../../validators';

export default function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [error, setError] = useState('');
  const [fieldError, setFieldError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    const passwordIssue = validatePassword(form.newPassword);
    setFieldError(passwordIssue || '');
    if (passwordIssue) return;

    setLoading(true);
    try {
      await api.put('/auth/password', form);
      setSuccess('Password updated successfully.');
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <h2 className="page-title">Update Password</h2>
      <p className="page-subtitle">Change your account password</p>

      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}

      <form className="card" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Current password</label>
          <input
            type="password"
            required
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>New password (8-16 chars, 1 uppercase, 1 special char)</label>
          <input
            type="password"
            required
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
          />
          {fieldError && <span className="form-error">{fieldError}</span>}
        </div>
        <button className="btn" type="submit" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
