// giohang.js - Fetch API Version
const API_URL = 'http://localhost:3000';

let products = [];
let product_variants = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// ===== LOAD DATA FROM API =====
async function loadData() {
  try {
    const [productsRes, variantsRes] = await Promise.all([
      fetch(`${API_URL}/products`),
      fetch(`${API_URL}/product_variants`)
    ]);
    
    products = await productsRes.json();
    product_variants = await variantsRes.json();
    
    console.log('✅ Cart data loaded');
    renderCart();
  } catch (error) {
    console.error('❌ Error loading data:', error);
    document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h2>⚠️ Không thể tải giỏ hàng</h2></div>';
  }
}

// ===== RENDER CART =====
function renderCart() {
  let main = document.createElement("main");
  main.className = "cart-container";

  let breadcrumb = document.createElement("div");
  breadcrumb.className = "breadcrumb";
  breadcrumb.innerHTML = `<a href="trangchinh.html">Trang chủ</a> / <span>Giỏ hàng</span>`;
  main.appendChild(breadcrumb);

  let title = document.createElement("h1");
  title.className = "cart-title";
  title.textContent = "GIỎ HÀNG CỦA BẠN";
  main.appendChild(title);

  if (cart.length === 0) {
    // Giỏ hàng trống
    let emptyCart = document.createElement("div");
    emptyCart.className = "empty-cart";
    emptyCart.innerHTML = `
      <div class="empty-icon">🛒</div>
      <h2>Giỏ hàng trống</h2>
      <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
      <a href="trangchinh.html" class="btn-continue">Tiếp tục mua sắm</a>
    `;
    main.appendChild(emptyCart);
  } else {
    // Giỏ hàng có sản phẩm
    let cartContent = document.createElement("div");
    cartContent.className = "cart-content";

    // === Bảng sản phẩm ===
    let cartTable = document.createElement("div");
    cartTable.className = "cart-table";

    // Header
    let tableHeader = document.createElement("div");
    tableHeader.className = "cart-header";
    tableHeader.innerHTML = `
      <div class="col-product">Sản phẩm</div>
      <div class="col-price">Đơn giá</div>
      <div class="col-quantity">Số lượng</div>
      <div class="col-total">Thành tiền</div>
      <div class="col-action"></div>
    `;
    cartTable.appendChild(tableHeader);

    // Cart items
    cart.forEach((item, index) => {
      let variant = product_variants.find(v => v.id === item.variant_id);
      if (!variant) return;
      
      let product = products.find(p => p.id === variant.product_id);
      if (!product) return;

      let cartItem = createCartItem(product, variant, item.quantity, index);
      cartTable.appendChild(cartItem);
    });

    cartContent.appendChild(cartTable);

    let cartSummary = document.createElement("div");
    cartSummary.className = "cart-summary";

    let summaryTitle = document.createElement("h3");
    summaryTitle.textContent = "TỔNG ĐƠN HÀNG";
    cartSummary.appendChild(summaryTitle);

    let summaryContent = document.createElement("div");
    summaryContent.className = "summary-content";

    let subtotal = calculateSubtotal();
    let shipping = 30000;
    let total = subtotal + shipping;

    summaryContent.innerHTML = `
      <div class="summary-row">
        <span>Tạm tính:</span>
        <span class="summary-value">${subtotal.toLocaleString('vi-VN')}đ</span>
      </div>
      <div class="summary-row">
        <span>Phí vận chuyển:</span>
        <span class="summary-value">${shipping.toLocaleString('vi-VN')}đ</span>
      </div>
      <div class="summary-divider"></div>
      <div class="summary-row total-row">
        <span>Tổng cộng:</span>
        <span class="summary-total">${total.toLocaleString('vi-VN')}đ</span>
      </div>
    `;

    cartSummary.appendChild(summaryContent);

    // Voucher
    let voucherBox = document.createElement("div");
    voucherBox.className = "voucher-box";
    voucherBox.innerHTML = `
      <input type="text" placeholder="Nhập mã giảm giá" class="voucher-input">
      <button class="btn-voucher">Áp dụng</button>
    `;
    cartSummary.appendChild(voucherBox);

    // Checkout button
    let checkoutBtn = document.createElement("button");
    checkoutBtn.className = "btn-checkout";
    checkoutBtn.textContent = "THANH TOÁN";
    checkoutBtn.onclick = () => {
      window.location.href = "thanhtoan.html";
    };
    cartSummary.appendChild(checkoutBtn);

    let continueBtn = document.createElement("a");
    continueBtn.href = "trangchinh.html";
    continueBtn.className = "btn-continue-shopping";
    continueBtn.textContent = "Tiếp tục mua sắm";
    cartSummary.appendChild(continueBtn);

    cartContent.appendChild(cartSummary);
    main.appendChild(cartContent);
  }

  // Insert vào body
  let footer = document.getElementById("footer");
  document.body.insertBefore(main, footer);
}

