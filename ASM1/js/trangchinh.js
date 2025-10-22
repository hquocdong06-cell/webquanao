// trangchinh.js - Fetch API Version (Fixed)
const API_URL = 'http://localhost:3000';

let categories = [];
let products = [];
let product_variants = [];

// ===== LOAD DATA FROM API =====
async function loadData() {
  try {
    const [categoriesRes, productsRes, variantsRes] = await Promise.all([
      fetch(`${API_URL}/categories`),
      fetch(`${API_URL}/products`),
      fetch(`${API_URL}/product_variants`)
    ]);
    
    categories = await categoriesRes.json();
    products = await productsRes.json();
    product_variants = await variantsRes.json();
    
    console.log('✅ Data loaded:', { categories, products, product_variants });
    renderMain();
  } catch (error) {
    console.error('❌ Error loading data:', error);
    document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h2>⚠️ Không thể kết nối đến API</h2><p>Vui lòng chạy: json-server --watch db.json</p></div>';
  }
}

// ===== RENDER MAIN =====
function renderMain() {
  let main = document.createElement("main");
  main.className = "main-container";

  // === 1. Banner Carousel ===
  let banner = document.createElement("div");
  banner.className = "banner-carousel";
  
  let bannerWrapper = document.createElement("div");
  bannerWrapper.className = "banner-wrapper";
  
  const bannerImages = ["img/bn1.jpg", "img/bn2.jpg", "img/bn3.jpg"];
  
  bannerImages.forEach((imgUrl, i) => {
    let slide = document.createElement("div");
    slide.className = "banner-slide";
    if(i === 0) slide.classList.add("active");
    
    let img = document.createElement("img");
    img.src = imgUrl;
    img.alt = `Banner ${i + 1}`;
    slide.appendChild(img);
    bannerWrapper.appendChild(slide);
  });
  
  banner.appendChild(bannerWrapper);
  
  // Dots navigation
  let dots = document.createElement("div");
  dots.className = "banner-dots";
  for(let i = 0; i < 3; i++) {
    let dot = document.createElement("span");
    dot.className = "dot";
    if(i === 0) dot.classList.add("active");
    dot.onclick = () => goToSlide(i);
    dots.appendChild(dot);
  }
  banner.appendChild(dots);
  main.appendChild(banner);

  // === 2. Danh mục sản phẩm ===
  let cateSection = document.createElement("section");
  cateSection.className = "categories-section";
  
  let cateHeader = document.createElement("div");
  cateHeader.className = "section-header";
  
  let cateTitle = document.createElement("h2");
  cateTitle.textContent = "DANH MỤC SẢN PHẨM";
  cateHeader.appendChild(cateTitle);
  
  let cateNav = document.createElement("div");
  cateNav.className = "section-nav";
  
  let prevBtn = document.createElement("button");
  prevBtn.innerHTML = "←";
  prevBtn.className = "nav-btn";
  prevBtn.onclick = () => scrollCategories(-1);
  
  let nextBtn = document.createElement("button");
  nextBtn.innerHTML = "→";
  nextBtn.className = "nav-btn";
  nextBtn.onclick = () => scrollCategories(1);
  
  cateNav.appendChild(prevBtn);
  cateNav.appendChild(nextBtn);
  cateHeader.appendChild(cateNav);
  cateSection.appendChild(cateHeader);

  let cateList = document.createElement("div");
  cateList.className = "category-list";
  cateList.id = "categoryList";

  categories
    .filter(c => c.parent_id === null)
    .forEach(c => {
      let item = document.createElement("div");
      item.className = "category-card";
      
      let imgWrapper = document.createElement("div");
      imgWrapper.className = "category-img";
      
      let img = document.createElement("img");
      img.src = c.image || "img/category-default.jpg";
      img.alt = c.name;
      imgWrapper.appendChild(img);
      
      let overlay = document.createElement("div");
      overlay.className = "category-overlay";
      
      let name = document.createElement("span");
      name.textContent = c.name;
      overlay.appendChild(name);
      
      let arrow = document.createElement("span");
      arrow.className = "category-arrow";
      arrow.innerHTML = "→";
      overlay.appendChild(arrow);
      
      imgWrapper.appendChild(overlay);
      item.appendChild(imgWrapper);
      cateList.appendChild(item);
    });

  cateSection.appendChild(cateList);
  main.appendChild(cateSection);

  // === 3. Sản phẩm khuyến mãi ===
  let saleSection = document.createElement("section");
  saleSection.className = "sale-section";
  
  let saleHeader = document.createElement("div");
  saleHeader.className = "section-header";
  
  let saleTitle = document.createElement("h2");
  saleTitle.innerHTML = '<span class="sale-icon">🔥</span> SẢN PHẨM KHUYẾN MÃI';
  saleHeader.appendChild(saleTitle);
  
  let saleNav = document.createElement("div");
  saleNav.className = "section-nav";
  
  let salePrevBtn = document.createElement("button");
  salePrevBtn.innerHTML = "←";
  salePrevBtn.className = "nav-btn";
  salePrevBtn.onclick = () => scrollSale(-1);
  
  let saleNextBtn = document.createElement("button");
  saleNextBtn.innerHTML = "→";
  saleNextBtn.className = "nav-btn";
  saleNextBtn.onclick = () => scrollSale(1);
  
  saleNav.appendChild(salePrevBtn);
  saleNav.appendChild(saleNextBtn);
  saleHeader.appendChild(saleNav);
  saleSection.appendChild(saleHeader);

  let saleGrid = document.createElement("div");
  saleGrid.className = "product-grid";
  saleGrid.id = "saleGrid";

  products.slice(0, 6).forEach(p => {
    let card = createProductCard(p, true);
    saleGrid.appendChild(card);
  });

  saleSection.appendChild(saleGrid);
  
  let viewAllBtn = document.createElement("button");
  viewAllBtn.className = "view-all-btn";
  viewAllBtn.textContent = "XEM TẤT CẢ SẢN PHẨM KHUYẾN MÃI";
  saleSection.appendChild(viewAllBtn);
  main.appendChild(saleSection);

  // === 4. Sản phẩm nổi bật với tabs ===
  let featureSection = document.createElement("section");
  featureSection.className = "feature-section";
  
  let tabs = document.createElement("div");
  tabs.className = "product-tabs";
  
  const tabList = [
    "SẢN PHẨM NỔI BẬT",
    "ĐỒ THỂ THAO",
    "ĐỒ CÔNG SỞ",
    "ĐỒ THU ĐÔNG"
  ];
  
  tabList.forEach((tabName, index) => {
    let tab = document.createElement("button");
    tab.className = "tab-btn";
    if(index === 0) tab.classList.add("active");
    tab.textContent = tabName;
    tab.onclick = () => switchTab(index);
    tabs.appendChild(tab);
  });
  
  featureSection.appendChild(tabs);

  let featureGrid = document.createElement("div");
  featureGrid.className = "product-grid";
  featureGrid.id = "featureGrid";

  products.forEach(p => {
    let card = createProductCard(p, false);
    featureGrid.appendChild(card);
  });

  featureSection.appendChild(featureGrid);
  main.appendChild(featureSection);

  // Insert main vào body
  let footer = document.getElementById("footer");
  document.body.insertBefore(main, footer);
  
  // Khởi động banner carousel
  startBannerCarousel();
}

