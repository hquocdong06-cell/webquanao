// admin.js - Gọi API trực tiếp không cần api.js
const API_URL = 'http://localhost:3000'; // JSON Server URL

let appData = {
  categories: [],
  products: [],
  product_variants: [],
  users: [],
  orders: [],
  order_details: []
};

// ===== FETCH HELPER =====
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    
    if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    alert('Lỗi kết nối API: ' + error.message);
    throw error;
  }
}

// ===== LOAD DATA =====
async function loadAllData() {
  showLoading();
  try {
    const [categories, products, variants, users, orders, orderDetails] = await Promise.all([
      fetchAPI('/categories'),
      fetchAPI('/products'),
      fetchAPI('/product_variants'),
      fetchAPI('/users'),
      fetchAPI('/orders'),
      fetchAPI('/order_details')
    ]);
    
    appData = {
      categories,
      products,
      product_variants: variants,
      users,
      orders,
      order_details: orderDetails
    };
    
    console.log('✅ Data loaded:', appData);
  } catch (error) {
    console.error('❌ Load error:', error);
  } finally {
    hideLoading();
  }
}

// ===== LOADING INDICATOR =====
function showLoading() {
  let loading = document.getElementById('loading');
  if (!loading) {
    loading = document.createElement('div');
    loading.id = 'loading';
    loading.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;justify-content:center;align-items:center;z-index:9999;';
    loading.innerHTML = '<div style="background:white;padding:20px;border-radius:8px;font-size:18px;">⏳ Đang tải...</div>';
    document.body.appendChild(loading);
  }
}

function hideLoading() {
  const loading = document.getElementById('loading');
  if (loading) loading.remove();
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', async () => {
  await loadAllData();
  renderPage('products');
  setupNavigation();
});

// ===== NAVIGATION =====
function setupNavigation() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', async (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      await renderPage(item.dataset.page);
    });
  });
}

async function renderPage(page) {
  const contentBody = document.getElementById('contentBody');
  const pageTitle = document.getElementById('pageTitle');
  
  const titles = {
    'dashboard': 'Dashboard',
    'products': 'Quản lý sản phẩm',
    'categories': 'Quản lý danh mục',
    'orders': 'Quản lý đơn hàng',
    'customers': 'Quản lý khách hàng'
  };
  
  pageTitle.textContent = titles[page] || 'Dashboard';
  
  showLoading();
  try {
    switch(page) {
      case 'dashboard':
        renderDashboard(contentBody);
        break;
      case 'products':
        appData.products = await fetchAPI('/products');
        renderProducts(contentBody);
        break;
      case 'categories':
        appData.categories = await fetchAPI('/categories');
        renderCategories(contentBody);
        break;
      case 'orders':
        appData.orders = await fetchAPI('/orders');
        renderOrders(contentBody);
        break;
      case 'customers':
        appData.users = await fetchAPI('/users');
        renderCustomers(contentBody);
        break;
    }
  } finally {
    hideLoading();
  }
}

