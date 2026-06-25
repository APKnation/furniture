import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sofa, Mail, Lock } from 'lucide-react';
import { recoverPassword } from '../../services/api';
import { showError, showSuccess } from '../../utils/swal';

export default function RecoverPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', newPassword:'' });
  const [loading, setLoading] = useState(false);
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await recoverPassword(form);
      await showSuccess('Password reset!', 'You can now login with your new password.');
      navigate('/login');
    } catch (err) {
      showError('Recovery failed', err.response?.data?.message || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight">Reset Password</h1>
        </div>
        <div className="bg-surface rounded-2xl shadow-spotify-heavy p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-5 top-3.5 text-muted"/>
                <input type="email" required value={form.email} onChange={set('email')} className="input pl-12" placeholder="you@gmail.com"/>
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-5 top-3.5 text-muted"/>
                <input type="password" required value={form.newPassword} onChange={set('newPassword')} className="input pl-12" placeholder="••••••••"/>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/>
                : 'Reset Password'
              }
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-hairline-soft text-center">
            <Link to="/login" className="text-sm font-bold text-body hover:text-primary uppercase tracking-button transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
