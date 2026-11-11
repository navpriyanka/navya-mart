const categories = [
  {name:'Women',icon:'👗',image:'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=300&q=75'},
  {name:'Men',icon:'👔',image:'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=300&q=75'},
  {name:'Kids',icon:'🧸',image:'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=75'},
  {name:'Home',icon:'🏠',image:'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=300&q=75'},
  {name:'Beauty',icon:'💄',image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=300&q=75'},
  {name:'Sarees',icon:'🥻',image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=300&q=75'},
  {name:'Electronics',icon:'🎧',image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=75'},
  {name:'Puja Articles',icon:'🪔',image:'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=300&q=75'}
];
const products = [
 {id:1,name:'Classic Colour Block Sweatshirt',category:'Women',price:399,old:599,discount:'33% OFF',tag:'TRENDING',rating:'4.2',image:'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=700&q=78'},
 {id:2,name:'Kids Unicorn Style Backpack',category:'Kids',price:499,old:699,discount:'29% OFF',tag:'POPULAR',rating:'4.4',image:'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=78'},
 {id:3,name:'Elegant Daily Wear Saree',category:'Sarees',price:699,old:999,discount:'30% OFF',tag:'BESTSELLER',rating:'4.1',image:'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=700&q=78'},
 {id:4,name:'Men Casual Cotton Shirt',category:'Men',price:449,old:649,discount:'31% OFF',tag:'NEW',rating:'4.3',image:'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=78'},
 {id:5,name:'Modern Kitchen Storage Set',category:'Home',price:329,old:499,discount:'34% OFF',tag:'VALUE PICK',rating:'4.0',image:'https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=700&q=78'},
 {id:6,name:'Everyday Handbag',category:'Women',price:549,old:799,discount:'31% OFF',tag:'TRENDING',rating:'4.2',image:'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=78'},
 {id:7,name:'Beauty Essentials Set',category:'Beauty',price:299,old:449,discount:'33% OFF',tag:'POPULAR',rating:'4.1',image:'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=700&q=78'},
 {id:8,name:'Wireless Headphones',category:'Electronics',price:799,old:1199,discount:'33% OFF',tag:'NEW',rating:'4.3',image:'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=78'}
];
let filter='All Products', cart={};
const $=id=>document.getElementById(id), money=n=>'₹'+n.toLocaleString('en-IN');
function renderCategories(){
 const tiles=categories.map(c=>`<button class="category-card" data-cat="${c.name}"><img class="cat-photo" src="${c.image}" alt="${c.name}" loading="lazy" onerror="this.style.display='none'"><span class="cat-fallback">${c.icon}</span><span>${c.name}</span></button>`).join('');
 $('categories').innerHTML=tiles;
 $('quickCats').innerHTML=['All Products',...categories.map(c=>c.name)].map(c=>`<button class="${filter===c?'active':''}" data-cat="${c}">${c}</button>`).join('');
}
function card(p){return `<article class="product-card"><div class="product-image"><img loading="lazy" src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')"><span class="product-tag">${p.tag}</span><button class="wish" data-wish="${p.id}" aria-label="Wishlist">♡</button></div><div class="product-info"><div class="product-category">${p.category}</div><div class="product-name">${p.name}</div><div class="rating">★ ${p.rating}</div><div class="price-line"><span class="price">${money(p.price)}</span><del class="old-price">${money(p.old)}</del><span class="discount">${p.discount}</span></div><div class="cod-line">${money(p.price+35)} with COD</div><button class="add-btn" data-add="${p.id}">＋ Add to Cart</button></div></article>`}
function filtered(){const q=$('search').value.trim().toLowerCase();return products.filter(p=>(filter==='All Products'||p.category===filter)&&(`${p.name} ${p.category}`).toLowerCase().includes(q))}
function renderProducts(){const list=filtered();$('heading').innerHTML=(filter==='All Products'?'Trending Products':filter+' Collection')+' <span>✦</span>';$('products').innerHTML=list.length?list.map(card).join(''):'<div class="empty">कोई प्रोडक्ट नहीं मिला। दूसरा नाम खोजें।</div>';}
function renderNew(){ $('newArrivals').innerHTML=products.slice(2,6).map(card).join(''); }
function updateCount(){const n=Object.values(cart).reduce((a,b)=>a+b,0);$('count').textContent=n;$('bottomCount').textContent=n}
function total(){return products.reduce((s,p)=>s+p.price*(cart[p.id]||0),0)}
function renderCart(){const items=products.filter(p=>cart[p.id]);$('cartView').innerHTML=items.length?items.map(p=>`<div class="cart-row"><span>${p.name}<br><b>${money(p.price)}</b></span><span class="qty"><button data-qty="${p.id}" data-step="-1">−</button> ${cart[p.id]} <button data-qty="${p.id}" data-step="1">+</button></span></div>`).join('')+`<div class="cart-total"><span>Total</span><b>${money(total())}</b></div><button class="checkout-btn" id="checkoutBtn">Proceed to Checkout</button>`:'<div class="empty">आपका Cart अभी खाली है।<br>अपनी पसंद के प्रोडक्ट जोड़ें।</div>';if($('checkoutBtn'))$('checkoutBtn').onclick=()=>{$('cartView').classList.add('hidden');$('checkoutView').classList.remove('hidden');$('modalTitle').textContent='Checkout · COD'};}
function openCart(){$('overlay').classList.add('show');$('cartView').classList.remove('hidden');$('checkoutView').classList.add('hidden');$('preview').classList.add('hidden');$('modalTitle').textContent='आपका Cart';renderCart()}
document.addEventListener('click',e=>{const cat=e.target.closest('[data-cat]');if(cat){filter=cat.dataset.cat;renderCategories();renderProducts();$('catalog').scrollIntoView({behavior:'smooth'});return}const add=e.target.closest('[data-add]');if(add){const id=add.dataset.add;cart[id]=(cart[id]||0)+1;updateCount();add.textContent='✓ Added';return}const qty=e.target.closest('[data-qty]');if(qty){cart[qty.dataset.qty]+=Number(qty.dataset.step);if(cart[qty.dataset.qty]<=0)delete cart[qty.dataset.qty];updateCount();renderCart();return}const wish=e.target.closest('[data-wish]');if(wish){wish.classList.toggle('is-wished');wish.textContent=wish.classList.contains('is-wished')?'♥':'♡'}});
$('cartButton').onclick=openCart;$('bottomCart').onclick=openCart;$('close').onclick=()=>$('overlay').classList.remove('show');$('overlay').onclick=e=>{if(e.target===$('overlay'))$('overlay').classList.remove('show')};$('search').oninput=renderProducts;$('clearFilter').onclick=e=>{e.preventDefault();filter='All Products';$('search').value='';renderCategories();renderProducts()};$('wishlistBtn').onclick=()=>alert('Wishlist में जोड़ने के लिए किसी प्रोडक्ट पर ♡ दबाएँ।');
$('orderForm').onsubmit=e=>{e.preventDefault();const d=new FormData(e.target);$('checkoutView').classList.add('hidden');$('preview').classList.remove('hidden');$('modalTitle').textContent='Order Preview';$('preview').innerHTML=`<p class="success">✓ Demo order preview तैयार है। अभी वास्तविक ऑर्डर नहीं हुआ है।</p><p><b>नाम:</b> ${d.get('name')}</p><p><b>मोबाइल:</b> ${d.get('phone')}</p><p><b>पिन कोड:</b> ${d.get('pin')}</p><p><b>पता:</b> ${d.get('address')}</p><p><b>कुल:</b> ${money(total())} · COD</p>`};
renderCategories();renderProducts();renderNew();