// ===== DASHBOARD =====
function renderDashboard(container) {
  container.innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-title">Tổng sản phẩm</div>
        <div class="stat-value">${appData.products.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🛒</div>
        <div class="stat-title">Đơn hàng</div>
        <div class="stat-value">${appData.orders.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-title">Khách hàng</div>
        <div class="stat-value">${appData.users.length}</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📂</div>
        <div class="stat-title">Danh mục</div>
        <div class="stat-value">${appData.categories.length}</div>
      </div>
    </div>
  `;
}

// ===== PRODUCTS =====
function renderProducts(container) {
  container.innerHTML = `
    <div class="table-container">
      <div class="table-header">
        <h3>Danh sách sản phẩm (${appData.products.length})</h3>
        <button class="btn btn-primary" onclick="openAddProductModal()">➕ Thêm sản phẩm</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Danh mục</th>
            <th>Giá (₫)</th>
            <th>Mô tả</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${appData.products.map(p => {
            const cat = appData.categories.find(c => c.id === p.cate_id);
            return `
              <tr>
                <td>${p.id}</td>
                <td><img src="${p.image}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;"></td>
                <td><strong>${p.name}</strong></td>
                <td><span class="badge badge-info">${cat ? cat.name : 'N/A'}</span></td>
                <td><strong>${p.price ? p.price.toLocaleString('vi-VN') : '0'}₫</strong></td>
                <td>${p.detail || ''}</td>
                <td>
                  <button class="btn btn-warning btn-sm" onclick="editProduct('${p.id}')">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteProduct('${p.id}')">🗑️ Xóa</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    ${createProductModal()}
  `;
}

function createProductModal() {
  return `
    <div class="modal" id="productModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="productModalTitle">Thêm sản phẩm mới</h3>
          <button class="close-modal" onclick="closeProductModal()">×</button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="productId">
          
          <div class="form-group">
            <label>Tên sản phẩm *</label>
            <input type="text" id="productName" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label>Danh mục *</label>
            <select id="productCategory" class="form-control" required>
              <option value="">-- Chọn danh mục --</option>
              ${appData.categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label>Giá (₫) *</label>
            <input type="number" id="productPrice" class="form-control" min="0" placeholder="150000" required>
          </div>
          
          <div class="form-group">
            <label>Mô tả</label>
            <textarea id="productDetail" class="form-control" rows="3"></textarea>
          </div>
          
          <div class="form-group">
            <label>URL Hình ảnh</label>
            <input type="text" id="productImage" class="form-control" placeholder="img/product.jpg">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeProductModal()">Hủy</button>
          <button class="btn btn-primary" onclick="saveProduct()">💾 Lưu</button>
        </div>
      </div>
    </div>
  `;
}

window.openAddProductModal = function() {
  document.getElementById('productModalTitle').textContent = 'Thêm sản phẩm mới';
  document.getElementById('productId').value = '';
  document.getElementById('productName').value = '';
  document.getElementById('productCategory').value = '';
  document.getElementById('productPrice').value = '';
  document.getElementById('productDetail').value = '';
  document.getElementById('productImage').value = '';
  document.getElementById('productModal').classList.add('active');
}

window.closeProductModal = function() {
  document.getElementById('productModal').classList.remove('active');
}

window.editProduct = async function(id) {
  try {
    showLoading();
    const product = await fetchAPI(`/products/${id}`);
    if (product) {
      document.getElementById('productModalTitle').textContent = 'Chỉnh sửa sản phẩm';
      document.getElementById('productId').value = product.id;
      document.getElementById('productName').value = product.name;
      document.getElementById('productCategory').value = product.cate_id;
      document.getElementById('productPrice').value = product.price || '';
      document.getElementById('productDetail').value = product.detail || '';
      document.getElementById('productImage').value = product.image;
      document.getElementById('productModal').classList.add('active');
    }
  } catch (error) {
    console.error('Error loading product:', error);
    alert(`⚠️ Không tìm thấy sản phẩm!\nID: ${id}\nLỗi: ${error.message}`);
  } finally {
    hideLoading();
  }
}

window.saveProduct = async function() {
  const id = document.getElementById('productId').value;
  const productData = {
    name: document.getElementById('productName').value,
    cate_id: parseInt(document.getElementById('productCategory').value),
    price: parseInt(document.getElementById('productPrice').value) || 0,
    detail: document.getElementById('productDetail').value,
    image: document.getElementById('productImage').value || 'img/default.jpg'
  };
  
  if (!productData.name || !productData.cate_id || !productData.price) {
    alert('⚠️ Vui lòng điền đầy đủ thông tin (bao gồm giá)!');
    return;
  }
  
  showLoading();
  try {
    if (id) {
      // UPDATE
      await fetchAPI(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData)
      });
      alert('✅ Cập nhật sản phẩm thành công!');
    } else {
      // CREATE
      await fetchAPI('/products', {
        method: 'POST',
        body: JSON.stringify(productData)
      });
      alert('✅ Thêm sản phẩm thành công!');
    }
    closeProductModal();
    await renderPage('products');
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  } finally {
    hideLoading();
  }
}

window.deleteProduct = async function(id) {
  if (!confirm('❓ Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
  
  showLoading();
  try {
    await fetchAPI(`/products/${id}`, { method: 'DELETE' });
    alert('✅ Đã xóa sản phẩm!');
    await renderPage('products');
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  } finally {
    hideLoading();
  }
}

// ===== CATEGORIES =====
function renderCategories(container) {
  container.innerHTML = `
    <div class="table-container">
      <div class="table-header">
        <h3>Danh sách danh mục (${appData.categories.length})</h3>
        <button class="btn btn-primary" onclick="openAddCategoryModal()">➕ Thêm danh mục</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Hình ảnh</th>
            <th>Tên danh mục</th>
            <th>Danh mục cha</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${appData.categories.map(c => {
            const parent = appData.categories.find(p => p.id === c.parent_id);
            return `
              <tr>
                <td>${c.id}</td>
                <td><img src="${c.image}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;"></td>
                <td><strong>${c.name}</strong></td>
                <td>${parent ? parent.name : '-'}</td>
                <td>
                  <button class="btn btn-warning btn-sm" onclick="editCategory(${c.id})">✏️ Sửa</button>
                  <button class="btn btn-danger btn-sm" onclick="deleteCategory(${c.id})">🗑️ Xóa</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
    
    ${createCategoryModal()}
  `;
}

function createCategoryModal() {
  return `
    <div class="modal" id="categoryModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="categoryModalTitle">Thêm danh mục mới</h3>
          <button class="close-modal" onclick="closeCategoryModal()">×</button>
        </div>
        <div class="modal-body">
          <input type="hidden" id="categoryId">
          
          <div class="form-group">
            <label>Tên danh mục *</label>
            <input type="text" id="categoryName" class="form-control" required>
          </div>
          
          <div class="form-group">
            <label>Danh mục cha</label>
            <select id="categoryParent" class="form-control">
              <option value="">-- Không có --</option>
              ${appData.categories.filter(c => !c.parent_id).map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
            </select>
          </div>
          
          <div class="form-group">
            <label>URL Hình ảnh</label>
            <input type="text" id="categoryImage" class="form-control" placeholder="img/category.jpg">
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="closeCategoryModal()">Hủy</button>
          <button class="btn btn-primary" onclick="saveCategory()">💾 Lưu</button>
        </div>
      </div>
    </div>
  `;
}

window.openAddCategoryModal = function() {
  document.getElementById('categoryModalTitle').textContent = 'Thêm danh mục mới';
  document.getElementById('categoryId').value = '';
  document.getElementById('categoryName').value = '';
  document.getElementById('categoryParent').value = '';
  document.getElementById('categoryImage').value = '';
  document.getElementById('categoryModal').classList.add('active');
}

window.closeCategoryModal = function() {
  document.getElementById('categoryModal').classList.remove('active');
}

window.editCategory = async function(id) {
  const category = await fetchAPI(`/categories/${id}`);
  if (category) {
    document.getElementById('categoryModalTitle').textContent = 'Chỉnh sửa danh mục';
    document.getElementById('categoryId').value = category.id;
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryParent').value = category.parent_id || '';
    document.getElementById('categoryImage').value = category.image;
    document.getElementById('categoryModal').classList.add('active');
  }
}

window.saveCategory = async function() {
  const id = document.getElementById('categoryId').value;
  const categoryData = {
    name: document.getElementById('categoryName').value,
    parent_id: document.getElementById('categoryParent').value ? parseInt(document.getElementById('categoryParent').value) : null,
    image: document.getElementById('categoryImage').value || 'img/default.jpg'
  };
  
  if (!categoryData.name) {
    alert('⚠️ Vui lòng nhập tên danh mục!');
    return;
  }
  
  showLoading();
  try {
    if (id) {
      await fetchAPI(`/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
      });
      alert('✅ Cập nhật danh mục thành công!');
    } else {
      await fetchAPI('/categories', {
        method: 'POST',
        body: JSON.stringify(categoryData)
      });
      alert('✅ Thêm danh mục thành công!');
    }
    closeCategoryModal();
    await renderPage('categories');
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  } finally {
    hideLoading();
  }
}

window.deleteCategory = async function(id) {
  const hasProducts = appData.products.some(p => p.cate_id === id);
  if (hasProducts) {
    alert('⚠️ Không thể xóa danh mục đang có sản phẩm!');
    return;
  }
  
  if (!confirm('❓ Bạn có chắc chắn muốn xóa danh mục này?')) return;
  
  showLoading();
  try {
    await fetchAPI(`/categories/${id}`, { method: 'DELETE' });
    alert('✅ Đã xóa danh mục!');
    await renderPage('categories');
  } catch (error) {
    alert('❌ Lỗi: ' + error.message);
  } finally {
    hideLoading();
  }
}

// ===== ORDERS =====
function renderOrders(container) {
  container.innerHTML = `
    <div class="table-container">
      <div class="table-header">
        <h3>Danh sách đơn hàng (${appData.orders.length})</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Ngày đặt</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          ${appData.orders.map(o => {
            const user = appData.users.find(u => u.id === o.user_id);
            return `
              <tr>
                <td>#${o.id}</td>
                <td>${user ? user.name : 'N/A'}</td>
                <td>${o.created_date}</td>
                <td><span class="badge badge-info">${o.status}</span></td>
                <td>
                  <button class="btn btn-primary btn-sm" onclick="viewOrder(${o.id})">👁️ Xem</button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

window.viewOrder = function(id) {
  alert('Chi tiết đơn hàng #' + id);
}

// ===== CUSTOMERS =====
function renderCustomers(container) {
  container.innerHTML = `
    <div class="table-container">
      <div class="table-header">
        <h3>Danh sách khách hàng (${appData.users.length})</h3>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Địa chỉ</th>
          </tr>
        </thead>
        <tbody>
          ${appData.users.map(u => `
            <tr>
              <td>${u.id}</td>
              <td><strong>${u.name}</strong></td>
              <td>${u.email}</td>
              <td>${u.phone}</td>
              <td>${u.address}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}