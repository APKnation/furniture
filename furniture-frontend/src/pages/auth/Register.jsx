import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sofa, User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';
import { register } from '../../services/api';
import { showError, showSuccess } from '../../utils/swal';

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/';
  const [form, setForm] = useState({ name:'', email:'', password:'', mobileNumber:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      await showSuccess('Account created!', 'You can now sign in.');
      navigate(`/login?redirect=${encodeURIComponent(redirectUrl)}`);
    } catch (err) {
      showError('Registration failed', err.response?.data?.message || 'Please try again.');
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas px-4 py-12">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-ink tracking-tight">Create Account</h1>
        </div>

        <div className="bg-surface rounded-2xl shadow-spotify-heavy p-8 sm:p-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-5 top-3.5 text-muted"/>
                  <input type="text" required value={form.name} onChange={set('name')} className="input pl-12" placeholder="Enter your name"/>
                </div>
              </div>
              <div>
                <label className="label">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-5 top-3.5 text-muted"/>
                  <input type="email" required value={form.email} onChange={set('email')} className="input pl-12" placeholder="you@gmail.com"/>
                </div>
              </div>
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <Lock size={14} className="absolute left-5 top-3.5 text-muted"/>
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')} className="input pl-12 pr-12" placeholder="••••••••"/>
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-5 top-3.5 text-muted hover:text-ink transition-colors">
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-5 top-3.5 text-muted"/>
                <input type="text" value={form.mobileNumber} onChange={set('mobileNumber')} className="input pl-12" placeholder="+255 7XX XXX XXX"/>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
              {loading
                ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/>
                : 'Create Account'
              }
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-hairline-soft flex items-center justify-center gap-2">
            <p className="text-sm text-body">Already have an account?</p>
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-sm font-bold text-primary hover:text-primary-pressed transition-colors duration-150"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
