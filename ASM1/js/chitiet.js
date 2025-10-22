// chitiet.js - Fetch API Version
const API_URL = 'http://localhost:3000';

let categories = [];
let products = [];
let product_variants = [];

// Lấy product_id từ URL
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('id')) || 1;

// ===== LOAD DATA FROM API =====
async function loadData() {
  try {
    const [categoriesRes, productsRes, variantsRes] = await Promise.all([
      fetch(`${API_URL}/categories`),
      fetch(`${API_URL}/products/${productId}`),
      fetch(`${API_URL}/product_variants?product_id=${productId}`)
    ]);
    
    categories = await categoriesRes.json();
    const product = await productsRes.json();
    product_variants = await variantsRes.json();
    
    // Load all products for related section
    const allProductsRes = await fetch(`${API_URL}/products`);
    products = await allProductsRes.json();
    
    console.log('✅ Data loaded:', { categories, product, product_variants });
    renderProductDetail(product);
  } catch (error) {
    console.error('❌ Error loading data:', error);
    document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h2>⚠️ Không thể tải sản phẩm</h2></div>';
  }
}

// ===== RENDER PRODUCT DETAIL =====
function renderProductDetail(product) {
  let main = document.createElement("main");
  main.className = "product-detail-container";

  if (!product) {
    main.innerHTML = '<div class="error">Không tìm thấy sản phẩm</div>';
    document.body.insertBefore(main, document.getElementById("footer"));
    return;
  }

  // Breadcrumb
  let breadcrumb = document.createElement("div");
  breadcrumb.className = "breadcrumb";
  let category = categories.find(c => c.id === product.cate_id);
  breadcrumb.innerHTML = `
    <a href="trangchinh.html">Trang chủ</a> / 
    <a href="sanpham.html">Sản phẩm</a> / 
    <span>${product.name}</span>
  `;
  main.appendChild(breadcrumb);

  // Product Detail Section
  let detailSection = document.createElement("div");
  detailSection.className = "product-detail-section";

  // === Left: Gallery ===
  let gallery = document.createElement("div");
  gallery.className = "product-gallery";

  let mainImageWrapper = document.createElement("div");
  mainImageWrapper.className = "main-image-wrapper";
  
  let mainImage = document.createElement("img");
  mainImage.id = "mainProductImage";
  mainImage.src = product.image;
  mainImage.alt = product.name;
  mainImageWrapper.appendChild(mainImage);
  gallery.appendChild(mainImageWrapper);

  // Thumbnails
  let thumbnails = document.createElement("div");
  thumbnails.className = "image-thumbnails";
  
  let thumb1 = createThumbnail(product.image, true);
  thumbnails.appendChild(thumb1);
  
  product_variants.slice(0, 3).forEach(v => {
    if (v.image && v.image !== product.image) {
      let thumb = createThumbnail("img/" + v.image, false);
      thumbnails.appendChild(thumb);
    }
  });
  
  gallery.appendChild(thumbnails);
  detailSection.appendChild(gallery);

  // === Right: Product Info ===
  let productInfo = document.createElement("div");
  productInfo.className = "product-detail-info";

  let productName = document.createElement("h1");
  productName.className = "product-name";
  productName.textContent = product.name;
  productInfo.appendChild(productName);

  let rating = document.createElement("div");
  rating.className = "product-rating";
  rating.innerHTML = `
    <span class="stars">★★★★★</span>
    <span class="rating-text">(4.5 - 128 đánh giá)</span>
  `;
  productInfo.appendChild(rating);

  // Price
  let priceBox = document.createElement("div");
  priceBox.className = "product-price-box";
  
  let currentPrice = product_variants.length > 0 ? Math.min(...product_variants.map(v => v.price)) : 0;
  let oldPrice = currentPrice * 1.25;
  
  priceBox.innerHTML = `
    <span class="current-price">${currentPrice.toLocaleString('vi-VN')}đ</span>
    <span class="old-price">${oldPrice.toLocaleString('vi-VN')}đ</span>
    <span class="discount-badge">-20%</span>
  `;
  productInfo.appendChild(priceBox);

  let description = document.createElement("p");
  description.className = "product-description";
  description.textContent = product.detail;
  productInfo.appendChild(description);

  // Color selector
  let colorSection = document.createElement("div");
  colorSection.className = "selector-section";
  
  let colorLabel = document.createElement("label");
  colorLabel.textContent = "Màu sắc:";
  colorSection.appendChild(colorLabel);
  
  let colorOptions = document.createElement("div");
  colorOptions.className = "color-options";
  colorOptions.id = "colorOptions";
  
  let colors = [...new Set(product_variants.map(v => extractColor(v.variant_name)))];
  colors.forEach((color, index) => {
    let colorBtn = document.createElement("button");
    colorBtn.className = "color-btn";
    if (index === 0) colorBtn.classList.add("active");
    colorBtn.textContent = color;
    colorBtn.onclick = () => selectColor(colorBtn);
    colorOptions.appendChild(colorBtn);
  });
  
  colorSection.appendChild(colorOptions);
  productInfo.appendChild(colorSection);

  // Size selector
  let sizeSection = document.createElement("div");
  sizeSection.className = "selector-section";
  
  let sizeLabel = document.createElement("label");
  sizeLabel.textContent = "Kích thước:";
  sizeSection.appendChild(sizeLabel);
  
  let sizeOptions = document.createElement("div");
  sizeOptions.className = "size-options";
  sizeOptions.id = "sizeOptions";
  
  let sizes = [...new Set(product_variants.map(v => extractSize(v.variant_name)))];
  sizes.forEach((size, index) => {
    let sizeBtn = document.createElement("button");
    sizeBtn.className = "size-btn";
    if (index === 0) sizeBtn.classList.add("active");
    sizeBtn.textContent = size;
    sizeBtn.onclick = () => selectSize(sizeBtn);
    sizeOptions.appendChild(sizeBtn);
  });
  
  sizeSection.appendChild(sizeOptions);
  productInfo.appendChild(sizeSection);

  // Quantity selector
  let quantitySection = document.createElement("div");
  quantitySection.className = "quantity-section";
  
  let quantityLabel = document.createElement("label");
  quantityLabel.textContent = "Số lượng:";
  quantitySection.appendChild(quantityLabel);
  
  let quantityBox = document.createElement("div");
  quantityBox.className = "quantity-selector";
  
  let btnMinus = document.createElement("button");
  btnMinus.className = "qty-btn";
  btnMinus.textContent = "-";
  btnMinus.onclick = () => changeQuantity(-1);
  
  let qtyInput = document.createElement("input");
  qtyInput.type = "number";
  qtyInput.id = "quantity";
  qtyInput.value = 1;
  qtyInput.min = 1;
  qtyInput.max = 99;
  
  let btnPlus = document.createElement("button");
  btnPlus.className = "qty-btn";
  btnPlus.textContent = "+";
  btnPlus.onclick = () => changeQuantity(1);
  
  quantityBox.appendChild(btnMinus);
  quantityBox.appendChild(qtyInput);
  quantityBox.appendChild(btnPlus);
  quantitySection.appendChild(quantityBox);
  productInfo.appendChild(quantitySection);

  // Action buttons
  let actionButtons = document.createElement("div");
  actionButtons.className = "action-buttons";
  
  let addToCartBtn = document.createElement("button");
  addToCartBtn.className = "btn-add-to-cart";
  addToCartBtn.innerHTML = "🛒 THÊM VÀO GIỎ HÀNG";
  addToCartBtn.onclick = addToCart;
  
  let buyNowBtn = document.createElement("button");
  buyNowBtn.className = "btn-buy-now";
  buyNowBtn.textContent = "MUA NGAY";
  buyNowBtn.onclick = buyNow;
  
  actionButtons.appendChild(addToCartBtn);
  actionButtons.appendChild(buyNowBtn);
  productInfo.appendChild(actionButtons);

  // Product features
  let features = document.createElement("div");
  features.className = "product-features";
  features.innerHTML = `
    <div class="feature-item">
      <span class="feature-icon">✓</span>
      <span>Miễn phí vận chuyển đơn từ 500k</span>
    </div>
    <div class="feature-item">
      <span class="feature-icon">↺</span>
      <span>Đổi trả trong 30 ngày</span>
    </div>
    <div class="feature-item">
      <span class="feature-icon">★</span>
      <span>Sản phẩm chính hãng 100%</span>
    </div>
  `;
  productInfo.appendChild(features);

  detailSection.appendChild(productInfo);
  main.appendChild(detailSection);

  // === Product Details Tabs ===
  let tabsSection = document.createElement("div");
  tabsSection.className = "product-tabs-section";
  
  let tabButtons = document.createElement("div");
  tabButtons.className = "tab-buttons";
  
  const tabs = ["Mô tả sản phẩm", "Đánh giá", "Hướng dẫn bảo quản"];
  tabs.forEach((tab, index) => {
    let tabBtn = document.createElement("button");
    tabBtn.className = "detail-tab-btn";
    if (index === 0) tabBtn.classList.add("active");
    tabBtn.textContent = tab;
    tabBtn.onclick = () => switchDetailTab(index);
    tabButtons.appendChild(tabBtn);
  });
  
  tabsSection.appendChild(tabButtons);
  
  let tabContent = document.createElement("div");
  tabContent.className = "tab-content";
  tabContent.id = "tabContent";
  tabContent.innerHTML = `
    <div class="tab-pane active">
      <h3>Chi tiết sản phẩm</h3>
      <p>${product.detail}</p>
      <ul>
        <li>Chất liệu cao cấp, thấm hút mồ hôi tốt</li>
        <li>Form dáng chuẩn, phù hợp nhiều vóc dáng</li>
        <li>Màu sắc không phai sau nhiều lần giặt</li>
        <li>Thiết kế trẻ trung, năng động</li>
      </ul>
    </div>
  `;
  tabsSection.appendChild(tabContent);
  main.appendChild(tabsSection);

  // === Related Products ===
  let relatedSection = document.createElement("section");
  relatedSection.className = "related-products-section";
  
  let relatedTitle = document.createElement("h2");
  relatedTitle.textContent = "SẢN PHẨM LIÊN QUAN";
  relatedSection.appendChild(relatedTitle);
  
  let relatedGrid = document.createElement("div");
  relatedGrid.className = "related-products-grid";
  
  products
    .filter(p => p.cate_id === product.cate_id && p.id !== product.id)
    .slice(0, 4)
    .forEach(p => {
      let card = createRelatedProductCard(p);
      relatedGrid.appendChild(card);
    });
  
  relatedSection.appendChild(relatedGrid);
  main.appendChild(relatedSection);

  document.body.insertBefore(main, document.getElementById("footer"));
}

