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
          <div className="inline-flex w-14 h-14 bg-primary items-center justify-center mb-5">
            <Sofa size={24} className="text-on-primary" />
          </div>
          <h1 className="text-3xl font-medium text-ink tracking-[-0.03em]">Reset Password</h1>
          <p className="text-body text-sm mt-2">Enter your email and a new password</p>
        </div>
        <div className="bg-canvas-elevated border border-hairline p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-4 text-muted"/>
                <input type="email" required value={form.email} onChange={set('email')} className="input pl-10" placeholder="you@example.com"/>
              </div>
            </div>
            <div>
              <label className="label">New Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-4 text-muted"/>
                <input type="password" required value={form.newPassword} onChange={set('newPassword')} className="input pl-10" placeholder="••••••••"/>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-ink hover:bg-muted-soft text-canvas text-sm font-bold px-8 py-3.5 rounded-md uppercase tracking-[0.1em] transition-colors duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed">
              {loading
                ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/>
                : 'Reset Password'
              }
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-hairline text-center">
            <Link to="/login" className="text-xs text-muted hover:text-ink uppercase tracking-[0.065em] transition-colors">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
