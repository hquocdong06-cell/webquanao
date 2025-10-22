// sanpham.js - Fetch API Version (Fixed)
const API_URL = 'http://localhost:3000';

let products = [];
let product_variants = [];
let currentCategory = 'all';
let currentSort = 'default';
let currentPage = 1;
const itemsPerPage = 12;

// ===== LOAD DATA FROM API =====
async function loadData() {
  try {
    const [productsRes, variantsRes] = await Promise.all([
      fetch(`${API_URL}/products`),
      fetch(`${API_URL}/product_variants`)
    ]);
    
    products = await productsRes.json();
    product_variants = await variantsRes.json();
    
    console.log('✅ Products loaded:', products.length);
    console.log('✅ Variants loaded:', product_variants.length);
    renderProducts();
  } catch (error) {
    console.error('❌ Error loading data:', error);
    document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h2>⚠️ Không thể tải sản phẩm</h2></div>';
  }
}

// ===== RENDER PRODUCTS =====
function renderProducts() {
  let main = document.createElement("main");
  main.className = "products-container";

  // Breadcrumb
  let breadcrumb = document.createElement("div");
  breadcrumb.className = "breadcrumb";
  breadcrumb.innerHTML = `<a href="trangchinh.html">Trang chủ</a> / <span>Sản phẩm</span>`;
  main.appendChild(breadcrumb);

  // Header
  let header = document.createElement("div");
  header.className = "products-header";
  header.innerHTML = `
    <h1 class="products-title">TẤT CẢ SẢN PHẨM</h1>
    <p class="products-subtitle">Khám phá bộ sưu tập thời trang mới nhất của chúng tôi</p>
  `;
  main.appendChild(header);

  // Filter section
  let filterSection = createFilterSection();
  main.appendChild(filterSection);

  // Products grid
  let productsGrid = createProductsGrid();
  main.appendChild(productsGrid);

  // Pagination
  let pagination = createPagination();
  main.appendChild(pagination);

  let footer = document.getElementById("footer");
  document.body.insertBefore(main, footer);
}

// ===== CREATE FILTER SECTION =====
function createFilterSection() {
  let section = document.createElement("div");
  section.className = "filter-section";

  let filterGroup = document.createElement("div");
  filterGroup.className = "filter-group";

  filterGroup.innerHTML = `
    <label>Danh mục:</label>
    <select class="filter-select" id="categoryFilter">
      <option value="all">Tất cả</option>
      <option value="1">Áo</option>
      <option value="2">Quần</option>
      <option value="3">Váy</option>
      <option value="4">Giày</option>
    </select>
    
    <label>Sắp xếp:</label>
    <select class="filter-select" id="sortFilter">
      <option value="default">Mặc định</option>
      <option value="price-asc">Giá: Thấp đến cao</option>
      <option value="price-desc">Giá: Cao đến thấp</option>
      <option value="name-asc">Tên: A-Z</option>
      <option value="name-desc">Tên: Z-A</option>
    </select>
  `;

  section.appendChild(filterGroup);

  // Product count
  let count = document.createElement("div");
  count.className = "product-count";
  count.id = "productCount";
  count.textContent = `Hiển thị ${products.length} sản phẩm`;
  section.appendChild(count);

  // Add event listeners
  setTimeout(() => {
    document.getElementById('categoryFilter').addEventListener('change', (e) => {
      currentCategory = e.target.value;
      currentPage = 1;
      refreshProducts();
    });

    document.getElementById('sortFilter').addEventListener('change', (e) => {
      currentSort = e.target.value;
      refreshProducts();
    });
  }, 0);

  return section;
}

// ===== CREATE PRODUCTS GRID =====
function createProductsGrid() {
  let grid = document.createElement("div");
  grid.className = "products-grid";
  grid.id = "productsGrid";

  let filteredProducts = getFilteredProducts();
  let sortedProducts = getSortedProducts(filteredProducts);
  let paginatedProducts = getPaginatedProducts(sortedProducts);

  if (paginatedProducts.length === 0) {
    let empty = document.createElement("div");
    empty.className = "empty-products";
    empty.innerHTML = `
      <h2>Không tìm thấy sản phẩm</h2>
      <p>Vui lòng thử lại với bộ lọc khác</p>
      <a href="trangchinh.html" class="btn-back-home">Về trang chủ</a>
    `;
    return empty;
  }

  paginatedProducts.forEach(product => {
    let card = createProductCard(product);
    grid.appendChild(card);
  });

  return grid;
}

