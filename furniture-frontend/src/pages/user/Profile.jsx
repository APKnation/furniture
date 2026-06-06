import { useState } from 'react';
import { User, MapPin, Phone, Lock, ShieldQuestion, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, changePassword } from '../../services/api';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [profile, setProfile] = useState({ name: user?.name||'', mobileNumber: user?.mobileNumber||'' });
  const [pwForm, setPwForm] = useState({ oldPassword:'', newPassword:'' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });

  const notify = (text, type='success') => { setMsg({ text, type }); setTimeout(() => setMsg({ text:'', type:'' }), 3000); };

  const handleProfileSave = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await updateProfile(profile);
      setUser(prev => ({ ...prev, ...profile }));
      notify('Profile updated successfully!');
    } catch (err) { notify(err.response?.data?.message || 'Update failed', 'error'); }
    finally { setLoading(false); }
  };

  const handlePwChange = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await changePassword(pwForm);
      setPwForm({ oldPassword:'', newPassword:'' });
      notify('Password changed successfully!');
    } catch (err) { notify(err.response?.data?.message || 'Password change failed', 'error'); }
    finally { setLoading(false); }
  };

  const setP = (f) => (e) => setProfile({ ...profile, [f]: e.target.value });

  const tabs = [{ id:'profile', label:'Profile' }, { id:'password', label:'Change Password' }];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-8">
        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-4">
          <User size={28} className="text-white"/>
        </div>
        <h1 className="font-display text-3xl font-bold text-white">{user?.name}</h1>
        <p className="text-gray-400">{user?.email}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 bg-dark-800 p-1 rounded-xl border border-dark-600 w-fit">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.id ? 'bg-primary-600 text-white shadow' : 'text-gray-400 hover:text-white'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {msg.text && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm ${msg.type === 'success' ? 'bg-green-900/30 border border-green-800/50 text-green-300' : 'bg-red-900/30 border border-red-800/50 text-red-300'}`}>
          {msg.type === 'success' ? <CheckCircle size={15}/> : <AlertCircle size={15}/>} {msg.text}
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="card p-6 space-y-5">
          <div>
            <label className="label">Full Name</label>
            <div className="relative"><User size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
              <input required value={profile.name} onChange={setP('name')} className="input pl-10" placeholder="Full Name"/>
            </div>
          </div>
          <div>
            <label className="label">Mobile Number</label>
            <div className="relative"><Phone size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
              <input value={profile.mobileNumber} onChange={setP('mobileNumber')} className="input pl-10" placeholder="Phone number"/>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <><Save size={16}/> Save Changes</>}
          </button>
        </form>
      )}

      {tab === 'password' && (
        <form onSubmit={handlePwChange} className="card p-6 space-y-5">
          <div>
            <label className="label">Current Password</label>
            <div className="relative"><Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
              <input type="password" required value={pwForm.oldPassword} onChange={e => setPwForm({...pwForm, oldPassword: e.target.value})} className="input pl-10" placeholder="Current password"/>
            </div>
          </div>
          <div>
            <label className="label">New Password</label>
            <div className="relative"><Lock size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
              <input type="password" required value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} className="input pl-10" placeholder="New password"/>
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
            {loading ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <><Lock size={16}/> Change Password</>}
          </button>
        </form>
      )}
    </div>
  );
}