// ===== HELPER FUNCTIONS =====
function extractColor(variantName) {
  let match = variantName.match(/Màu\s+(\S+)/i);
  return match ? match[1] : variantName.split('-')[0].trim();
}

function extractSize(variantName) {
  let match = variantName.match(/Size\s+(\S+)/i);
  return match ? match[1] : variantName.split('-')[1]?.trim() || "M";
}

// ===== CREATE CART ITEM =====
function createCartItem(product, variant, quantity, index) {
  let item = document.createElement("div");
  item.className = "cart-item";

  // Product info
  let productCol = document.createElement("div");
  productCol.className = "col-product";
  
  let productInfo = document.createElement("div");
  productInfo.className = "product-info-cart";
  
  let img = document.createElement("img");
  img.src = product.image;
  img.alt = product.name;
  
  let color = extractColor(variant.variant_name);
  let size = extractSize(variant.variant_name);
  
  let details = document.createElement("div");
  details.className = "product-details";
  details.innerHTML = `
    <h4>${product.name}</h4>
    <p class="variant-info">Màu: ${color} | Size: ${size}</p>
  `;
  
  productInfo.appendChild(img);
  productInfo.appendChild(details);
  productCol.appendChild(productInfo);

  // Price
  let priceCol = document.createElement("div");
  priceCol.className = "col-price";
  priceCol.textContent = variant.price.toLocaleString('vi-VN') + "đ";

  // Quantity
  let quantityCol = document.createElement("div");
  quantityCol.className = "col-quantity";
  
  let quantityBox = document.createElement("div");
  quantityBox.className = "quantity-box";
  
  let btnMinus = document.createElement("button");
  btnMinus.className = "btn-quantity";
  btnMinus.textContent = "-";
  btnMinus.onclick = () => updateQuantity(index, -1);
  
  let quantityInput = document.createElement("input");
  quantityInput.type = "number";
  quantityInput.value = quantity;
  quantityInput.min = 1;
  quantityInput.onchange = (e) => setQuantity(index, parseInt(e.target.value));
  
  let btnPlus = document.createElement("button");
  btnPlus.className = "btn-quantity";
  btnPlus.textContent = "+";
  btnPlus.onclick = () => updateQuantity(index, 1);
  
  quantityBox.appendChild(btnMinus);
  quantityBox.appendChild(quantityInput);
  quantityBox.appendChild(btnPlus);
  quantityCol.appendChild(quantityBox);

  // Total
  let totalCol = document.createElement("div");
  totalCol.className = "col-total";
  totalCol.textContent = (variant.price * quantity).toLocaleString('vi-VN') + "đ";

  // Remove button
  let actionCol = document.createElement("div");
  actionCol.className = "col-action";
  
  let removeBtn = document.createElement("button");
  removeBtn.className = "btn-remove";
  removeBtn.innerHTML = "×";
  removeBtn.onclick = () => removeItem(index);
  actionCol.appendChild(removeBtn);

  item.appendChild(productCol);
  item.appendChild(priceCol);
  item.appendChild(quantityCol);
  item.appendChild(totalCol);
  item.appendChild(actionCol);

  return item;
}

// ===== CALCULATE SUBTOTAL =====
function calculateSubtotal() {
  let total = 0;
  cart.forEach(item => {
    let variant = product_variants.find(v => v.id === item.variant_id);
    if (variant) {
      total += variant.price * item.quantity;
    }
  });
  return total;
}

// ===== UPDATE QUANTITY =====
function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity < 1) {
    cart[index].quantity = 1;
  }
  saveCart();
  refreshCart();
}

// ===== SET QUANTITY =====
function setQuantity(index, value) {
  if (value < 1) value = 1;
  cart[index].quantity = value;
  saveCart();
  refreshCart();
}

// ===== REMOVE ITEM =====
function removeItem(index) {
  if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    cart.splice(index, 1);
    saveCart();
    refreshCart();
  }
}

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// ===== REFRESH CART =====
function refreshCart() {
  document.querySelector('.cart-container').remove();
  renderCart();
}

// ===== INITIALIZE =====
loadData();