// ===== CREATE PRODUCT CARD (ĐÃ SỬA LỖI) =====
function createProductCard(product) {
  let card = document.createElement("div");
  card.className = "product-card";
  card.onclick = () => {
    window.location.href = `chitiet.html?id=${product.id}`;
  };

  // SỬA: Dùng == thay vì === để so sánh string với number
  let variants = product_variants.filter(v => v.product_id == product.id);
  
  // Ưu tiên giá từ product.price, fallback sang min từ variants
  let productPrice = 0;
  if (product.price && product.price > 0) {
    productPrice = product.price;
  } else if (variants.length > 0) {
    productPrice = Math.min(...variants.map(v => v.price));
  }
  
  let priceDisplay = productPrice > 0 ? `${productPrice.toLocaleString('vi-VN')}đ` : 'Liên hệ';

  let discount = 20; // Default discount
  let originalPrice = productPrice > 0 ? Math.round(productPrice / (1 - discount / 100)) : 0;

  card.innerHTML = `
    <div class="product-image">
      <img src="${product.image}" alt="${product.name}">
      ${discount > 0 ? `<div class="sale-badge">-${discount}%</div>` : ''}
      <div class="product-actions">
        <button class="action-btn" onclick="event.stopPropagation(); addToCart(${product.id})" title="Thêm vào giỏ">🛒</button>
        <button class="action-btn" onclick="event.stopPropagation(); viewQuick(${product.id})" title="Xem nhanh">👁️</button>
      </div>
    </div>
    <div class="product-info">
      <div class="product-category">${getCategoryName(product.cate_id)}</div>
      <h3 class="product-name">${product.name}</h3>
      <div class="product-sizes">Size: ${getAvailableSizes(variants)}</div>
      <div class="product-price">
        ${originalPrice > 0 ? `<span class="original-price">${originalPrice.toLocaleString('vi-VN')}₫</span>` : ''}
        <span class="current-price">${priceDisplay}</span>
      </div>
      <div class="product-rating">
        ${'⭐'.repeat(5)}
        <span>(${Math.floor(Math.random() * 100) + 50})</span>
      </div>
    </div>
  `;

  return card;
}

// ===== HELPER FUNCTIONS =====
function getCategoryName(categoryId) {
  const categories = {
    1: 'ÁO',
    2: 'QUẦN',
    3: 'VÁY',
    4: 'GIÀY',
    5: 'ÁO THUN',
    6: 'ÁO SƠ MI'
  };
  return categories[categoryId] || 'SẢN PHẨM';
}

function getAvailableSizes(variants) {
  if (variants.length === 0) return 'S, M, L';
  
  let sizes = variants.map(v => {
    let match = v.variant_name.match(/Size\s+(\S+)/i);
    return match ? match[1] : 'M';
  });
  return [...new Set(sizes)].join(', ');
}

function getProductPrice(productId) {
  const product = products.find(p => p.id == productId);
  if (product && product.price > 0) {
    return product.price;
  }
  
  // SỬA: Dùng == thay vì ===
  let variants = product_variants.filter(v => v.product_id == productId);
  if (variants.length === 0) return 0;
  return Math.min(...variants.map(v => v.price));
}

function getFilteredProducts() {
  if (currentCategory === 'all') {
    return products;
  }
  return products.filter(p => p.cate_id == parseInt(currentCategory));
}

function getSortedProducts(productList) {
  let sorted = [...productList];
  
  switch(currentSort) {
    case 'price-asc':
      sorted.sort((a, b) => getProductPrice(a.id) - getProductPrice(b.id));
      break;
    case 'price-desc':
      sorted.sort((a, b) => getProductPrice(b.id) - getProductPrice(a.id));
      break;
    case 'name-asc':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
  }
  
  return sorted;
}

function getPaginatedProducts(productList) {
  let start = (currentPage - 1) * itemsPerPage;
  let end = start + itemsPerPage;
  return productList.slice(start, end);
}

// ===== CREATE PAGINATION =====
function createPagination() {
  let filteredProducts = getFilteredProducts();
  let totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  let pagination = document.createElement("div");
  pagination.className = "pagination";
  pagination.id = "pagination";

  if (totalPages <= 1) return pagination;

  // Previous button
  let prevBtn = document.createElement("button");
  prevBtn.className = "page-btn";
  prevBtn.textContent = "‹";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      refreshProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  pagination.appendChild(prevBtn);

  // Page numbers
  for (let i = 1; i <= totalPages; i++) {
    let pageBtn = document.createElement("button");
    pageBtn.className = "page-btn" + (i === currentPage ? " active" : "");
    pageBtn.textContent = i;
    pageBtn.onclick = () => {
      currentPage = i;
      refreshProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    pagination.appendChild(pageBtn);
  }

  // Next button
  let nextBtn = document.createElement("button");
  nextBtn.className = "page-btn";
  nextBtn.textContent = "›";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      refreshProducts();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  pagination.appendChild(nextBtn);

  return pagination;
}

// ===== REFRESH PRODUCTS =====
function refreshProducts() {
  let grid = document.getElementById('productsGrid');
  let newGrid = createProductsGrid();
  grid.replaceWith(newGrid);

  let pagination = document.getElementById('pagination');
  let newPagination = createPagination();
  pagination.replaceWith(newPagination);

  // Update count
  let filteredProducts = getFilteredProducts();
  document.getElementById('productCount').textContent = `Hiển thị ${filteredProducts.length} sản phẩm`;
}

// ===== GLOBAL FUNCTIONS =====
window.addToCart = function(productId) {
  alert(`Thêm sản phẩm ${productId} vào giỏ hàng`);
};

window.viewQuick = function(productId) {
  window.location.href = `chitiet.html?id=${productId}`;
};

// ===== INITIALIZE =====
loadData();