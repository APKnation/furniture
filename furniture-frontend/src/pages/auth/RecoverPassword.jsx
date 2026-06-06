import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sofa, Mail, ShieldQuestion, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { recoverPassword } from '../../services/api';

export default function RecoverPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', newPassword:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const set = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      await recoverPassword(form);
      setSuccess('Password reset! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) { setError(err.response?.data?.message || 'Recovery failed.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl items-center justify-center shadow-xl shadow-primary-900/40 mb-4">
            <Sofa size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-1">Answer your security question to reset</p>
        </div>
        <div className="card p-8">
          {error && <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 rounded-xl px-4 py-3 mb-5 text-red-300 text-sm"><AlertCircle size={15}/>{error}</div>}
          {success && <div className="flex items-center gap-2 bg-green-900/30 border border-green-800/50 rounded-xl px-4 py-3 mb-5 text-green-300 text-sm"><CheckCircle size={15}/>{success}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative"><Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
                <input type="email" required value={form.email} onChange={set('email')} className="input pl-10" placeholder="you@example.com"/>
              </div>
            </div>

            <div>
              <label className="label">New Password</label>
              <div className="relative"><Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
                <input type="password" required value={form.newPassword} onChange={set('newPassword')} className="input pl-10" placeholder="New password"/>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : 'Reset Password'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">← Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
