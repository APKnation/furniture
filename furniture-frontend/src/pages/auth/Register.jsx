import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sofa, User, Mail, Lock, Phone, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { register } from '../../services/api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'', mobileNumber:'' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      await register(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 py-10">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl items-center justify-center shadow-xl shadow-primary-900/40 mb-4">
            <Sofa size={28} className="text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Create account</h1>
          <p className="text-gray-400 mt-1">Join CozyFurniture today</p>
        </div>

        <div className="card p-8">
          {error && <div className="flex items-center gap-2 bg-red-900/30 border border-red-800/50 rounded-xl px-4 py-3 mb-5 text-red-300 text-sm"><AlertCircle size={15}/>{error}</div>}
          {success && <div className="flex items-center gap-2 bg-green-900/30 border border-green-800/50 rounded-xl px-4 py-3 mb-5 text-green-300 text-sm"><CheckCircle size={15}/>{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Full Name *</label>
                <div className="relative"><User size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
                  <input type="text" required value={form.name} onChange={set('name')} className="input pl-10" placeholder="John Doe"/>
                </div>
              </div>
              <div>
                <label className="label">Email *</label>
                <div className="relative"><Mail size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
                  <input type="email" required value={form.email} onChange={set('email')} className="input pl-10" placeholder="you@example.com"/>
                </div>
              </div>
            </div>
            <div>
              <label className="label">Password *</label>
              <div className="relative"><Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
                <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={set('password')} className="input pl-10 pr-10" placeholder="Min 6 characters"/>
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-3.5 text-gray-500 hover:text-gray-300">
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>
            <div>
              <label className="label">Mobile Number</label>
              <div className="relative"><Phone size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
                <input type="text" value={form.mobileNumber} onChange={set('mobileNumber')} className="input pl-10" placeholder="+1 234 567 8900"/>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
              {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
