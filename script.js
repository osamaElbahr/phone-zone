const products = [
  {
    id: "ip15",
    name: "iPhone 15",
    brand: "Apple",
    price: 39999,
    image: "images/iphone15.jpg",
    specs: ["A16 Bionic", "6GB RAM", "128GB Storage", "6.1\" Super Retina XDR", "USB-C"],
    pros: ["أداء ممتاز", "كاميرا قوية", "دعم تحديثات طويل"],
    cons: ["شحن أبطأ", "سعر مرتفع"]
  },
  {
    id: "s24",
    name: "Samsung G S24",
    brand: "Samsung",
    price: 29999,
    image: "images/samsung-s24.jpg",
    specs: ["Exynos 2400", "8GB RAM", "256GB Storage", "6.2\" AMOLED 120Hz", "IP68"],
    pros: ["شاشة ساطعة", "أبعاد مريحة", "تصوير جيد"],
    cons: ["بطارية متوسطة", "RAM الأساسي 8GB"]
  },
  {
    id: "poco-f6",
    name: "Poco F6",
    brand: "Xiaomi",
    price: 17999,
    image: "images/poco-f6.jpg",
    specs: ["Snapdragon 8s Gen 3", "12GB RAM", "256GB Storage", "AMOLED 120Hz", "90W Charging"],
    pros: ["أداء قوي جدًا للسعر", "شحن سريع"],
    cons: ["عدسة UltraWide عادية", "فريم بلاستيك"]
  },
  {
    id: "a55",
    name: "Samsung G A55",
    brand: "Samsung",
    price: 15999,
    image: "images/samsung-a55.jpg",
    specs: ["Exynos 1480", "8GB RAM", "256GB", "6.6\" AMOLED 120Hz", "5000mAh"],
    pros: ["بطارية كويسة", "IP67", "شاشة ممتازة"],
    cons: ["المعالج مش الأسرع"]
  },
  {
    id: "rn13",
    name: "Redmi Note 13",
    brand: "Xiaomi",
    price: 10999,
    image: "images/redmi-note13.jpg",
    specs: ["Dimensity 6080", "8GB RAM", "128GB", "AMOLED 120Hz"],
    pros: ["سعر مناسب", "بطارية جيدة"],
    cons: ["كاميرات متوسطة"]
  },
  // زوّد زي ما تحب:
  { id: "ip14p", name: "iPhone 14 Pro", brand: "Apple", price: 33999, image: "images/iphone14pro.jpg", specs: ["A16", "6GB", "128GB", "ProMotion 120Hz"], pros: ["كاميرات ممتازة"], cons: ["سعر عالي"] },
  { id: "s23", name: "Galaxy S23", brand: "Samsung", price: 24999, image: "images/galaxy-s23.jpg", specs: ["SD 8 Gen 2", "8GB", "256GB"], pros: ["أداء ممتاز"], cons: ["شحن أبطأ"] },
  { id: "poco-x6", name: "Poco X6", brand: "Xiaomi", price: 12999, image: "images/poco-x6.jpg", specs: ["SD 7s Gen 2", "8GB", "256GB"], pros: ["قيمة قوية"], cons: ["كاميرات عادية"] },
  { id: "a35", name: "Galaxy A35", brand: "Samsung", price: 12999, image: "images/galaxy-a35.jpg", specs: ["Exynos 1380", "8GB", "256GB"], pros: ["شاشة كويسة"], cons: ["أداء متوسط"] },
  { id: "rn13p", name: "Redmi Note 13 Pro", brand: "Xiaomi", price: 14999, image: "images/redmi-note13-pro.jpg", specs: ["Snapdragon 7s Gen 2", "8GB", "256GB"], pros: ["شاشة وبطارية"], cons: ["سعر قريب من فوقه"] },
];

// ========== عناصر أساسية من الـ DOM ==========
const grid = document.querySelector(".phone-grid"); // موجود في index.html
const body = document.body;

// ========== حالة التطبيق ==========
const state = {
  query: "",
  sort: "featured", // featured | price-asc | price-desc | name-asc | name-desc
  priceMax: Math.max(...products.map(p => p.price)),
  priceCurrent: Math.max(...products.map(p => p.price)),
  compare: new Set(), // ids
  favorites: new Set()
};

