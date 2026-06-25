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
          <div className="inline-flex w-14 h-14 bg-primary items-center justify-center mb-5">
            <Sofa size={24} className="text-on-primary" />
          </div>
          <h1 className="text-3xl font-medium text-ink tracking-[-0.03em]">Welcome back</h1>
          <p className="text-body text-sm mt-2">Sign in to your APKnation account</p>
        </div>

        <div className="bg-canvas-elevated border border-hairline p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail size={14} className="absolute left-4 top-4 text-muted" />
                <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                  className="input pl-10" placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-4 text-muted" />
                <input type={showPw ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="input pl-10 pr-10" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-4 text-muted hover:text-ink transition-colors">
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <div className="text-right">
              <Link to="/recover-password" className="text-xs text-muted hover:text-ink uppercase tracking-[0.065em] transition-colors">
                Forgot password?
              </Link>
            </div>
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-ink hover:bg-muted-soft text-canvas text-sm font-bold px-8 py-3.5 rounded-md uppercase tracking-[0.1em] transition-colors duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed">
              {loading
                ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-canvas border-t-transparent"/>
                : <><LogIn size={14}/> Sign In</>
              }
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-hairline text-center">
            <p className="text-muted text-xs uppercase tracking-[0.065em] mb-2">No account yet?</p>
            <Link
              to={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-sm text-body hover:text-ink underline underline-offset-4 decoration-hairline hover:decoration-muted-soft transition-colors duration-150"
            >
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
