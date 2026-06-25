import { useState } from 'react';
import { User, Phone, Lock, Save, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../services/api';
import { showError, showSuccess } from '../../utils/swal';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name || '', mobileNumber: user?.mobileNumber || '' });
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await updateProfile(profile);
      setUser(prev => ({ ...prev, ...profile }));
      showSuccess('Success', 'Profile updated successfully!');
    } catch (err) { showError('Update failed', err.response?.data?.message || 'Update failed'); }
    finally { setLoading(false); }
  };

  const handlePwChange = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await changePassword(pwForm);
      setPwForm({ oldPassword: '', newPassword: '' });
      showSuccess('Success', 'Password changed successfully!');
    } catch (err) { showError('Change failed', err.response?.data?.message || 'Password change failed'); }
    finally { setLoading(false); }
  };

  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'password', label: 'Change Password', icon: Shield },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">

      {/* Profile Hero */}
      <div className="bg-surface rounded-2xl p-8 mb-8 flex items-center gap-6 shadow-spotify-medium">
        <div className="w-20 h-20 bg-surface-elevated rounded-full flex items-center justify-center flex-shrink-0 shadow-spotify-medium">
          <User size={32} className="text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink">{user?.name}</h1>
          <p className="text-body text-sm mt-1">{user?.email}</p>
          <span className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-button">
            {user?.role === 'ADMIN' ? '⚡ Administrator' : '👤 Customer'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-surface p-1.5 rounded-2xl">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-button transition-all ${
              tab === id ? 'bg-primary text-on-primary shadow-spotify-medium' : 'text-body hover:text-ink'
            }`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-surface rounded-2xl p-7 space-y-5 shadow-spotify-medium">
          <div>
            <label className="label mb-1.5">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-5 top-3.5 text-muted" />
              <input required value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="input pl-12" placeholder="Enter your name" />
            </div>
          </div>
          <div>
            <label className="label mb-1.5">Mobile Number</label>
            <div className="relative">
              <Phone size={16} className="absolute left-5 top-3.5 text-muted" />
              <input value={profile.mobileNumber} onChange={e => setProfile({ ...profile, mobileNumber: e.target.value })}
                className="input pl-12" placeholder="+255 7XX XXX XXX" />
            </div>
          </div>
          <div>
            <label className="label mb-1.5">Email Address</label>
            <input value={user?.email || ''} disabled className="input opacity-50 cursor-not-allowed" />
            <p className="text-xs text-muted mt-1">Email cannot be changed.</p>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading
              ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent" />
              : <><Save size={16} /> Save Changes</>}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePwChange} className="bg-surface rounded-2xl p-7 space-y-5 shadow-spotify-medium">
          <div>
            <label className="label mb-1.5">Current Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-5 top-3.5 text-muted" />
              <input type="password" required value={pwForm.oldPassword}
                onChange={e => setPwForm({ ...pwForm, oldPassword: e.target.value })} className="input pl-12" placeholder="••••••••" />
            </div>
          </div>
          <div>
            <label className="label mb-1.5">New Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-5 top-3.5 text-muted" />
              <input type="password" required value={pwForm.newPassword}
                onChange={e => setPwForm({ ...pwForm, newPassword: e.target.value })} className="input pl-12" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading
              ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent" />
              : <><Lock size={16} /> Change Password</>}
          </button>
        </form>
      )}
    </div>
  );
}