// ========== أدوات مساعدة ==========
const formatEGP = n => new Intl.NumberFormat("en-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n);

// ========== بناء شريط التحكم تحت اللوجو (Search + Sort + Price) ==========
function buildToolbar() {
  const toolbar = document.createElement("section");
  toolbar.className = "toolbar";
  toolbar.innerHTML = `
    <div class="toolbar-inner">
      <div class="search-wrap">
        <input id="searchInput" type="text" placeholder="Search phones…">
      </div>
      <div class="price-wrap">
        <label for="priceRange">Max Price: <span id="priceValue">${formatEGP(state.priceCurrent)}</span></label>
        <input id="priceRange" type="range" min="0" max="${state.priceMax}" value="${state.priceCurrent}" step="500">
      </div>
      <div class="sort-wrap">
        <select id="sortSelect" title="Sort by">
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="name-asc">Name: A → Z</option>
          <option value="name-desc">Name: Z → A</option>
        </select>
      </div>
    </div>
    <div class="results-meta">
      <span id="countLabel"></span>
    </div>
  `;
  // نحط التولبار بعد الـ header/hero لو موجودين، وإلا قبل الجريد
  const hero = document.querySelector(".hero");
  (hero ? hero.after(toolbar) : grid.before(toolbar));

  // Events
  const searchInput = toolbar.querySelector("#searchInput");
  const priceRange = toolbar.querySelector("#priceRange");
  const priceValue = toolbar.querySelector("#priceValue");
  const sortSelect = toolbar.querySelector("#sortSelect");

  searchInput.addEventListener("input", (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });

  priceRange.addEventListener("input", (e) => {
    state.priceCurrent = +e.target.value;
    priceValue.textContent = formatEGP(state.priceCurrent);
    render();
  });

  sortSelect.addEventListener("change", (e) => {
    state.sort = e.target.value;
    render();
  });
}

// ========== فلترة + ترتيب ==========
function getFilteredSorted() {
  let list = products.filter(p => 
    p.price <= state.priceCurrent &&
    (state.query === "" ||
     p.name.toLowerCase().includes(state.query) ||
     p.brand.toLowerCase().includes(state.query))
  );

  switch (state.sort) {
    case "price-asc":  list.sort((a,b)=>a.price-b.price); break;
    case "price-desc": list.sort((a,b)=>b.price-a.price); break;
    case "name-asc":   list.sort((a,b)=>a.name.localeCompare(b.name)); break;
    case "name-desc":  list.sort((a,b)=>b.name.localeCompare(a.name)); break;
    default: /* featured */ break;
  }

  return list;
}

// ========== رسم الكروت ==========
function renderCards(list) {
  grid.innerHTML = "";
  if (!list.length) {
    grid.innerHTML = `<p class="empty">No phones match your filters.</p>`;
    return;
  }

  list.forEach(p => {
    const card = document.createElement("article");
    card.className = "phone-card";
    card.innerHTML = `
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}">
      </div>
      <div class="card-body">
        <h3 class="title">${p.name}</h3>
        <p class="brand">${p.brand}</p>
        <p class="price">${formatEGP(p.price)}</p>
        <div class="actions">
          <button class="btn primary" data-action="details" data-id="${p.id}">Details</button>
          <button class="btn ghost" data-action="compare" data-id="${p.id}">
            ${state.compare.has(p.id) ? "Remove Compare" : "Add Compare"}
          </button>
          <button class="icon-btn" data-action="fav" data-id="${p.id}" aria-label="Favorite">
            ${state.favorites.has(p.id) ? "★" : "☆"}
          </button>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ========== عدّاد النتائج ==========
function renderCount(count) {
  const label = document.querySelector("#countLabel");
  if (label) label.textContent = `${count} result${count !== 1 ? "s" : ""}`;
}

// ========== Modal التفاصيل ==========
let modal;
function ensureModal() {
  if (modal) return;
  modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
    <div class="modal-content">
      <button class="close" aria-label="Close">&times;</button>
      <div class="modal-header">
        <img id="mImg" alt="">
        <div>
          <h2 id="mName"></h2>
          <p id="mBrand"></p>
          <p id="mPrice" class="m-price"></p>
        </div>
      </div>
      <div class="modal-sections">
        <section>
          <h3>Specs</h3>
          <ul id="mSpecs"></ul>
        </section>
        <section>
          <h3>Pros</h3>
          <ul id="mPros"></ul>
        </section>
        <section>
          <h3>Cons</h3>
          <ul id="mCons"></ul>
        </section>
      </div>
    </div>
  `;
  body.appendChild(modal);

  modal.querySelector(".close").addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
}

function openModalById(id) {
  ensureModal();
  const p = products.find(x => x.id === id);
  if (!p) return;

  modal.querySelector("#mImg").src = p.image;
  modal.querySelector("#mImg").alt = p.name;
  modal.querySelector("#mName").textContent = p.name;
  modal.querySelector("#mBrand").textContent = p.brand;
  modal.querySelector("#mPrice").textContent = formatEGP(p.price);

  const specs = modal.querySelector("#mSpecs");
  const pros = modal.querySelector("#mPros");
  const cons = modal.querySelector("#mCons");
  specs.innerHTML = p.specs.map(s => `<li>${s}</li>`).join("");
  pros.innerHTML  = p.pros.map(s => `<li>✅ ${s}</li>`).join("");
  cons.innerHTML  = p.cons.map(s => `<li>⚠️ ${s}</li>`).join("");

  modal.classList.add("open");
}

// ========== شريط المقارنة العائم ==========
let compareBar;
function ensureCompareBar() {
  if (compareBar) return;
  compareBar = document.createElement("div");
  compareBar.className = "compare-bar";
  compareBar.innerHTML = `
    <div class="compare-inner">
      <span>Compare:</span>
      <div class="chips" id="cmpChips"></div>
      <button class="btn primary" id="cmpBtn" disabled>Show Comparison</button>
      <button class="btn ghost" id="cmpClear" title="Clear">Clear</button>
    </div>
  `;
  body.appendChild(compareBar);

  compareBar.querySelector("#cmpBtn").addEventListener("click", showCompareModal);
  compareBar.querySelector("#cmpClear").addEventListener("click", () => {
    state.compare.clear(); render();
  });
}

function renderCompareChips() {
  ensureCompareBar();
  const chips = compareBar.querySelector("#cmpChips");
  chips.innerHTML = "";
  [...state.compare].forEach(id => {
    const p = products.find(x => x.id === id);
    if (!p) return;
    const chip = document.createElement("button");
    chip.className = "chip";
    chip.textContent = p.name;
    chip.title = "Remove";
    chip.addEventListener("click", () => { state.compare.delete(id); render(); });
    chips.appendChild(chip);
  });
  const btn = compareBar.querySelector("#cmpBtn");
  btn.disabled = state.compare.size < 2;
  compareBar.style.display = state.compare.size ? "block" : "none";
}

function showCompareModal() {
  ensureModal();
  const ids = [...state.compare].slice(0, 3);
  const list = ids.map(id => products.find(p => p.id === id)).filter(Boolean);
  if (!list.length) return;

  // نصنع جدول بسيط للمقارنة داخل الـ modal
  modal.querySelector(".modal-sections").innerHTML = `
    <section class="compare-table">
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            ${list.map(p=>`<th>${p.name}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          <tr><td>Brand</td>${list.map(p=>`<td>${p.brand}</td>`).join("")}</tr>
          <tr><td>Price</td>${list.map(p=>`<td>${formatEGP(p.price)}</td>`).join("")}</tr>
          <tr><td>Specs</td>${list.map(p=>`<td>${p.specs.join(" • ")}</td>`).join("")}</tr>
          <tr><td>Pros</td>${list.map(p=>`<td>${p.pros.join(" • ")}</td>`).join("")}</tr>
          <tr><td>Cons</td>${list.map(p=>`<td>${p.cons.join(" • ")}</td>`).join("")}</tr>
        </tbody>
      </table>
    </section>
  `;
  modal.querySelector("#mImg").src = "";
  modal.querySelector("#mName").textContent = "Comparison";
  modal.querySelector("#mBrand").textContent = `${list.length} phones`;
  modal.querySelector("#mPrice").textContent = "";
  modal.classList.add("open");
}

// ========== ريندر رئيسي ==========
function render() {
  const list = getFilteredSorted();
  renderCards(list);
  renderCount(list.length);
  renderCompareChips();
}

// ========== تفويض أحداث للكروت ==========
grid.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const id = btn.dataset.id;
  const action = btn.dataset.action;

  if (action === "details") {
    openModalById(id);
  } else if (action === "compare") {
    if (state.compare.has(id)) state.compare.delete(id);
    else {
      if (state.compare.size >= 3) {
        alert("You can compare up to 3 phones.");
        return;
      }
      state.compare.add(id);
    }
    render();
  } else if (action === "fav") {
    if (state.favorites.has(id)) state.favorites.delete(id);
    else state.favorites.add(id);
    render();
  }
});

// ========== تشغيل أولي ==========
document.addEventListener("DOMContentLoaded", () => {
  buildToolbar();
  ensureModal();
  ensureCompareBar();
  render();
});

/* ============================
   شوية ستايلات خفيفة إضافية بالـ JS (لو حابب تسيبها في CSS انقلها)
   ============================ */
const extraStyles = `
.toolbar { padding: 20px; }
.toolbar .toolbar-inner { display:flex; gap:16px; flex-wrap:wrap; align-items:center; justify-content:center; }
.search-wrap input{ padding:10px 14px; border:1px solid #e3e7ee; border-radius:10px; min-width:260px; outline:none; }
.price-wrap{ display:flex; flex-direction:column; gap:6px; font-size:.9rem; }
.price-wrap input[type=range]{ width:220px; }
.sort-wrap select{ padding:10px 12px; border:1px solid #e3e7ee; border-radius:10px; background:#fff; }
.results-meta{ text-align:center; margin-top:10px; color:#555; }

.phone-card .brand{ color:#777; font-size:.9rem; margin-top:2px; }
.phone-card .actions{ display:flex; gap:8px; align-items:center; justify-content:center; margin-top:10px; }
.btn{ cursor:pointer; border:none; border-radius:10px; padding:10px 14px; }
.btn.primary{ background:#0077ff; color:#fff; }
.btn.ghost{ background:#eef3ff; color:#1653b3; }
.icon-btn{ font-size:18px; background:transparent; border:none; }

.modal{ position:fixed; inset:0; background:rgba(0,0,0,.6); display:none; align-items:center; justify-content:center; padding:20px; z-index:50; }
.modal.open{ display:flex; }
.modal-content{ background:#fff; border-radius:14px; width:min(900px, 95vw); padding:18px; box-shadow:0 10px 30px rgba(0,0,0,.2); }
.modal-content .close{ float:right; font-size:26px; background:transparent; border:none; cursor:pointer; }
.modal-header{ display:flex; gap:16px; align-items:center; margin-top:10px; margin-bottom:14px; }
.modal-header img{ width:120px; height:120px; object-fit:contain; border-radius:10px; background:#f5f7fb; }
.m-price{ color:#0a66ff; font-weight:700; }
.modal-sections{ display:grid; gap:16px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
.modal-sections ul{ padding-left:18px; }
.compare-table table{ width:100%; border-collapse:collapse; }
.compare-table th, .compare-table td{ border:1px solid #eef0f4; padding:10px; text-align:left; font-size:.95rem; }
.compare-bar{ position:fixed; left:50%; transform:translateX(-50%); bottom:18px; background:#ffffffcc; backdrop-filter:blur(6px); border:1px solid #e6ebf3; box-shadow:0 6px 20px rgba(0,0,0,.08); border-radius:14px; padding:10px 14px; display:none; z-index:40; }
.compare-inner{ display:flex; gap:10px; align-items:center; }
.chips{ display:flex; gap:8px; flex-wrap:wrap; }
.chip{ border:1px solid #d8e2f0; background:#f3f7ff; border-radius:999px; padding:6px 10px; cursor:pointer; }
.empty{ grid-column:1/-1; padding:30px; background:#fff; border-radius:12px; box-shadow:0 4px 8px rgba(0,0,0,.06); }
`;
const styleTag = document.createElement("style");
styleTag.textContent = extraStyles;
document.head.appendChild(styleTag);
// Active link highlight
const links = document.querySelectorAll(".nav-links li a");
links.forEach(link => {
  link.addEventListener("click", function() {
    links.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// Toggle menu
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});
function toggleMenu() {
  document.querySelector("nav ul").classList.toggle("show");
}
function toggleMenu() {
  document.getElementById("navLinks").classList.toggle("show");
}
// تفعيل زرار الهامبورجر
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});
