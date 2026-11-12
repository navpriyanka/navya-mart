document.addEventListener('DOMContentLoaded',()=>{
  const b=document.getElementById('exportOrdersBtn');
  if(b) b.addEventListener('click',()=>AdminUI.showToast('Export तभी उपलब्ध होगा जब D1 से वास्तविक ऑर्डर लोड होंगे।'));
  const closeTop=document.getElementById('closeOrderDetails');
  const closeBottom=document.getElementById('closeOrderDetailsBottom');
  const dialog=document.getElementById('orderDetailsDialog');
  if(closeTop) closeTop.addEventListener('click',()=>dialog.close());
  if(closeBottom) closeBottom.addEventListener('click',()=>dialog.close());
  // Order rows, status updates and copy buttons will be populated from the secured Cloudflare Worker API.
});