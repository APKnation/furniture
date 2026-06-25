import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Package, Upload } from 'lucide-react';
import { getProducts, getCategories, addProduct, updateProduct, uploadProductImage, deleteProduct } from '../../services/api';
import { showError, showSuccess, confirmDelete } from '../../utils/swal';

const empty = { name:'', description:'', price:'', quantity:'', imagePath:'', categoryId:'' };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadProductImage(file);
      setForm(prev => ({ ...prev, imagePath: res.data.imagePath }));
      showSuccess('Success', 'Image uploaded successfully!');
    } catch (err) {
      showError('Upload failed', err.response?.data?.message || 'Image upload failed');
    } finally { setUploading(false); }
  };

  const fetchAll = () => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => { setProducts(p.data); setCategories(c.data); })
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetchAll(); }, []);
  const set = (f) => (e) => setForm({...form,[f]:e.target.value});

  const openAdd = () => { setForm(empty); setModal({ mode:'add' }); };
  const openEdit = (p) => { setForm({ name:p.name, description:p.description||'', price:p.price, quantity:p.quantity, imagePath:p.imagePath||'', categoryId:String(p.categoryId) }); setModal({ mode:'edit', id:p.id }); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity), categoryId: parseInt(form.categoryId) };
    try {
      if (modal.mode==='add') await addProduct(payload);
      else await updateProduct(modal.id, payload);
      showSuccess('Success', modal.mode==='add'?'Product added!':'Product updated!');
      setModal(null); fetchAll();
    } catch(err){ showError('Save failed', err.response?.data?.message||'Failed to save product'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!(await confirmDelete('product'))) return;
    try {
      await deleteProduct(id);
      showSuccess('Success', 'Product deleted successfully!');
      fetchAll();
    } catch(err) {
      showError('Error', err.response?.data?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="section-label mb-2">Manage</p>
          <h1 className="text-4xl font-medium text-ink tracking-[-0.03em]">Products</h1>
          <p className="text-body text-sm mt-1">{products.length} products</p>
        </div>
        <button onClick={openAdd} className="btn-primary btn-sm"><Plus size={14}/> Add Product</button>
      </div>

      <div className="bg-canvas-elevated border border-hairline overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-hairline">
                <th className="text-left px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">#</th>
                <th className="text-left px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Product</th>
                <th className="text-left px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Category</th>
                <th className="text-right px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Price</th>
                <th className="text-right px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Stock</th>
                <th className="text-right px-6 py-4 text-[10px] font-semibold text-muted uppercase tracking-[0.1em]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? [...Array(4)].map((_,i)=><tr key={i}><td colSpan={6} className="px-6 py-4"><div className="h-4 bg-hairline animate-pulse"/></td></tr>)
              : products.map((p,i)=>(
                <tr key={p.id} className="border-b border-hairline table-row-hover">
                  <td className="px-6 py-4 text-muted text-xs">{i+1}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imagePath
                        ? <img src={p.imagePath} alt={p.name} className="w-10 h-10 object-cover flex-shrink-0"/>
                        : <div className="w-10 h-10 bg-hairline flex items-center justify-center flex-shrink-0"><Package size={14} className="text-muted"/></div>
                      }
                      <span className="font-medium text-ink text-sm line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge bg-hairline text-body">{p.categoryName}</span>
                  </td>
                  <td className="px-6 py-4 text-right text-ink font-medium text-sm">{`TZS ${p.price?.toLocaleString('en-US')}`}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`badge border ${p.quantity>5?'text-semantic-success border-semantic-success':p.quantity>0?'text-accent-yellow border-accent-yellow':'text-semantic-warning border-semantic-warning'}`}>
                      {p.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={()=>openEdit(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline text-body hover:text-ink hover:border-muted-soft text-xs font-semibold uppercase tracking-[0.065em] transition-colors">
                      <Pencil size={11}/> Edit
                    </button>
                    <button onClick={()=>handleDelete(p.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-hairline text-semantic-warning hover:bg-semantic-warning hover:text-white hover:border-semantic-warning text-xs font-semibold uppercase tracking-[0.065em] transition-colors">
                      <Trash2 size={11}/> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-canvas-elevated border border-hairline w-full max-w-lg p-8 animate-slide-up my-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-ink">{modal.mode==='add'?'Add Product':'Edit Product'}</h2>
              <button onClick={()=>setModal(null)} className="text-muted hover:text-ink transition-colors"><X size={16}/></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div><label className="label">Name *</label><input required value={form.name} onChange={set('name')} className="input" placeholder="Product name"/></div>
              <div><label className="label">Description</label><textarea value={form.description} onChange={set('description')} className="input resize-none h-20" placeholder="Optional description"/></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label">Price (TZS) *</label><input required type="number" step="0.01" min="0" value={form.price} onChange={set('price')} className="input" placeholder="0.00"/></div>
                <div><label className="label">Stock Qty *</label><input required type="number" min="0" value={form.quantity} onChange={set('quantity')} className="input" placeholder="0"/></div>
              </div>
              <div>
                <label className="label">Product Image *</label>
                {form.imagePath ? (
                  <div className="border border-hairline bg-canvas p-3 flex items-center gap-4">
                    <img src={form.imagePath} alt="Preview" className="w-14 h-14 object-cover"/>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink truncate">{form.imagePath.split('/').pop()}</p>
                      <p className="text-xs text-muted">Uploaded</p>
                    </div>
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, imagePath: '' }))} className="text-semantic-warning hover:text-white transition-colors">
                      <X size={14}/>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="product-file-upload" required={modal.mode === 'add'}/>
                    <label htmlFor="product-file-upload" className="flex flex-col items-center justify-center border border-dashed border-hairline hover:border-muted-soft bg-canvas hover:bg-canvas-elevated p-8 cursor-pointer transition-all">
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <span className="animate-spin rounded-full h-6 w-6 border-2 border-muted border-t-transparent"/>
                          <span className="text-xs text-muted uppercase tracking-[0.065em]">Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <Upload className="text-muted mb-2" size={20}/>
                          <span className="text-sm text-body">Click to upload image</span>
                          <span className="text-xs text-muted mt-1 uppercase tracking-[0.065em]">PNG, JPG, JPEG up to 5MB</span>
                        </>
                      )}
                    </label>
                  </div>
                )}
              </div>
              <div>
                <label className="label">Category *</label>
                <select required value={form.categoryId} onChange={set('categoryId')} className="input">
                  <option value="">— Select Category —</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={()=>setModal(null)} className="btn-outline flex-1">Cancel</button>
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
