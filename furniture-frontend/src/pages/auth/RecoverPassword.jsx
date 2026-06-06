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
