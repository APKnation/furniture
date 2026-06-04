import { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle, AlertCircle } from 'lucide-react';
import { getPage, updatePage } from '../../services/api';

export default function AdminPages() {
  const [selectedPage, setSelectedPage] = useState('aboutus');
  const [form, setForm] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await getPage(selectedPage);
      setForm({ title: res.data.title || '', content: res.data.content || '' });
    } catch {
      setForm({ title: '', content: '' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [selectedPage]);

  const notify = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePage(selectedPage, form);
      notify('Page updated successfully!');
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to update page', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-white">Content Pages</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage static pages like About Us and Contact Us</p>
      </div>

      {msg.text && (
        <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm ${msg.type === 'success' ? 'bg-green-900/30 border border-green-800/50 text-green-300' : 'bg-red-900/30 border border-red-800/50 text-red-300'}`}>
          {msg.type === 'success' ? <CheckCircle size={14}/> : <AlertCircle size={14}/>}
          {msg.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Page Selector Sidebar */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'aboutus', label: 'About Us' },
            { id: 'contactus', label: 'Contact Us' },
          ].map(p => (
            <button key={p.id} onClick={() => setSelectedPage(p.id)}
              className={`w-full text-left px-4 py-3 rounded-xl font-medium text-sm transition-all border ${
                selectedPage === p.id 
                  ? 'bg-primary-600 border-primary-500 text-white shadow-lg' 
                  : 'bg-dark-800 border-dark-600 text-gray-400 hover:text-white hover:border-dark-500'
              }`}>
              <span className="flex items-center gap-2"><FileText size={16}/>{p.label}</span>
            </button>
          ))}
        </div>

        {/* Content Editor */}
        <div className="md:col-span-3">
          <form onSubmit={handleSave} className="card p-6 space-y-5">
            {loading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-10 bg-dark-700 rounded-lg"/>
                <div className="h-44 bg-dark-700 rounded-lg"/>
                <div className="h-10 bg-dark-700 rounded-lg w-1/3"/>
              </div>
            ) : (
              <>
                <div>
                  <label className="label">Page Title</label>
                  <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="input" placeholder="e.g. About Cozy Furniture"/>
                </div>

                <div>
                  <label className="label">Page Content</label>
                  <textarea required value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="input resize-none h-64 leading-relaxed font-sans" placeholder="Write page content here..."/>
                </div>

                <button type="submit" disabled={saving} className="btn-primary w-full md:w-auto px-8 justify-center">
                  {saving ? <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/> : <><Save size={16}/> Save Changes</>}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
