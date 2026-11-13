const API_BASE = "https://navya-mart-api.psahu154.workers.dev";

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
function card(p){return `<article class="product-card"><div class="product-image product-open" data-open-product="${escapeHTML(p.id)}" role="button" tabindex="0" aria-label="${escapeHTML(p.name)} की पूरी जानकारी देखें"><img loading="lazy" src="${escapeHTML(p.image||'')}" alt="${escapeHTML(p.name)}" onerror="this.style.display='none';this.parentElement.classList.add('image-failed')"><span class="product-tag">${escapeHTML(p.tag||'NEW')}</span><button class="wish" data-wish="${escapeHTML(p.id)}" aria-label="Wishlist">♡</button></div><div class="product-info"><div class="product-category">${escapeHTML(p.category||'')}</div><div class="product-name product-open" data-open-product="${escapeHTML(p.id)}" role="button" tabindex="0">${escapeHTML(p.name)}</div><div class="rating">★ ${escapeHTML(p.rating||'New')}</div><div class="price-line"><span class="price">${money(Number(p.price||0))}</span>${p.old&&Number(p.old)>Number(p.price)?`<del class="old-price">${money(Number(p.old))}</del><span class="discount">${escapeHTML(p.discount||'')}</span>`:''}</div><div class="cod-line">✓ Free Cash on Delivery</div><button class="add-btn" data-add="${escapeHTML(p.id)}">＋ Add to Cart</button><button class="explore-btn" data-open-product="${escapeHTML(p.id)}">Explore Product →</button></div></article>`}
function filtered(){const q=$('search').value.trim().toLowerCase();return products.filter(p=>(filter==='All Products'||p.category===filter)&&(`${p.name} ${p.category}`).toLowerCase().includes(q))}
function renderProducts(){const list=filtered();$('heading').innerHTML=(filter==='All Products'?'लोकप्रिय प्रोडक्ट्स':filter+' कलेक्शन')+' <span>✦</span>';$('products').innerHTML=list.length?list.map(card).join(''):'<div class="empty">कोई प्रोडक्ट नहीं मिला। दूसरा नाम खोजें।</div>';}
function renderNew(){ $('newArrivals').innerHTML=products.slice(2,6).map(card).join(''); }
function updateCount(){const n=Object.values(cart).reduce((a,b)=>a+b,0);$('count').textContent=n;$('bottomCount').textContent=n}
function total(){return products.reduce((s,p)=>s+p.price*(cart[p.id]||0),0)}
function renderCart(){const items=products.filter(p=>cart[p.id]);$('cartView').innerHTML=items.length?items.map(p=>`<div class="cart-row"><span>${p.name}<br><b>${money(p.price)}</b></span><span class="qty"><button data-qty="${p.id}" data-step="-1">−</button> ${cart[p.id]} <button data-qty="${p.id}" data-step="1">+</button></span></div>`).join('')+`<div class="cart-total"><span>Total</span><b>${money(total())}</b></div><p class="free-cod-note">✓ Free COD · कोई अतिरिक्त COD शुल्क नहीं</p><button class="checkout-btn" id="checkoutBtn">Proceed to Checkout</button>`:'<div class="empty">आपका Cart अभी खाली है।<br>अपनी पसंद के प्रोडक्ट जोड़ें।</div>';if($('checkoutBtn'))$('checkoutBtn').onclick=()=>{$('cartView').classList.add('hidden');$('checkoutView').classList.remove('hidden');$('modalTitle').textContent='Checkout · COD'};}
function openCart(){$('overlay').classList.add('show');$('cartView').classList.remove('hidden');$('checkoutView').classList.add('hidden');$('preview').classList.add('hidden');$('modalTitle').textContent='आपका Cart';renderCart()}


