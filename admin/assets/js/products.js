document.addEventListener('DOMContentLoaded', () => {
  const API='https://navya-mart-api.psahu154.workers.dev';
  const btn=document.getElementById('addProductBtn'), rows=document.getElementById('productRows');
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let cache=[];
  async function loadProducts(){
    try{
      const r=await fetch(`${API}/api/products`),d=await r.json();
      if(!r.ok||!d.ok)throw Error(d.error||'लोड नहीं हुआ');
      cache=d.products||[];
      rows.innerHTML=cache.length?cache.map(p=>`<tr>
        <td><div style="display:flex;align-items:center;gap:9px">${p.image?`<img src="${esc(p.image)}" style="width:46px;height:46px;object-fit:cover;border-radius:7px">`:''}<span>${esc(p.name)}</span></div></td>
        <td>${esc(p.sku||'—')}</td><td>₹${Number(p.price).toLocaleString('en-IN')}</td>
        <td>₹${Number(p.purchase_cost||0).toLocaleString('en-IN')}</td><td>${Number(p.stock||0)}</td>
        <td>${p.is_active?'Active':'Inactive'}</td>
        <td><button class="secondary-btn" data-edit="${esc(p.id)}">Edit</button> <button class="secondary-btn" data-delete="${esc(p.id)}">Delete</button></td>
      </tr>`).join(''):'<tr><td colspan="7" class="table-empty">अभी कोई प्रोडक्ट नहीं है।</td></tr>';
    }catch(e){rows.innerHTML=`<tr><td colspan="7" class="table-empty">${esc(e.message)}</td></tr>`}
  }
  function openForm(product=null){
    const dialog=document.getElementById('simpleDialog'),body=document.getElementById('dialogBody'),title=document.getElementById('dialogTitle'),save=document.getElementById('dialogSave');
    title.textContent=product?'Edit Product':'Add New Product';
    body.innerHTML=`<button type="button" class="dialog-close" id="productClose" aria-label="Close">×</button>
      <label>Product Name<input name="name" required value="${esc(product?.name||'')}"></label>
      <label>Category<select name="category" required><option value="">Select category</option>${['Men','Women','Kids','Home','Beauty','Sarees','Electronics','Puja Articles'].map(c=>`<option ${product?.category===c?'selected':''}>${c}</option>`).join('')}</select></label>
      <label>Source (जैसे Meesho)<input name="source" value="${esc(product?.source||'')}" placeholder="Meesho / Supplier"></label>
      <label>Supplier Product Code<input name="supplier_product_id" value="${esc(product?.supplier_product_id||'')}" placeholder="Supplier का product code"></label>
      <label>SKU (Optional)<input name="sku" value="${esc(product?.sku||'')}"></label>
      <label>Selling Price (₹)<input name="selling_price" type="number" min="1" required value="${product?.price??''}"></label>
      <label>Purchase Cost (₹)<input name="purchase_cost" type="number" min="0" value="${product?.purchase_cost??''}"></label>
      <label>Stock Quantity<input name="stock" type="number" min="0" required value="${product?.stock??''}"></label>
      <label>Product Details<textarea name="description" rows="4">${esc(product?.description||'')}</textarea></label>
      <label>Product Photos (1–5; JPG/PNG/WEBP, max 5 MB each)<input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple ${product?'':'required'}></label>
      <label>Admin API Key<input name="admin_key" type="password" required autocomplete="current-password"></label>
      <p class="helper">नई फोटो चुनने पर पुरानी gallery replace होगी। फोटो R2 में और विवरण D1 में सेव होंगे।</p>
      <div class="dialog-actions"><button type="button" class="secondary-btn" id="productCancel">Cancel</button><button type="button" class="primary-btn" id="productSave">Save Product</button></div>`;
    const form=body.closest('.dialog-card');
    const close=()=>dialog.close();
    body.querySelector('#productClose').onclick=close;body.querySelector('#productCancel').onclick=close;
    body.querySelector('#productSave').onclick=async()=>{
      const fd=new FormData(form), photos=fd.getAll('images').filter(f=>f&&f.size);
      if(!product&&(!photos.length||photos.length>5)){AdminUI.showToast('1 से 5 फोटो चुनें।');return}
      if(photos.length>5){AdminUI.showToast('अधिकतम 5 फोटो चुनें।');return}
      const upload=new FormData();
      ['name','category','source','supplier_product_id','sku','selling_price','purchase_cost','stock','description'].forEach(k=>upload.append(k,fd.get(k)||''));
      photos.forEach(f=>upload.append('images',f));
      const key=String(fd.get('admin_key')||'');
      const endpoint=product?`${API}/api/admin/products/${encodeURIComponent(product.id)}`:`${API}/api/admin/products`;
      const method=product?'PUT':'POST';
      const saveBtn=body.querySelector('#productSave');saveBtn.disabled=true;saveBtn.textContent='Saving...';
      try{
        const r=await fetch(endpoint,{method,headers:{Authorization:`Bearer ${key}`},body:upload}),d=await r.json();
        if(!r.ok||!d.ok)throw Error(d.error||'सेव नहीं हुआ');
        close();AdminUI.showToast(d.message||'प्रोडक्ट सेव हो गया।');loadProducts();
      }catch(e){AdminUI.showToast(e.message)}finally{saveBtn.disabled=false;saveBtn.textContent='Save Product'}
    };
    dialog.showModal();
  }
  if(btn)btn.onclick=()=>openForm();
  rows.addEventListener('click',async e=>{
    const edit=e.target.closest('[data-edit]'),del=e.target.closest('[data-delete]');
    if(edit){const p=cache.find(x=>String(x.id)===edit.dataset.edit);if(p)openForm(p)}
    if(del){const key=prompt('Admin API Key डालें (Cloudflare ADMIN_API_KEY की value):');if(!key)return;
      if(!confirm('क्या आप यह प्रोडक्ट हटाना चाहते हैं?'))return;
      try{const r=await fetch(`${API}/api/admin/products/${encodeURIComponent(del.dataset.delete)}`,{method:'DELETE',headers:{Authorization:`Bearer ${key}`}});const d=await r.json();if(!r.ok||!d.ok)throw Error(d.error||'Delete नहीं हुआ');AdminUI.showToast('प्रोडक्ट हट गया');loadProducts()}catch(e){AdminUI.showToast(e.message)}
    }
  });
  loadProducts();
});
