const products=[
{name:'NOIR',vibe:'Dark & Mysterious',category:'men',price:2499,image:'assets/products_clean/noir.jpg'},
{name:'ÉCLAT',vibe:'Fresh & Radiant',category:'unisex',price:2299,image:'assets/products_clean/eclat.jpg'},
{name:'AMBRE',vibe:'Warm & Rich',category:'unisex',price:2599,image:'assets/products_clean/ambre.jpg'},
{name:'MYSTIQUE',vibe:'Sensual & Deep',category:'women',price:2699,image:'assets/products_clean/mystique.jpg'},
{name:'ROSÉ',vibe:'Soft & Floral',category:'women',price:2199,image:'assets/products_clean/rose.jpg'},
{name:'OUD',vibe:'Royal & Powerful',category:'men',price:2899,image:'assets/products_clean/oud.jpg'},
{name:'ÉLAN',vibe:'Elegant & Confident',category:'unisex',price:2399,image:'assets/products_clean/elan.jpg'},
{name:'ELIXIR',vibe:'Intense & Long-lasting',category:'unisex',price:2799,image:'assets/products_clean/elixir.jpg'}
];

const grid=document.getElementById('productGrid');
const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const toastEl=document.getElementById('toast');
let toastTimer;
function toast(message){clearTimeout(toastTimer);toastEl.textContent=message;toastEl.classList.add('show');toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2600)}

function render(filter='all'){
  grid.innerHTML=products.filter(p=>filter==='all'||p.category===filter).map(p=>`
    <article class="product-card">
      <div class="product-visual"><img class="product-bottle-image" src="${p.image}" alt="VELOURA ${p.name} perfume" loading="lazy"></div>
      <div class="product-info">
        <div class="product-top"><h3>${p.name}</h3><span class="price">${money(p.price)}</span></div>
        <p>${p.vibe}</p>
        <button class="add-btn" type="button" data-name="${p.name}">Add to Cart</button>
      </div>
    </article>`).join('');
  document.querySelectorAll('.add-btn').forEach(b=>b.addEventListener('click',()=>addToCart(b.dataset.name)));
}
render();

document.querySelectorAll('.filter').forEach(btn=>btn.addEventListener('click',()=>{
  document.querySelectorAll('.filter').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  render(btn.dataset.filter);
}));

// CART
const cart=[]; const drawer=document.getElementById('cartDrawer'); const backdrop=document.getElementById('backdrop');
function openCart(){drawer.classList.add('open');drawer.setAttribute('aria-hidden','false');backdrop.classList.add('active')}
function closeCart(){drawer.classList.remove('open');drawer.setAttribute('aria-hidden','true');backdrop.classList.remove('active')}
function addToCart(name){const item=cart.find(x=>x.name===name);if(item)item.qty++;else cart.push({name,qty:1});updateCart();openCart();toast(`${name} added to your bag.`);const count=document.getElementById('cartCount');count.classList.remove('cart-count-pulse');void count.offsetWidth;count.classList.add('cart-count-pulse')}
function updateCart(){
  document.getElementById('cartCount').textContent=cart.reduce((s,x)=>s+x.qty,0);
  const wrap=document.getElementById('cartItems');
  if(!cart.length){wrap.innerHTML='<div class="empty">Your cart is waiting for its first signature scent.</div>';document.getElementById('cartTotal').textContent=money(0);return;}
  wrap.innerHTML=cart.map(x=>{const p=products.find(p=>p.name===x.name);return `<div class="cart-row"><div class="cart-swatch"><img src="${p.image}" alt="${p.name}"></div><div><h4>${p.name}</h4><p>${money(p.price)} × ${x.qty}</p></div><button type="button" data-remove="${p.name}" aria-label="Remove ${p.name}">Remove</button></div>`}).join('');
  wrap.querySelectorAll('[data-remove]').forEach(b=>b.addEventListener('click',()=>removeFromCart(b.dataset.remove)));
  const total=cart.reduce((s,x)=>s+products.find(p=>p.name===x.name).price*x.qty,0);document.getElementById('cartTotal').textContent=money(total);
}
function removeFromCart(name){const i=cart.findIndex(x=>x.name===name);if(i>-1)cart.splice(i,1);updateCart();toast(`${name} removed from your bag.`)}
document.getElementById('cartButton').addEventListener('click',openCart);
document.getElementById('closeCart').addEventListener('click',closeCart);
backdrop.addEventListener('click',closeCart);

