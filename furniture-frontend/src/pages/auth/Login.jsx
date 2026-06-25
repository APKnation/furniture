import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { Sofa, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
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
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight">Welcome back</h1>
        </div>

        <div className="bg-surface rounded-2xl shadow-spotify-heavy p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-5 top-3.5 text-muted" />
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="input pl-12" placeholder="you@gmail.com" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-5 top-3.5 text-muted" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pl-12 pr-12" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-5 top-3.5 text-muted hover:text-ink transition-colors">
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/recover-password" className="text-xs text-muted hover:text-ink uppercase tracking-[0.065em] transition-colors">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading
                ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/>
                : <><LogIn size={16}/> Sign In</>
              }
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-hairline-soft flex items-center justify-center gap-2">
            <p className="text-sm text-body">No account yet?</p>
            <Link
              to={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-sm font-bold text-primary hover:text-primary-pressed transition-colors duration-150"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
