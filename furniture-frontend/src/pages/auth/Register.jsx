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
          <div className="inline-flex w-14 h-14 bg-primary items-center justify-center mb-5">
            <Sofa size={24} className="text-on-primary" />
          </div>
          <h1 className="text-3xl font-medium text-ink tracking-[-0.03em]">Create Account</h1>
          <p className="text-body text-sm mt-2">Join APKnation today</p>
        </div>

        <div className="bg-canvas-elevated border border-hairline p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-4 text-muted"/>
                  <input type="text" required value={form.name} onChange={set('name')} className="input pl-10" placeholder="John Doe"/>
                </div>
              </div>
              <div>
                <label className="label">Email *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-4 text-muted"/>
                  <input type="email" required value={form.email} onChange={set('email')} className="input pl-10" placeholder="you@example.com"/>
                </div>
              </div>
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative">
                <Lock size={14} className="absolute left-4 top-4 text-muted"/>
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')} className="input pl-10 pr-10" placeholder="••••••••"/>
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-4 text-muted hover:text-ink transition-colors">
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-4 top-4 text-muted"/>
                <input type="text" value={form.mobileNumber} onChange={set('mobileNumber')} className="input pl-10" placeholder="+255 7XX XXX XXX"/>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-ink hover:bg-muted-soft text-canvas text-sm font-bold px-8 py-3.5 rounded-md uppercase tracking-[0.1em] transition-colors duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed mt-2">
              {loading
                ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-canvas border-t-transparent"/>
                : 'Create Account'
              }
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-hairline text-center">
            <p className="text-muted text-xs uppercase tracking-[0.065em] mb-2">Already have an account?</p>
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-sm text-body hover:text-ink underline underline-offset-4 decoration-hairline hover:decoration-muted-soft transition-colors duration-150"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