// ===== HELPER FUNCTIONS =====
function createThumbnail(imgSrc, isActive) {
  let thumb = document.createElement("div");
  thumb.className = "thumbnail" + (isActive ? " active" : "");
  
  let img = document.createElement("img");
  img.src = imgSrc;
  img.onclick = () => changeMainImage(imgSrc, thumb);
  
  thumb.appendChild(img);
  return thumb;
}

function changeMainImage(src, thumbElement) {
  document.getElementById("mainProductImage").src = src;
  document.querySelectorAll(".thumbnail").forEach(t => t.classList.remove("active"));
  thumbElement.classList.add("active");
}

function selectColor(btn) {
  document.querySelectorAll(".color-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function selectSize(btn) {
  document.querySelectorAll(".size-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

function changeQuantity(delta) {
  let input = document.getElementById("quantity");
  let newValue = parseInt(input.value) + delta;
  if (newValue >= 1 && newValue <= 99) {
    input.value = newValue;
  }
}

function addToCart() {
  let selectedColor = document.querySelector(".color-btn.active")?.textContent;
  let selectedSize = document.querySelector(".size-btn.active")?.textContent;
  let quantity = parseInt(document.getElementById("quantity").value);
  
  let selectedVariant = product_variants.find(v => 
    extractColor(v.variant_name) === selectedColor && 
    extractSize(v.variant_name) === selectedSize
  );
  
  if (!selectedVariant) {
    alert("Không tìm thấy sản phẩm với thuộc tính đã chọn!");
    return;
  }
  
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let existingItem = cart.find(item => item.variant_id === selectedVariant.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      variant_id: selectedVariant.id,
      quantity: quantity
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!\nMàu: ${selectedColor}\nSize: ${selectedSize}`);
}

function buyNow() {
  addToCart();
  window.location.href = "giohang.html";
}

function switchDetailTab(index) {
  document.querySelectorAll(".detail-tab-btn").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });
}

function createRelatedProductCard(p) {
  let card = document.createElement("div");
  card.className = "related-product-card";
  card.onclick = () => window.location.href = `chitiet.html?id=${p.id}`;
  
  let img = document.createElement("img");
  img.src = p.image;
  img.alt = p.name;
  
  let name = document.createElement("h4");
  name.textContent = p.name;
  
  // Fetch variants for this product
  fetch(`${API_URL}/product_variants?product_id=${p.id}`)
    .then(res => res.json())
    .then(variants => {
      let price = variants.length > 0 ? Math.min(...variants.map(v => v.price)) : 0;
      let priceElem = document.createElement("p");
      priceElem.className = "price";
      priceElem.textContent = price.toLocaleString('vi-VN') + "đ";
      card.appendChild(priceElem);
    });
  
  card.appendChild(img);
  card.appendChild(name);
  
  return card;
}

function extractColor(variantName) {
  let match = variantName.match(/Màu\s+(\S+)/i);
  return match ? match[1] : variantName.split('-')[0].trim();
}

function extractSize(variantName) {
  let match = variantName.match(/Size\s+(\S+)/i);
  return match ? match[1] : variantName.split('-')[1]?.trim() || "M";
}

// ===== INITIALIZE =====
loadData();