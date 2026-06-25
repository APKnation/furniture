import { useState, useEffect } from 'react';
import { Search, User, Mail, Phone, Calendar, Plus, Pencil, Trash2, X } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-label mb-2">Manage</p>
          <h1 className="text-4xl font-medium text-ink tracking-[-0.03em]">Users</h1>
          <p className="text-body text-sm mt-1">{filteredUsers.length} registered users</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={14}/> Add User</button>
      </div>

      <div className="relative mb-6">
        <Search size={14} className="absolute left-4 top-4 text-muted"/>
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="input pl-10" placeholder="Search by name, email, or mobile number..."/>
      </div>

      <div className="bg-canvas-elevated border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[650px]">
            <thead>
              <tr className="border-b border-hairline">
                <th className="text-left px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Customer</th>
                <th className="text-left px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Contact</th>
                <th className="text-right px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Registered</th>
                <th className="text-right px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(3)].map((_, i) => <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-5 bg-hairline animate-pulse"/></td></tr>)
              ) : filteredUsers.map(u => (
                <tr key={u.id} className="border-b border-hairline table-row-hover">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-hairline flex items-center justify-center flex-shrink-0">
                        <User size={14} className="text-muted"/>
                      </div>
                      <div>
                        <p className="font-medium text-ink text-sm">{u.name}</p>
                        <p className="text-xs text-muted">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-body text-xs">
                      <Mail size={11} className="text-muted"/><span>{u.email}</span>
                    </div>
                    {u.mobileNumber && (
                      <div className="flex items-center gap-1.5 text-body text-xs">
                        <Phone size={11} className="text-muted"/><span>{u.mobileNumber}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex items-center gap-1.5 text-body text-xs">
                      <Calendar size={11} className="text-muted"/>
                      <span>{new Date(u.regDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => openEdit(u)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline text-body hover:text-ink hover:border-muted-soft text-xs font-semibold uppercase tracking-[0.065em] transition-colors">
                      <Pencil size={11}/> Edit
                    </button>
                    <button onClick={() => handleDelete(u.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline text-semantic-warning hover:bg-semantic-warning hover:text-white hover:border-semantic-warning text-xs font-semibold uppercase tracking-[0.065em] transition-colors">
                      <Trash2 size={11}/> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && !filteredUsers.length && (
          <div className="text-center py-16 text-body text-xs uppercase tracking-[0.065em]">No users found matching your search.</div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-elevated border border-hairline w-full max-w-md p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-ink">{modal.mode==='add'?'Add User':'Edit User'}</h2>
              <button onClick={()=>setModal(null)} className="text-muted hover:text-ink transition-colors"><X size={16}/></button>
            </div>
            {modal.mode === 'add' && (
              <div className="mb-5 px-4 py-3 border border-hairline text-xs text-body">
                New users will be created with default password: <span className="text-ink font-medium">password123</span>
              </div>
            )}
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Full Name *</label><input required value={form.name} onChange={set('name')} className="input" placeholder="John Doe"/></div>
              <div><label className="label">Email *</label><input required type="email" value={form.email} onChange={set('email')} className="input" placeholder="john@example.com"/></div>
              <div><label className="label">Mobile Number</label><input value={form.mobileNumber} onChange={set('mobileNumber')} className="input" placeholder="+1234567890"/></div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={()=>setModal(null)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/> : 'Save User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
