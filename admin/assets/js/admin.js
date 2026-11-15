/* NAVYA MART Admin UI. Backend health is checked against the live Worker. */
(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const titles = {dashboard:'Dashboard',products:'Products',categories:'Categories',orders:'Orders',customers:'Customers',payments:'Payments',settings:'Website Settings'};
  window.AdminUI = {
    showToast(message) {
      const el = $('#toast'); if (!el) return;
      el.textContent = message; el.classList.add('show');
      clearTimeout(this.toastTimer); this.toastTimer = setTimeout(()=>el.classList.remove('show'),2600);
    },
    navigate(page) {
      if (!titles[page]) return;
      $$('.page').forEach(el=>el.classList.toggle('active',el.id===`page-${page}`));
      $$('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.page===page));
      $('#pageTitle').textContent=titles[page];
      $('#sidebar').classList.remove('open');
    },
    openDialog(title, fields, onSave) {
      const dialog=$('#simpleDialog'), body=$('#dialogBody');
      $('#dialogTitle').textContent=title;
      body.innerHTML=fields.map(f=>`<label>${f.label}<input name="${f.name}" type="${f.type||'text'}" ${f.required?'required':''} placeholder="${f.placeholder||''}"></label>`).join('');
      const form=$('.dialog-card',dialog);
      const save=$('#dialogSave');
      save.onclick=(event)=>{
        event.preventDefault();
        const data=Object.fromEntries(new FormData(form).entries());
        if(fields.some(f=>f.required&&!String(data[f.name]||'').trim())) { this.showToast('कृपया जरूरी जानकारी भरें।'); return; }
        onSave(data); dialog.close();
      };
      dialog.showModal();
    }
  };
  document.addEventListener('DOMContentLoaded',()=>{
    $$('.nav-link').forEach(b=>b.addEventListener('click',()=>AdminUI.navigate(b.dataset.page)));
    $$('[data-go]').forEach(b=>b.addEventListener('click',()=>AdminUI.navigate(b.dataset.go)));
    $('#menuBtn').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
    $('#todayDate').textContent=new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric'}).format(new Date());
    $('#year').textContent=new Date().getFullYear();
    const backendStatus=$('#backendStatus');
    if(backendStatus){
      fetch('https://navya-mart-api.psahu154.workers.dev/api/health')
        .then(async response=>{const data=await response.json();if(!response.ok||!data.ok||data.database!=='connected')throw new Error('unavailable');backendStatus.innerHTML='<span class="status-dot" style="background:#35c779"></span> Backend connected';})
        .catch(()=>{backendStatus.innerHTML='<span class="status-dot" style="background:#e5a33b"></span> Backend unavailable';});
    }
    $('#saveSettingsBtn').addEventListener('click',()=>AdminUI.showToast('Website Settings का स्थायी D1 save अभी उपलब्ध नहीं है।'));
  });
})();