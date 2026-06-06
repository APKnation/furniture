import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, AlertCircle, Package, Upload } from 'lucide-react';
import { getProducts, getCategories, addProduct, updateProduct, uploadProductImage, deleteProduct } from '../../services/api';

const empty = { name:'', description:'', price:'', quantity:'', imagePath:'', categoryId:'' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState({ text:'', type:'' });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadProductImage(file);
      setForm(prev => ({ ...prev, imagePath: res.data.imagePath }));
      notify('Image uploaded successfully!');
    } catch (err) {
      notify(err.response?.data?.message || 'Image upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  const fetchAll = () => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchAll(); }, []);
  const notify = (text, type='success') => { setMsg({text,type}); setTimeout(()=>setMsg({text:'',type:''}),3000); };
  const set = (f) => (e) => setForm({...form,[f]:e.target.value});

  const openAdd = () => { setForm(empty); setModal({ mode:'add' }); };
  const openEdit = (p) => { setForm({ name:p.name, description:p.description||'', price:p.price, quantity:p.quantity, imagePath:p.imagePath||'', categoryId:String(p.categoryId) }); setModal({ mode:'edit', id:p.id }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity), categoryId: parseInt(form.categoryId) };
    try {
      if (modal.mode==='add') await addProduct(payload);
      else await updateProduct(modal.id, payload);
      notify(modal.mode==='add'?'Product added!':'Product updated!');
      setModal(null); fetchAll();
    } catch(err){ notify(err.response?.data?.message||'Save failed','error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(id);
      notify('Product deleted successfully!');
      fetchAll();
    } catch(err) {
      notify(err.response?.data?.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="font-display text-2xl font-bold text-white">Products</h1><p className="text-gray-400 text-sm mt-0.5">{products.length} products</p></div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={16}/> Add Product</button>
      </div>

      {msg.text && <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm ${msg.type==='success'?'bg-green-900/30 border border-green-800/50 text-green-300':'bg-red-900/30 border border-red-800/50 text-red-300'}`}>{msg.type==='success'?<Check size={14}/>:<AlertCircle size={14}/>}{msg.text}</div>}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead><tr className="border-b border-dark-600 bg-dark-700/50">
              <th className="text-left px-4 py-3.5 text-gray-400 font-medium">#</th>
              <th className="text-left px-4 py-3.5 text-gray-400 font-medium">Product</th>
              <th className="text-left px-4 py-3.5 text-gray-400 font-medium">Category</th>
              <th className="text-right px-4 py-3.5 text-gray-400 font-medium">Price</th>
              <th className="text-right px-4 py-3.5 text-gray-400 font-medium">Stock</th>
              <th className="text-right px-4 py-3.5 text-gray-400 font-medium">Actions</th>
            </tr></thead>
            <tbody>
              {loading ? [...Array(4)].map((_,i)=><tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-dark-700 rounded animate-pulse"/></td></tr>)
              : products.map((p,i)=>(
                <tr key={p.id} className="border-b border-dark-600/50 table-row-hover">
                  <td className="px-4 py-3.5 text-gray-500">{i+1}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      {p.imagePath ? <img src={p.imagePath} alt={p.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0"/> : <div className="w-9 h-9 bg-dark-700 rounded-lg flex items-center justify-center flex-shrink-0"><Package size={14} className="text-dark-400"/></div>}
                      <span className="font-medium text-white line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5"><span className="badge bg-dark-600 text-gray-300">{p.categoryName}</span></td>
                            <td className="px-4 py-3.5 text-right text-primary-400 font-semibold">{`TZS ${p.price?.toLocaleString('en-US')}`}</td>
                  <td className="px-4 py-3.5 text-right"><span className={`badge border ${p.quantity>5?'bg-green-900/40 text-green-300 border-green-800/40':p.quantity>0?'bg-amber-900/40 text-amber-300 border-amber-800/40':'bg-red-900/40 text-red-300 border-red-800/40'}`}>{p.quantity}</span></td>
                  <td className="px-4 py-3.5 text-right space-x-2">
                    <button onClick={()=>openEdit(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-900/40 text-primary-400 hover:bg-primary-900/70 text-xs font-medium transition-all">
                      <Pencil size={12}/> Edit
                    </button>
                    <button onClick={()=>handleDelete(p.id)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/40 text-red-400 hover:bg-red-900/70 text-xs font-medium transition-all">
                      <Trash2 size={12}/> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="card w-full max-w-lg p-6 animate-slide-up my-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white text-lg">{modal.mode==='add'?'Add Product':'Edit Product'}</h2>
              <button onClick={()=>setModal(null)} className="text-gray-500 hover:text-white"><X size={18}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div><label className="label">Name *</label><input required value={form.name} onChange={set('name')} className="input" placeholder="Product name"/></div>
              <div><label className="label">Description</label><textarea value={form.description} onChange={set('description')} className="input resize-none h-20" placeholder="Optional description"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Price (TZS) *</label><input required type="number" step="0.01" min="0" value={form.price} onChange={set('price')} className="input" placeholder="0.00"/></div>
                <div><label className="label">Stock Qty *</label><input required type="number" min="0" value={form.quantity} onChange={set('quantity')} className="input" placeholder="0"/></div>
              </div>
              <div>
                <label className="label">Product Image *</label>
                {form.imagePath ? (
                  <div className="relative rounded-xl overflow-hidden border border-dark-600 bg-dark-800 p-2 flex items-center gap-4">
                    <img src={form.imagePath} alt="Preview" className="w-16 h-16 rounded-lg object-cover bg-dark-700"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{form.imagePath.split('/').pop()}</p>
                      <p className="text-xs text-gray-500">Uploaded successfully</p>
                    </div>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, imagePath: '' }))} className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-950/70 transition-colors">
                      <X size={16}/>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="product-file-upload" required={modal.mode === 'add'}/>
                    <label htmlFor="product-file-upload" className="flex flex-col items-center justify-center border-2 border-dashed border-dark-600 hover:border-primary-500 bg-dark-800/40 hover:bg-dark-800/80 rounded-xl p-6 cursor-pointer transition-all">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"/>
                          <span className="text-xs text-gray-400">Uploading image...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-gray-500 mb-2 hover:text-primary-400" size={24}/>
                          <span className="text-sm text-gray-300 font-medium">Click to upload image</span>
                          <span className="text-xs text-gray-500 mt-1">PNG, JPG, JPEG up to 5MB</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Category *</label>
                <select required value={form.categoryId} onChange={set('categoryId')} className="input">
                  <option value="">-- Select Category --</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={()=>setModal(null)} className="btn-secondary flex-1 justify-center">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">{saving?<span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"/>:'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
