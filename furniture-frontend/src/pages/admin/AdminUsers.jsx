import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Calendar, Plus, Pencil, Trash2, X, Check, AlertCircle } from 'lucide-react';
import { getAdminUsers, addAdminUser, updateAdminUser, deleteAdminUser } from '../../services/api';
import { showError, showSuccess, confirmDelete } from '../../utils/swal';

const empty = { name:'', email:'', mobileNumber:'' };

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  const fetchUsers = () => {
    getAdminUsers().then(r => setUsers(r.data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchUsers(); }, []);

  const set = (f) => (e) => setForm({...form,[f]:e.target.value});

  const openAdd = () => { setForm(empty); setModal({ mode:'add' }); };
  const openEdit = (u) => { setForm({ name:u.name, email:u.email, mobileNumber:u.mobileNumber||'' }); setModal({ mode:'edit', id:u.id }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode==='add') await addAdminUser(form);
      else await updateAdminUser(modal.id, form);
      showSuccess('Success', modal.mode==='add'?'User added!':'User updated!');
      setModal(null); fetchUsers();
    } catch(err){ showError('Save failed', err.response?.data?.message||'Failed to save user'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!(await confirmDelete('user'))) return;
    try {
      await deleteAdminUser(id);
      showSuccess('Success', 'User deleted successfully!');
      fetchUsers();
    } catch(err) {
      showError('Error', err.response?.data?.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.mobileNumber?.includes(search)
  );

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Registered Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">{filteredUsers.length} total user(s)</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={16}/> Add User</button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3.5 top-3.5 text-gray-500"/>
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-10" placeholder="Search by name, email, or mobile number..."/>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-dark-600 bg-dark-700/50">
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Customer</th>
                <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Contact</th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Registered Date</th>
                <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => <tr key={i}><td colSpan={4} className="px-5 py-4"><div className="h-5 bg-dark-700 rounded animate-pulse"/></td></tr>)
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-dark-600/50 table-row-hover">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-900/40 rounded-xl flex items-center justify-center text-primary-400 flex-shrink-0">
                        <User size={16}/>
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.name}</p>
                        <p className="text-xs text-gray-500">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-gray-300 text-xs">
                      <Mail size={12} className="text-gray-500"/>
                      <span>{u.email}</span>
                    </div>
                    {u.mobileNumber && (
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                        <Phone size={12} className="text-gray-500"/>
                        <span>{u.mobileNumber}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right text-gray-400 text-xs">
                    <div className="inline-flex items-center gap-1.5">
                      <Calendar size={12} className="text-gray-500"/>
                      <span>{new Date(u.regDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(u)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-900/40 text-primary-400 hover:bg-primary-900/70 text-xs font-medium transition-all">
                      <Pencil size={12}/> Edit
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/70 text-xs font-medium transition-all">
                      <Trash2 size={12}/> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !filteredUsers.length && (
          <div className="text-center py-16 text-gray-500">No users found matching your search.</div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white text-lg">{modal.mode==='add'?'Add User':'Edit User'}</h2>
              <button onClick={()=>setModal(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            {modal.mode === 'add' && <div className="mb-4 text-xs text-amber-400 bg-amber-950/30 p-2 border border-amber-900/50 rounded-lg">New users will be created with the default password: <b>password123</b></div>}
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Full Name *</label><input required value={form.name} onChange={set('name')} className="input" placeholder="John Doe"/></div>
              <div><label className="label">Email *</label><input required type="email" value={form.email} onChange={set('email')} className="input" placeholder="john@example.com"/></div>
              <div><label className="label">Mobile Number</label><input value={form.mobileNumber} onChange={set('mobileNumber')} className="input" placeholder="+1234567890"/></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving?<span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>:'Save User'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
