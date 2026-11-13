document.addEventListener('DOMContentLoaded', () => {
  const API = 'https://navya-mart-api.psahu154.workers.dev';
  const btn = document.getElementById('addProductBtn');
  const rows = document.getElementById('productRows');

  async function loadProducts() {
    try {
      const res = await fetch(`${API}/api/products`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'लोड नहीं हुआ');
      rows.innerHTML = data.products.length ? data.products.map(p => `
        <tr>
          <td><div style="display:flex;align-items:center;gap:10px">
            ${p.image ? `<img src="${p.image}" alt="" style="width:48px;height:48px;object-fit:cover;border-radius:8px">` : ''}
            <span>${escapeHtml(p.name)}</span></div></td>
          <td>—</td><td>₹${Number(p.price).toLocaleString('en-IN')}</td>
          <td>—</td><td>${Number(p.stock || 0)}</td><td><span class="status-dot"></span> Active</td><td>—</td>
        </tr>`).join('') : '<tr><td colspan="7" class="table-empty">अभी कोई प्रोडक्ट सेव नहीं है।</td></tr>';
    } catch (e) {
      rows.innerHTML = `<tr><td colspan="7" class="table-empty">प्रोडक्ट लोड नहीं हुए: ${escapeHtml(e.message)}</td></tr>`;
    }
  }

  function escapeHtml(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  if (btn) btn.addEventListener('click', () => {
    const dialog = document.getElementById('simpleDialog');
    const body = document.getElementById('dialogBody');
    const title = document.getElementById('dialogTitle');
    const save = document.getElementById('dialogSave');
    title.textContent = 'Add New Product';
    body.innerHTML = `
      <label>Product Name<input name="name" required value="Trendy Graceful Men Sweatshirts | NAVYA MART"></label>
      <label>SKU (Optional)<input name="sku" placeholder="Optional SKU"></label>
      <label>Selling Price (₹)<input name="selling_price" type="number" min="1" required value="449"></label>
      <label>Purchase Cost (₹)<input name="purchase_cost" type="number" min="0" value="352"></label>
      <label>Stock Quantity<input name="stock" type="number" min="0" required value="10"></label>
      <label>Product Details<textarea name="description" rows="3" placeholder="Fabric, sizes, dispatch details...">Fleece / Cotton; Long Sleeves; Printed. Sizes S, M, L, XL, XXL.</textarea></label>
      <label>Product Photos (1 to 5 JPG, PNG or WEBP; max 5 MB each)<input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple required></label>
      <label>Admin API Key<input name="admin_key" type="password" autocomplete="current-password" required placeholder="Cloudflare ADMIN_API_KEY"></label>
      <p class="helper">फोटो Cloudflare R2 में और प्रोडक्ट D1 में सेव होगा। Purchase Cost ग्राहक को नहीं दिखाई जाएगी।</p>`;
    const form = body.closest('.dialog-card');
    save.onclick = async (event) => {
      event.preventDefault();
      const fd = new FormData(form);
      const photos = fd.getAll('images').filter(f => f && f.size);
      if (!photos.length || photos.length > 5) { AdminUI.showToast('1 से 5 फोटो चुनें।'); return; }
      const key = String(fd.get('admin_key') || '');
      const upload = new FormData();
      ['name','sku','selling_price','purchase_cost','stock','description'].forEach(k => upload.append(k, fd.get(k) || ''));
      photos.forEach(f => upload.append('images', f));
      save.disabled = true; save.textContent = 'Saving...';
      try {
        const res = await fetch(`${API}/api/admin/products`, {
          method: 'POST', headers: { Authorization: `Bearer ${key}` }, body: upload
        });
        const result = await res.json();
        if (!res.ok || !result.ok) throw new Error(result.error || 'प्रोडक्ट सेव नहीं हुआ।');
        dialog.close();
        AdminUI.showToast(result.message || 'प्रोडक्ट सेव हो गया।');
        await loadProducts();
      } catch (e) {
        AdminUI.showToast(e.message || 'Upload में समस्या आई।');
      } finally {
        save.disabled = false; save.textContent = 'Save Product';
      }
    };
    save.textContent = 'Save Product';
    dialog.showModal();
  });

  loadProducts();
  const cat = document.getElementById('addCategoryBtn');
  if (cat) cat.addEventListener('click', () => AdminUI.openDialog('Add Category', [
    {name:'name',label:'Category Name',required:true,placeholder:'e.g. Men'},
    {name:'slug',label:'Slug',placeholder:'e.g. men'}
  ], () => AdminUI.showToast('Category management इस चरण में शामिल नहीं है।')));
});
