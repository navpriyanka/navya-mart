document.addEventListener('DOMContentLoaded',()=>{
  const b=document.getElementById('exportOrdersBtn');
  if(b) b.addEventListener('click',()=>AdminUI.showToast('Export तभी उपलब्ध होगा जब D1 से वास्तविक ऑर्डर लोड होंगे।'));
});