function openProductDetails(id){
 const p=products.find(item=>String(item.id)===String(id));
 if(!p)return;
 const photos=[...new Set([...(Array.isArray(p.images)?p.images:[]),p.image].filter(Boolean))];
 const gallery=photos.length?photos:[];
 const content=$('productDetailContent');
 content.innerHTML=`<div class="detail-gallery">
   <div class="detail-main-image"><img id="detailMainImage" src="${escapeHTML(gallery[0]||'')}" alt="${escapeHTML(p.name)}" ${gallery.length?'':'hidden'}>${gallery.length?'':'<div class="detail-no-image">फोटो उपलब्ध नहीं है</div>'}</div>
   ${gallery.length>1?`<div class="detail-thumbs">${gallery.map((src,i)=>`<button type="button" class="detail-thumb ${i===0?'active':''}" data-gallery-index="${i}" aria-label="फोटो ${i+1}"><img src="${escapeHTML(src)}" alt=""></button>`).join('')}</div>`:''}
 </div>
 <div class="detail-copy"><div class="detail-category">${escapeHTML(p.category||'')}</div><h2 id="detailName">${escapeHTML(p.name)}</h2>
 <div class="detail-price">${money(Number(p.price||0))}</div><p class="detail-stock">${Number(p.stock||0)>0?'✓ उपलब्ध स्टॉक: '+Number(p.stock)+' पीस':'स्टॉक की जानकारी के लिए संपर्क करें'}</p>
 <div class="detail-description"><h3>प्रोडक्ट की जानकारी</h3><p>${escapeHTML(p.description||'इस प्रोडक्ट का विस्तृत विवरण जल्द जोड़ा जाएगा।')}</p></div>
 <div class="detail-specs"><div><b>Category</b><span>${escapeHTML(p.category||'—')}</span></div><div><b>Price</b><span>${money(Number(p.price||0))}</span></div></div>
 <p class="detail-cod">✓ Free Cash on Delivery · कोई अतिरिक्त COD शुल्क नहीं</p>
 <div class="detail-actions"><button type="button" class="detail-add" data-detail-add="${escapeHTML(p.id)}">＋ Add to Cart</button><button type="button" class="detail-buy" data-detail-buy="${escapeHTML(p.id)}">Buy Now</button></div>
 <section class="reviews-section"><h3>Customer Reviews</h3><p>अभी इस प्रोडक्ट के लिए कोई ग्राहक समीक्षा उपलब्ध नहीं है।</p></section></div>`;
 $('productDetailOverlay').classList.add('show');
 $('productDetailOverlay').setAttribute('aria-hidden','false');
 document.body.classList.add('detail-open');
}
function closeProductDetails(){
 $('productDetailOverlay').classList.remove('show');
 $('productDetailOverlay').setAttribute('aria-hidden','true');
 document.body.classList.remove('detail-open');
}

document.addEventListener('click',e=>{
 const galleryThumb=e.target.closest('[data-gallery-index]');
 if(galleryThumb){const p=$('productDetailContent').querySelector('#detailMainImage');const current=products.find(x=>String(x.id)===String($('productDetailContent').querySelector('[data-detail-add]')?.dataset.detailAdd));const imgs=[...new Set([...(Array.isArray(current?.images)?current.images:[]),current?.image].filter(Boolean))];p.src=imgs[Number(galleryThumb.dataset.galleryIndex)]||p.src;$('productDetailContent').querySelectorAll('.detail-thumb').forEach(b=>b.classList.toggle('active',b===galleryThumb));return}
 const detailAdd=e.target.closest('[data-detail-add]');
 if(detailAdd){const id=detailAdd.dataset.detailAdd;cart[id]=(cart[id]||0)+1;updateCount();detailAdd.textContent='✓ Added to Cart';return}
 const detailBuy=e.target.closest('[data-detail-buy]');
 if(detailBuy){const id=detailBuy.dataset.detailBuy;cart[id]=(cart[id]||0)+1;updateCount();closeProductDetails();openCart();return}
 const openDetail=e.target.closest('[data-open-product]');
 if(openDetail){openProductDetails(openDetail.dataset.openProduct);return}
 const cat=e.target.closest('[data-cat]');
 if(cat){filter=cat.dataset.cat;renderCategories();renderProducts();$('catalog').scrollIntoView({behavior:'smooth'});return}
 const add=e.target.closest('[data-add]');
 if(add){const id=add.dataset.add;cart[id]=(cart[id]||0)+1;updateCount();add.textContent='✓ Added';return}
 const qty=e.target.closest('[data-qty]');
 if(qty){cart[qty.dataset.qty]+=Number(qty.dataset.step);if(cart[qty.dataset.qty]<=0)delete cart[qty.dataset.qty];updateCount();renderCart();return}
 const wish=e.target.closest('[data-wish]');
 if(wish){wish.classList.toggle('is-wished');wish.textContent=wish.classList.contains('is-wished')?'♥':'♡'}
});

$('cartButton').onclick=openCart;
$('bottomCart').onclick=openCart;
$('close').onclick=()=>$('overlay').classList.remove('show');
$('overlay').onclick=e=>{if(e.target===$('overlay'))$('overlay').classList.remove('show')};
$('search').oninput=renderProducts;
$('clearFilter').onclick=e=>{e.preventDefault();filter='All Products';$('search').value='';renderCategories();renderProducts()};
$('wishlistBtn').onclick=()=>alert('Wishlist में जोड़ने के लिए किसी प्रोडक्ट पर ♡ दबाएँ।');

