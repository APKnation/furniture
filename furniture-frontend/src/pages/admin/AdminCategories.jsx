import { useState, useEffect } from 'react';
import { Plus, Pencil, X, Trash2 } from 'lucide-react';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../../services/api';
import { showError, showSuccess, confirmAction } from '../../utils/swal';

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:'' });
  const [saving, setSaving] = useState(false);

  const fetch = () => getCategories().then(r => setItems(r.data)).catch(() => {}).finally(() => setLoading(false));
  useEffect(() => { fetch(); }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode==='add') await addCategory(form);
      else await updateCategory(modal.id, form);
      showSuccess('Success', modal.mode==='add'?'Category added!':'Category updated!');
      setModal(null); fetch();
    } catch (err) { showError('Save failed', err.response?.data?.message || 'Failed to save category'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (await confirmAction('Delete Category?', 'Are you sure you want to delete this category?', 'Yes, delete it', true)) {
      try {
        await deleteCategory(id);
        showSuccess('Deleted', 'Category has been deleted.');
        fetch();
      } catch (err) {
        showError('Delete failed', err.response?.data?.message || 'Cannot delete this category.');
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-label mb-2">Manage</p>
          <h1 className="text-4xl font-medium text-ink tracking-[-0.03em]">Categories</h1>
          <p className="text-body text-sm mt-1">{items.length} categories</p>
        </div>
        <button onClick={() => { setForm({ name:'' }); setModal({ mode:'add' }); }} className="btn-primary btn-sm">
          <Plus size={14}/> Add Category
        </button>
      </div>

      <div className="bg-canvas-elevated border border-hairline overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline">
              <th className="text-left px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">#</th>
              <th className="text-left px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Name</th>
              <th className="text-right px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? [...Array(3)].map((_, i) => <tr key={i}><td colSpan={3} className="px-6 py-4"><div className="h-4 bg-hairline animate-pulse"/></td></tr>)
            : items.map((item, i) => (
              <tr key={item.id} className="border-b border-hairline table-row-hover">
                <td className="px-6 py-4 text-muted text-xs">{i+1}</td>
                <td className="px-6 py-4 font-medium text-ink">{item.name}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => { setForm({ name: item.name }); setModal({ mode:'edit', id: item.id }); }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline text-body hover:text-ink hover:border-muted-soft text-xs font-semibold uppercase tracking-[0.065em] transition-colors mr-2">
                    <Pencil size={11}/> Edit
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline text-semantic-warning hover:bg-semantic-warning hover:text-white hover:border-semantic-warning text-xs font-semibold uppercase tracking-[0.065em] transition-colors">
                    <Trash2 size={11}/> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-canvas-elevated border border-hairline w-full max-w-sm p-8 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-ink">{modal.mode==='add'?'Add Category':'Edit Category'}</h2>
              <button onClick={() => setModal(null)} className="text-muted hover:text-ink transition-colors"><X size={16}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div>
                <label className="label">Category Name *</label>
                <input required value={form.name} onChange={e=>setForm({name:e.target.value})} className="input" placeholder="e.g. Living Room"/>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setModal(null)} className="btn-outline flex-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-on-primary border-t-transparent"/> : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
