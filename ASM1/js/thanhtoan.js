// thanhtoan.js - Fetch API Version
const API_URL = 'http://localhost:3000';

let products = [];
let product_variants = [];
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Redirect nếu giỏ hàng trống
if (cart.length === 0) {
  window.location.href = "giohang.html";
}


async function loadData() {
  try {
    const [productsRes, variantsRes] = await Promise.all([
      fetch(`${API_URL}/products`),
      fetch(`${API_URL}/product_variants`)
    ]);
    
    products = await productsRes.json();
    product_variants = await variantsRes.json();
    
    console.log('✅ Checkout data loaded');
    renderCheckout();
  } catch (error) {
    console.error('❌ Error loading data:', error);
    document.body.innerHTML = '<div style="text-align:center;padding:50px;"><h2>⚠️ Không thể tải trang thanh toán</h2></div>';
  }
}

// ===== RENDER CHECKOUT =====
function renderCheckout() {
  let main = document.createElement("main");
  main.className = "checkout-container";

  let breadcrumb = document.createElement("div");
  breadcrumb.className = "breadcrumb";
  breadcrumb.innerHTML = `<a href="trangchinh.html">Trang chủ</a> / <a href="giohang.html">Giỏ hàng</a> / <span>Thanh toán</span>`;
  main.appendChild(breadcrumb);

  let title = document.createElement("h1");
  title.className = "checkout-title";
  title.textContent = "THANH TOÁN";
  main.appendChild(title);

  let content = document.createElement("div");
  content.className = "checkout-content";

  // Form thông tin
  let form = createCheckoutForm();
  content.appendChild(form);

  // Order summary
  let summary = createOrderSummary();
  content.appendChild(summary);

  main.appendChild(content);

  let footer = document.getElementById("footer");
  document.body.insertBefore(main, footer);
}

// ===== CREATE CHECKOUT FORM =====
function createCheckoutForm() {
  let formContainer = document.createElement("div");
  formContainer.className = "checkout-form";

  let form = document.createElement("form");
  form.id = "checkoutForm";

  // Thông tin giao hàng
  let shippingSection = document.createElement("div");
  shippingSection.className = "form-section";
  shippingSection.innerHTML = `
    <h3>Thông tin giao hàng</h3>
    <div class="form-row">
      <div class="form-group">
        <label>Họ và tên <span class="required">*</span></label>
        <input type="text" name="fullname" required>
      </div>
      <div class="form-group">
        <label>Số điện thoại <span class="required">*</span></label>
        <input type="tel" name="phone" required>
      </div>
    </div>
    <div class="form-group">
      <label>Email <span class="required">*</span></label>
      <input type="email" name="email" required>
    </div>
    <div class="form-group">
      <label>Địa chỉ <span class="required">*</span></label>
      <input type="text" name="address" required>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Tỉnh/Thành phố <span class="required">*</span></label>
        <select name="city" required>
          <option value="">Chọn tỉnh/thành phố</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hồ Chí Minh">Hồ Chí Minh</option>
          <option value="Đà Nẵng">Đà Nẵng</option>
          <option value="Cần Thơ">Cần Thơ</option>
          <option value="Hải Phòng">Hải Phòng</option>
        </select>
      </div>
      <div class="form-group">
        <label>Quận/Huyện <span class="required">*</span></label>
        <select name="district" required>
          <option value="">Chọn quận/huyện</option>
          <option value="Quận 1">Quận 1</option>
          <option value="Quận 2">Quận 2</option>
          <option value="Quận 3">Quận 3</option>
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Ghi chú đơn hàng (tùy chọn)</label>
      <textarea name="note" placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."></textarea>
    </div>
  `;
  form.appendChild(shippingSection);

  // Phương thức thanh toán
  let paymentSection = document.createElement("div");
  paymentSection.className = "form-section";
  paymentSection.innerHTML = `
    <h3>Phương thức thanh toán</h3>
    <div class="payment-methods">
      <div class="payment-option">
        <input type="radio" id="cod" name="payment" value="cod" checked>
        <label for="cod">Thanh toán khi nhận hàng (COD)</label>
      </div>
      <div class="payment-option">
        <input type="radio" id="bank" name="payment" value="bank">
        <label for="bank">Chuyển khoản ngân hàng</label>
      </div>
      <div class="payment-option">
        <input type="radio" id="momo" name="payment" value="momo">
        <label for="momo">Ví điện tử MoMo</label>
      </div>
      <div class="payment-option">
        <input type="radio" id="vnpay" name="payment" value="vnpay">
        <label for="vnpay">VNPay</label>
      </div>
    </div>
  `;
  form.appendChild(paymentSection);

  formContainer.appendChild(form);
  return formContainer;
}