// MOBILE NAV
const mobileMenu=document.getElementById('mobileMenu');
document.getElementById('menuButton').addEventListener('click',()=>mobileMenu.classList.toggle('open'));
document.querySelectorAll('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>mobileMenu.classList.remove('open')));

// AUTH / PROFILE
const authModal=document.getElementById('authModal');
const authPanels={login:document.getElementById('loginPanel'),register:document.getElementById('registerPanel')};
const authTabs=document.querySelectorAll('.auth-tab');
const accountPanel=document.getElementById('accountPanel');
let storedUser=JSON.parse(localStorage.getItem('velouraUser')||'null');
let session=localStorage.getItem('velouraSession')==='active';

function setAuthMode(mode){
  authTabs.forEach(t=>t.classList.toggle('active',t.dataset.auth===mode));
  Object.entries(authPanels).forEach(([k,p])=>p.classList.toggle('active',k===mode));
}
authTabs.forEach(t=>t.addEventListener('click',()=>setAuthMode(t.dataset.auth)));
function openAuth(mode='login'){setAuthMode(mode);authModal.classList.add('open');authModal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');setTimeout(()=>document.querySelector(mode==='login'?'#loginIdentifier':'#regName')?.focus(),60)}
function closeAuth(){authModal.classList.remove('open');authModal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open')}
document.getElementById('accountButton').addEventListener('click',()=>session?openAccountPanel():openAuth('login'));
document.getElementById('mobileAuthButton').addEventListener('click',()=>{mobileMenu.classList.remove('open');session?openAccountPanel():openAuth('login')});
document.getElementById('closeAuth').addEventListener('click',closeAuth);
authModal.addEventListener('click',e=>{if(e.target===authModal)closeAuth()});
document.querySelectorAll('.show-pass').forEach(btn=>btn.addEventListener('click',()=>{const input=document.getElementById(btn.dataset.target);input.type=input.type==='password'?'text':'password';btn.textContent=input.type==='password'?'Show':'Hide'}));

document.getElementById('useLocation').addEventListener('click',()=>{
  const btn=document.getElementById('useLocation');
  if(!navigator.geolocation){toast('Location is not supported by this browser.');return}
  btn.textContent='⌖ Requesting location…';
  navigator.geolocation.getCurrentPosition(pos=>{document.getElementById('regLocation').value=`GPS ${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;btn.textContent='⌖ Current device location added';toast('Device location added to your profile.');},()=>{btn.textContent='⌖ Use current device location';toast('Location permission was not granted. Enter your location manually.')},{enableHighAccuracy:true,timeout:8000});
});

function getUserStore(){return JSON.parse(localStorage.getItem('velouraUsers')||'[]')}
function setUserStore(users){localStorage.setItem('velouraUsers',JSON.stringify(users))}

document.getElementById('registerForm').addEventListener('submit',e=>{
  e.preventDefault();
  const user={
    name:document.getElementById('regName').value.trim(),
    phone:document.getElementById('regPhone').value.trim(),
    email:document.getElementById('regEmail').value.trim().toLowerCase(),
    address:document.getElementById('regAddress').value.trim(),
    city:document.getElementById('regCity').value.trim(),
    pin:document.getElementById('regPin').value.trim(),
    location:document.getElementById('regLocation').value.trim(),
    password:document.getElementById('regPassword').value
  };
  const confirm=document.getElementById('regConfirm').value;
  if(!/^[0-9]{10}$/.test(user.phone)){toast('Please enter a valid 10-digit phone number.');return}
  if(!/^[0-9]{6}$/.test(user.pin)){toast('Please enter a valid 6-digit PIN code.');return}
  if(user.password.length<6){toast('Password must be at least 6 characters.');return}
  if(user.password!==confirm){toast('Passwords do not match.');return}
  const users=getUserStore();
  if(users.some(u=>u.email===user.email || u.phone===user.phone)){toast('An account already exists with this email or phone.');return}
  users.push(user);setUserStore(users);storedUser=user;session=true;localStorage.setItem('velouraUser',JSON.stringify(user));localStorage.setItem('velouraSession','active');
  document.getElementById('registerForm').reset();closeAuth();updateAccountUI();toast(`Welcome to VELOURA, ${user.name.split(' ')[0]}.`);openAccountPanel();
});

document.getElementById('loginForm').addEventListener('submit',e=>{
  e.preventDefault();
  const identifier=document.getElementById('loginIdentifier').value.trim().toLowerCase();const password=document.getElementById('loginPassword').value;
  const user=getUserStore().find(u=>(u.email===identifier || u.phone===identifier) && u.password===password);
  // For convenience, if there is a profile saved from the single-account demo but user list is missing, use it.
  const fallback=(storedUser&&(storedUser.email===identifier||storedUser.phone===identifier)&&storedUser.password===password)?storedUser:null;
  if(!user&&!fallback){toast('Login failed. Check your email/phone and password.');return}
  storedUser=user||fallback;session=true;localStorage.setItem('velouraUser',JSON.stringify(storedUser));localStorage.setItem('velouraSession','active');closeAuth();updateAccountUI();toast(`Welcome back, ${storedUser.name.split(' ')[0]}.`);
});

function updateAccountUI(){
  const btn=document.getElementById('accountButton');const mob=document.getElementById('mobileAuthButton');
  if(session&&storedUser){btn.textContent=`Hi, ${storedUser.name.split(' ')[0]}`;mob.textContent='My Account';}
  else{btn.textContent='Login / Register';mob.textContent='Login / Register'}
}
function openAccountPanel(){
  if(!session||!storedUser){openAuth('login');return}
  document.getElementById('accountName').textContent=storedUser.name;
  document.getElementById('accountEmail').textContent=storedUser.email;
  document.getElementById('accountPhone').textContent=storedUser.phone;
  document.getElementById('accountAvatar').textContent=(storedUser.name||'V').charAt(0).toUpperCase();
  document.getElementById('accountDetails').innerHTML=`<div><span>Address</span><strong>${escapeHtml(storedUser.address)}</strong></div><div><span>City / PIN</span><strong>${escapeHtml(storedUser.city)} · ${escapeHtml(storedUser.pin)}</strong></div><div><span>Location</span><strong>${escapeHtml(storedUser.location)}</strong></div>`;
  accountPanel.classList.add('open');accountPanel.setAttribute('aria-hidden','false');
}
function closeAccountPanel(){accountPanel.classList.remove('open');accountPanel.setAttribute('aria-hidden','true')}
function escapeHtml(v){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
document.getElementById('closeAccountPanel').addEventListener('click',closeAccountPanel);
document.getElementById('logoutButton').addEventListener('click',()=>{session=false;localStorage.removeItem('velouraSession');closeAccountPanel();updateAccountUI();toast('You have been logged out.');});

document.getElementById('newsletterForm').addEventListener('submit',e=>{e.preventDefault();toast('Welcome to VELOURA. You are on the list.');e.target.reset()});
document.getElementById('checkoutBtn').addEventListener('click',()=>{if(!cart.length){toast('Add a fragrance to your bag first.');return}if(!session){closeCart();openAuth('login');toast('Login or create an account before checkout.');return}toast('Checkout is ready for a payment gateway such as Razorpay.');});

document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAuth();closeAccountPanel();closeCart();mobileMenu.classList.remove('open')}});
updateCart();updateAccountUI();
