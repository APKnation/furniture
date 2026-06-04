import { useState, useEffect } from 'react';
import { Plus, Pencil, X, Check, AlertCircle } from 'lucide-react';
import { getSubCategories, getCategories, addSubCategory, updateSubCategory } from '../../services/api';

export default function AdminSubCategories() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ name:'', categoryId:'' });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });

  const fetch = () => { getSubCategories().then(r => setItems(r.data)).catch(()=>{}).finally(()=>setLoading(false)); getCategories().then(r=>setCategories(r.data)).catch(()=>{}); };
  useEffect(()=>{ fetch(); },[]);
  const notify = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    try {
      if (modal.mode==='add') await addSubCategory({ name:form.name, categoryId: Number(form.categoryId) });
      else await updateSubCategory(modal.id, { name:form.name, categoryId: Number(form.categoryId) });
      notify(modal.mode==='add'?'Sub-Category added!':'Sub-Category updated!');
      setModal(null); fetch();
    } catch(err){ notify(err.response?.data?.message||'Save failed','error'); }
    finally{setSaving(false);}
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-white">Sub-Categories</h1><p className="text-gray-400 text-sm mt-0.5">{items.length} sub-categories</p></div>
        <button onClick={()=>{setForm({name:'',categoryId:''});setModal({mode:'add'});}} className="btn-primary btn-sm"><Plus size={16}/> Add Sub-Category</button>
      </div>
      {msg.text && <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm ${msg.type==='success'?'bg-green-900/30 border border-green-800/50 text-green-300':'bg-red-900/30 border border-red-800/50 text-red-300'}`}>{msg.type==='success'?<Check size={14}/>:<AlertCircle size={14}/>}{msg.text}</div>}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-dark-600 bg-dark-700/50">
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium">#</th>
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Name</th>
            <th className="text-left px-5 py-3.5 text-gray-400 font-medium">Category</th>
            <th className="text-right px-5 py-3.5 text-gray-400 font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {loading ? [...Array(3)].map((_,i)=><tr key={i}><td colSpan={4} className="px-5 py-4"><div className="h-4 bg-dark-700 rounded animate-pulse"/></td></tr>)
            : items.map((item,i)=>(
              <tr key={item.id} className="border-b border-dark-600/50 table-row-hover">
                <td className="px-5 py-4 text-gray-500">{i+1}</td>
                <td className="px-5 py-4 font-medium text-white">{item.name}</td>
                <td className="px-5 py-4"><span className="badge bg-dark-600 text-gray-300">{item.categoryName}</span></td>
                <td className="px-5 py-4 text-right">
                  <button onClick={()=>{setForm({name:item.name, categoryId:String(item.categoryId)});setModal({mode:'edit',id:item.id});}} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-900/40 text-primary-400 hover:bg-primary-900/70 text-xs font-medium transition-all">
                    <Pencil size={12}/> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-sm p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">{modal.mode==='add'?'Add Sub-Category':'Edit Sub-Category'}</h2>
              <button onClick={()=>setModal(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input" placeholder="e.g. Sofas"/></div>
              <div><label className="label">Category *</label>
                <select required value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} className="input">
                  <option value="">-- Select Category --</option>
                  {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3"><button type="button" onClick={()=>setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button><button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving?<span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>:'Save'}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