// ===== CREATE ORDER SUMMARY =====
function createOrderSummary() {
  let summary = document.createElement("div");
  summary.className = "order-summary";

  let title = document.createElement("h3");
  title.textContent = "Đơn hàng của bạn";
  summary.appendChild(title);

  // Items
  let itemsContainer = document.createElement("div");
  itemsContainer.className = "order-items";

  cart.forEach(item => {
    let variant = product_variants.find(v => v.id === item.variant_id);
    if (!variant) return;
    
    let product = products.find(p => p.id === variant.product_id);
    if (!product) return;

    let orderItem = document.createElement("div");
    orderItem.className = "order-item";

    let color = extractColor(variant.variant_name);
    let size = extractSize(variant.variant_name);

    orderItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="order-item-image">
      <div class="order-item-details">
        <h4>${product.name}</h4>
        <div class="order-item-variant">Màu: ${color} | Size: ${size}</div>
        <div class="order-item-price">
          <span>SL: ${item.quantity}</span>
          <span>${(variant.price * item.quantity).toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
    `;

    itemsContainer.appendChild(orderItem);
  });

  summary.appendChild(itemsContainer);

  // Total
  let subtotal = calculateSubtotal();
  let shipping = 30000;
  let total = subtotal + shipping;

  let totalContainer = document.createElement("div");
  totalContainer.className = "order-total";
  totalContainer.innerHTML = `
    <div class="total-row">
      <span>Tạm tính:</span>
      <span>${subtotal.toLocaleString('vi-VN')}đ</span>
    </div>
    <div class="total-row">
      <span>Phí vận chuyển:</span>
      <span>${shipping.toLocaleString('vi-VN')}đ</span>
    </div>
    <div class="total-row final">
      <span>Tổng cộng:</span>
      <span>${total.toLocaleString('vi-VN')}đ</span>
    </div>
  `;
  summary.appendChild(totalContainer);

  // Button
  let placeOrderBtn = document.createElement("button");
  placeOrderBtn.type = "button";
  placeOrderBtn.className = "btn-place-order";
  placeOrderBtn.textContent = "ĐẶT HÀNG";
  placeOrderBtn.onclick = handlePlaceOrder;
  summary.appendChild(placeOrderBtn);

  return summary;
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

// ===== HANDLE PLACE ORDER =====
async function handlePlaceOrder() {
  let form = document.getElementById('checkoutForm');
  
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Lấy thông tin từ form
  let formData = new FormData(form);
  
  // Tạo order data để gửi lên API
  let orderData = {
    user_id: 1, // Mặc định user 1 (sau này có thể lấy từ login)
    created_date: new Date().toISOString().split('T')[0],
    status: "Đang xử lý"
  };

  try {
    // 1. Tạo order mới
    const orderRes = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    
    const newOrder = await orderRes.json();
    console.log('✅ Order created:', newOrder);

    // 2. Tạo order details
    const orderDetailsPromises = cart.map(item => {
      const variant = product_variants.find(v => v.id === item.variant_id);
      return fetch(`${API_URL}/order_details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: newOrder.id,
          product_id: variant.product_id,
          quantity: item.quantity,
          unit_price: variant.price
        })
      });
    });

    await Promise.all(orderDetailsPromises);
    console.log('✅ Order details created');

    // 3. Lưu thông tin đơn hàng vào localStorage (để hiển thị trang cảm ơn)
    let customerInfo = {
      fullname: formData.get('fullname'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      address: formData.get('address'),
      city: formData.get('city'),
      district: formData.get('district'),
      note: formData.get('note')
    };

    let lastOrder = {
      orderNumber: 'HQ' + newOrder.id,
      orderId: newOrder.id,
      customer: customerInfo,
      payment: formData.get('payment'),
      items: cart.map(item => {
        const variant = product_variants.find(v => v.id === item.variant_id);
        const product = products.find(p => p.id === variant.product_id);
        return {
          product: product,
          variant: variant,
          quantity: item.quantity
        };
      }),
      subtotal: calculateSubtotal(),
      shipping: 30000,
      total: calculateSubtotal() + 30000,
      orderDate: new Date().toISOString()
    };

    localStorage.setItem('lastOrder', JSON.stringify(lastOrder));
    
    // 4. Xóa giỏ hàng
    localStorage.removeItem('cart');
    
    // 5. Chuyển đến trang cảm ơn
    alert('✅ Đặt hàng thành công!');
    window.location.href = "camondathang.html";
    
  } catch (error) {
    console.error('❌ Error placing order:', error);
    alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!');
  }
}

// ===== INITIALIZE =====
loadData();