// Real COD checkout: show success only after the Worker confirms the order was saved.
$('orderForm').onsubmit = async e => {
  e.preventDefault();

  const form = e.currentTarget;
  const submitButton = form.querySelector('button[type="submit"]');
  const data = new FormData(form);
  const items = products
    .filter(p => Number(cart[p.id] || 0) > 0)
    .map(p => ({ id: p.id, quantity: Number(cart[p.id]) }));

  if (!items.length) {
    alert('आपका Cart खाली है। पहले कोई Product जोड़ें।');
    return;
  }

  const payload = {
    name: String(data.get('name') || '').trim(),
    phone: String(data.get('phone') || '').trim(),
    pin: String(data.get('pin') || '').trim(),
    address: String(data.get('address') || '').trim(),
    items
  };

  if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = 'ऑर्डर सेव हो रहा है...';
  }

  try {
    const response = await fetch(`${API_BASE}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      throw new Error(result.error || 'ऑर्डर सेव नहीं हो सका।');
    }

    $('checkoutView').classList.add('hidden');
    $('preview').classList.remove('hidden');
    $('modalTitle').textContent = 'Order Confirmed';
    $('preview').innerHTML = `
      <p class="success">✓ आपका COD ऑर्डर सफलतापूर्वक दर्ज हो गया है।</p>
      <p><b>Order Number:</b> ${result.orderNumber}</p>
      <p><b>नाम:</b> ${escapeHTML(payload.name)}</p>
      <p><b>मोबाइल:</b> ${escapeHTML(payload.phone)}</p>
      <p><b>पिन कोड:</b> ${escapeHTML(payload.pin)}</p>
      <p><b>पता:</b> ${escapeHTML(payload.address)}</p>
      <p><b>कुल:</b> ${money(result.totalAmount)} · Free COD (कोई अतिरिक्त शुल्क नहीं)</p>
      <p>भुगतान डिलीवरी के समय करें।</p>
    `;

    cart = {};
    updateCount();
    form.reset();
  } catch (error) {
    alert(error.message || 'नेटवर्क समस्या के कारण ऑर्डर सेव नहीं हुआ। कृपया दोबारा प्रयास करें।');
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.textContent = 'Place Order';
    }
  }
};

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

async function loadPublishedProducts() {
  try {
    const response = await fetch(`${API_BASE}/api/products`);
    const result = await response.json();
    if (!response.ok || !result.ok || !Array.isArray(result.products)) return;
    const byId = new Map(products.map(p => [String(p.id), p]));
    for (const live of result.products) {
      const existing = byId.get(String(live.id));
      const mapped = {
        ...(existing || {}),
        ...live,
        id: live.id,
        name: live.name || existing?.name || 'Product',
        category: live.category || existing?.category || 'Men',
        price: Number(live.price || existing?.price || 0),
        old: Number(live.old || existing?.old || live.price || 0),
        discount: live.discount || existing?.discount || '',
        tag: live.tag || existing?.tag || 'NEW',
        rating: live.rating || existing?.rating || '',
        image: live.image || existing?.image || ''
      };
      if (existing) {
        const index = products.findIndex(p => String(p.id) === String(live.id));
        products[index] = mapped;
      } else {
        products.push(mapped);
      }
    }
  } catch (error) {
    // Keep the existing storefront catalog visible if the API is temporarily unavailable.
  }
  renderCategories();
  renderProducts();
  renderNew();
}

loadPublishedProducts();

document.addEventListener('keydown',e=>{
 if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-open-product]')){e.preventDefault();openProductDetails(e.target.dataset.openProduct)}
 if(e.key==='Escape'){closeProductDetails();$('imageLightbox').classList.remove('show')}
});
$('closeProductDetails').onclick=closeProductDetails;
$('productDetailOverlay').addEventListener('click',e=>{if(e.target===$('productDetailOverlay'))closeProductDetails()});
$('closeLightbox').onclick=()=>$('imageLightbox').classList.remove('show');
$('detailMainImage')?.addEventListener('click',()=>{});
document.addEventListener('click',e=>{
 if(e.target.id==='detailMainImage'&&e.target.src){$('lightboxImage').src=e.target.src;$('imageLightbox').classList.add('show')}
});