// ===== CREATE PRODUCT CARD (ĐÃ SỬA LỖI) =====
function createProductCard(p, isSale) {
  // SỬA: Dùng == thay vì === để so sánh string với number
  let variants = product_variants.filter(v => v.product_id == p.id);
  
  // Ưu tiên giá từ product.price, fallback sang min từ variants
  let minPrice = 0;
  if (p.price && p.price > 0) {
    minPrice = p.price;
  } else if (variants.length > 0) {
    minPrice = Math.min(...variants.map(v => v.price));
  }

  let card = document.createElement("div");
  card.className = "product-card";
  card.style.cursor = "pointer";
  card.onclick = () => window.location.href = `chitiet.html?id=${p.id}`;
  
  let imgWrapper = document.createElement("div");
  imgWrapper.className = "product-img-wrapper";
  
  if(isSale) {
    let badge = document.createElement("span");
    badge.className = "sale-badge";
    badge.textContent = "-20%";
    imgWrapper.appendChild(badge);
  }

  let img = document.createElement("img");
  img.src = p.image;
  img.alt = p.name;
  imgWrapper.appendChild(img);
  card.appendChild(imgWrapper);

  let info = document.createElement("div");
  info.className = "product-info";

  let sizes = document.createElement("p");
  sizes.className = "product-sizes";
  sizes.textContent = "+3 Màu sắc    +4 Kích thước";
  info.appendChild(sizes);

  let name = document.createElement("h3");
  name.textContent = p.name;
  info.appendChild(name);

  let priceBox = document.createElement("div");
  priceBox.className = "price-box";
  
  let price = document.createElement("span");
  price.className = "price";
  price.textContent = minPrice > 0 ? minPrice.toLocaleString("vi-VN") + "đ" : "Liên hệ";
  priceBox.appendChild(price);

  if(isSale && minPrice > 0) {
    let oldPrice = document.createElement("span");
    oldPrice.className = "old-price";
    oldPrice.textContent = (minPrice * 1.25).toLocaleString("vi-VN") + "đ";
    priceBox.appendChild(oldPrice);
  }
  
  info.appendChild(priceBox);
  card.appendChild(info);

  return card;
}

// ===== BANNER CAROUSEL =====
let currentSlide = 0;
let bannerInterval;

function startBannerCarousel() {
  bannerInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % 3;
    updateBanner();
  }, 5000);
}

function goToSlide(index) {
  currentSlide = index;
  updateBanner();
  clearInterval(bannerInterval);
  startBannerCarousel();
}

function updateBanner() {
  let slides = document.querySelectorAll(".banner-slide");
  let dots = document.querySelectorAll(".banner-dots .dot");
  
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === currentSlide);
  });
  
  dots.forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSlide);
  });
}

// ===== SCROLL FUNCTIONS =====
function scrollCategories(direction) {
  let list = document.getElementById("categoryList");
  let scrollAmount = 300;
  list.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function scrollSale(direction) {
  let grid = document.getElementById("saleGrid");
  let scrollAmount = 300;
  grid.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
}

function switchTab(index) {
  let tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach((tab, i) => {
    tab.classList.toggle("active", i === index);
  });
}

// ===== INITIALIZE =====
loadData();