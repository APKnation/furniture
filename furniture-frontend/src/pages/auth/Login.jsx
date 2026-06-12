import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Sofa, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { showError, showSuccess } from '../../utils/swal';

export default function Login() {
  const { loginUser } = useAuth();
  const { syncCartAfterLogin } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await login(form);
      loginUser(res.data.token, res.data);
      if (res.data.role !== 'ADMIN') {
        await syncCartAfterLogin();
      }
      showSuccess('Welcome back!', 'Successfully signed in.');
      navigate(res.data.role === 'ADMIN' ? '/admin' : redirectUrl);
    } catch (err) {
      showError('Login Failed', err.response?.data?.message || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl items-center justify-center shadow-xl shadow-primary-900/40 mb-4">
            <Sofa size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Welcome back</h1>
          <p className="text-gray-400 mt-1">Sign in to your APKnation account</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="input pl-10" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pl-10 pr-10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/recover-password" className="text-sm text-primary-400 hover:text-primary-300 transition-colors">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : 'Sign In'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to={`/register?redirect=${encodeURIComponent(redirectUrl)}`} className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
