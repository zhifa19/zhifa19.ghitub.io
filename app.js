// Simple shop data
const products = [
  {id:1,name:'Paket Ayam Beku 1kg',price:45000,desc:'Ayam segar, beku dan siap masak',img:'assets/product1.svg'},
  {id:2,name:'Ikan Fillet 500g',price:38000,desc:'Fillet ikan tanpa tulang, kualitas premium',img:'assets/product2.svg'},
  {id:3,name:'Sayur Campur Beku 1kg',price:25000,desc:'Campuran sayur siap masak',img:'assets/product3.svg'},
  {id:4,name:'Steak Daging Beku 250g',price:60000,desc:'Steak empuk, beku vakum',img:'assets/product4.svg'}
];

// render products
const grid = document.getElementById('productGrid');
products.forEach(p=>{
  const card = document.createElement('div');
  card.className='card';
  card.innerHTML = `<img src="${p.img}" alt="${p.name}"><h3>${p.name}</h3><p>${p.desc}</p><div class="price">Rp${p.price.toLocaleString()}</div><div style="display:flex;gap:8px;margin-top:8px"><button class="btn" data-id="${p.id}">Add to cart</button><button class="btn secondary" onclick="quickView(${p.id})">Quick View</button></div>`;
  grid.appendChild(card);
});

function quickView(id){
  const p = products.find(x=>x.id===id);
  alert(p.name + '\n' + p.desc + '\nHarga: Rp' + p.price.toLocaleString());
}

// cart logic
let cart = JSON.parse(localStorage.getItem('lb_cart')||'[]');
updateCartUI();

document.addEventListener('click', e=>{
  if(e.target.matches('[data-id]')){
    const id = Number(e.target.dataset.id);
    addToCart(id);
  }
});

function addToCart(id){
  const p = products.find(x=>x.id===id);
  const entry = cart.find(x=>x.id===id);
  if(entry) entry.qty++;
  else cart.push({id:p.id,name:p.name,price:p.price,qty:1});
  saveCart();
  animateCart();
}

function saveCart(){
  localStorage.setItem('lb_cart',JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI(){
  document.getElementById('cartCount').textContent = cart.reduce((s,i)=>s+i.qty,0);
  const itemsDiv = document.getElementById('cartItems');
  itemsDiv.innerHTML='';
  cart.forEach(it=>{
    const el = document.createElement('div');
    el.style.display='flex';
    el.style.justifyContent='space-between';
    el.style.marginBottom='8px';
    el.innerHTML = `<div>${it.name} x${it.qty}</div><div>Rp${(it.price*it.qty).toLocaleString()}</div>`;
    itemsDiv.appendChild(el);
  });
  document.getElementById('cartTotal').textContent = 'Rp' + cart.reduce((s,i)=>s + i.price*i.qty,0).toLocaleString();
}

// cart panel toggle
const cartBtn = document.getElementById('cartBtn');
const cartPanel = document.getElementById('cartPanel');
const closeCart = document.getElementById('closeCart');
cartBtn.addEventListener('click', ()=>{ cartPanel.classList.toggle('hidden');});
closeCart.addEventListener('click', ()=>{ cartPanel.classList.add('hidden');});

// checkout modal
const checkoutBtn = document.getElementById('checkoutBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
checkoutBtn.addEventListener('click', ()=>{
  if(cart.length===0){ alert('Keranjang kosong! Tambahkan produk terlebih dahulu.'); return;}
  modal.classList.remove('hidden');
  document.getElementById('summary').innerHTML = cart.map(i=>`<div>${i.name} x${i.qty} — Rp${(i.price*i.qty).toLocaleString()}</div>`).join('');
});
closeModal.addEventListener('click', ()=> modal.classList.add('hidden'));

document.getElementById('checkoutForm').addEventListener('submit', function(e){
  e.preventDefault();
  // simple confirmation and clear cart
  alert('Terima kasih! Pesanan Anda telah diterima. Kami akan menghubungi untuk pembayaran.');
  cart = [];
  saveCart();
  modal.classList.add('hidden');
  cartPanel.classList.add('hidden');
});

// simple slider
let idx = 0;
const slides = document.querySelectorAll('.slide');
function showSlide(i){
  slides.forEach(s=>s.classList.remove('active'));
  slides[(i+slides.length)%slides.length].classList.add('active');
}
setInterval(()=>{ idx = (idx+1)%slides.length; showSlide(idx); }, 4500);

// small animation for add-to-cart
function animateCart(){
  cartBtn.animate([{transform:'scale(1)'},{transform:'scale(1.12)'},{transform:'scale(1)'}],{duration:420,easing:'ease'});
}

// BGM controls
const bgm = document.getElementById('bgm');
document.getElementById('playBgm').addEventListener('click', ()=>{ bgm.play().catch(()=>alert('Autoplay diblokir, silakan klik tombol play lagi.')) });
document.getElementById('pauseBgm').addEventListener('click', ()=>{ bgm.pause(); });

// small accessibility: close cart when clicking outside
document.addEventListener('click', (e)=>{
  if(!cartPanel.classList.contains('hidden')){
    if(!cartPanel.contains(e.target) && !cartBtn.contains(e.target)){
      //cartPanel.classList.add('hidden');
    }
  }
});
