document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.getElementById('addProductBtn');
  if(btn) btn.addEventListener('click',()=>AdminUI.openDialog('Add Product',[
    {name:'name',label:'Product Name',required:true,placeholder:'Enter product name'},
    {name:'sku',label:'SKU',placeholder:'Optional SKU'},
    {name:'selling_price',label:'Selling Price (₹)',type:'number',required:true},
    {name:'purchase_cost',label:'Purchase Cost (₹)',type:'number'},
    {name:'stock',label:'Stock Quantity',type:'number'}
  ],()=>AdminUI.showToast('Product form preview है। Save करने के लिए Cloudflare API जोड़ना बाकी है।')));
  const cat=document.getElementById('addCategoryBtn');
  if(cat) cat.addEventListener('click',()=>AdminUI.openDialog('Add Category',[
    {name:'name',label:'Category Name',required:true,placeholder:'e.g. Women'},
    {name:'slug',label:'Slug',placeholder:'e.g. women'}
  ],()=>AdminUI.showToast('Category form preview है। D1 API कनेक्शन बाकी है।')));
});