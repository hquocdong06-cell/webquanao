import { products, product_variants } from "./data.js";

let orderData = JSON.parse(localStorage.getItem('lastOrder'));

// Redirect nếu không có đơn hàng
if (!orderData) {
  window.location.href = "trangchinh.html";
}

function renderThankYou() {
  let main = document.createElement("main");
  main.className = "thankyou-container";

  // Success animation
  let animation = document.createElement("div");
  animation.className = "success-animation";
  animation.innerHTML = '<div class="checkmark"></div>';
  main.appendChild(animation);

  // Title
  let title = document.createElement("h1");
  title.className = "thankyou-title";
  title.textContent = "CÁM ƠN BẠN ĐÃ ĐẶT HÀNG!";
  main.appendChild(title);

  // Subtitle
  let subtitle = document.createElement("p");
  subtitle.className = "thankyou-subtitle";
  subtitle.textContent = "Đơn hàng của bạn đã được tiếp nhận và đang được xử lý";
  main.appendChild(subtitle);

  // Order info box
  let infoBox = document.createElement("div");
  infoBox.className = "order-info-box";

  // Order number
  let orderNumber = document.createElement("div");
  orderNumber.className = "order-number";
  orderNumber.innerHTML = `Mã đơn hàng: <span>${orderData.orderNumber}</span>`;
  infoBox.appendChild(orderNumber);

  // Info grid
  let infoGrid = document.createElement("div");
  infoGrid.className = "info-grid";

  // Customer info
  let customerSection = document.createElement("div");
  customerSection.className = "info-section";
  customerSection.innerHTML = `
    <h3>Thông tin khách hàng</h3>
    <div class="info-item">
      <span class="info-label">Họ và tên:</span>
      <span class="info-value">${orderData.customer.fullname}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Số điện thoại:</span>
      <span class="info-value">${orderData.customer.phone}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Email:</span>
      <span class="info-value">${orderData.customer.email}</span>
    </div>
  `;
  infoGrid.appendChild(customerSection);

  // Shipping info
  let shippingSection = document.createElement("div");
  shippingSection.className = "info-section";
  shippingSection.innerHTML = `
    <h3>Địa chỉ giao hàng</h3>
    <div class="info-item">
      <span class="info-label">Địa chỉ:</span>
      <span class="info-value">${orderData.customer.address}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Quận/Huyện:</span>
      <span class="info-value">${orderData.customer.district}</span>
    </div>
    <div class="info-item">
      <span class="info-label">Tỉnh/Thành phố:</span>
      <span class="info-value">${orderData.customer.city}</span>
    </div>
  `;
  infoGrid.appendChild(shippingSection);

  infoBox.appendChild(infoGrid);

  // Order items section
  let itemsSection = document.createElement("div");
  itemsSection.className = "order-items-section";
  
  let itemsTitle = document.createElement("h3");
  itemsTitle.textContent = "Sản phẩm đã đặt";
  itemsSection.appendChild(itemsTitle);

  orderData.items.forEach(item => {
    let variant = product_variants.find(v => v.id === item.variant_id);
    if (!variant) return;
    
    let product = products.find(p => p.id === variant.product_id);
    if (!product) return;

    let orderedItem = document.createElement("div");
    orderedItem.className = "ordered-item";

    let color = extractColor(variant.variant_name);
    let size = extractSize(variant.variant_name);

    orderedItem.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="ordered-item-image">
      <div class="ordered-item-details">
        <h4>${product.name}</h4>
        <div class="ordered-item-variant">Màu: ${color} | Size: ${size}</div>
        <div class="ordered-item-price">
          <span>Số lượng: ${item.quantity}</span>
          <span>${(variant.price * item.quantity).toLocaleString('vi-VN')}đ</span>
        </div>
      </div>
    `;

    itemsSection.appendChild(orderedItem);
  });

  infoBox.appendChild(itemsSection);

  // Order summary
  let summary = document.createElement("div");
  summary.className = "order-summary";
  summary.innerHTML = `
    <div class="summary-row">
      <span>Tạm tính:</span>
      <span>${orderData.subtotal.toLocaleString('vi-VN')}đ</span>
    </div>
    <div class="summary-row">
      <span>Phí vận chuyển:</span>
      <span>${orderData.shipping.toLocaleString('vi-VN')}đ</span>
    </div>
    <div class="summary-row total">
      <span>Tổng cộng:</span>
      <span>${orderData.total.toLocaleString('vi-VN')}đ</span>
    </div>
  `;
  infoBox.appendChild(summary);

  main.appendChild(infoBox);

  // Action buttons
  let buttons = document.createElement("div");
  buttons.className = "action-buttons";
  buttons.innerHTML = `
    <a href="trangchinh.html" class="btn-action btn-primary">Tiếp tục mua sắm</a>
    <a href="#" class="btn-action btn-secondary" onclick="window.print(); return false;">In đơn hàng</a>
  `;
  main.appendChild(buttons);

  // Contact info
  let contactInfo = document.createElement("div");
  contactInfo.className = "contact-info";
  contactInfo.innerHTML = `
    <h3>Cần hỗ trợ?</h3>
    <p>Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ:</p>
    <p>📞 Hotline: <a href="tel:1900xxxx">1900 xxxx</a></p>
    <p>📧 Email: <a href="mailto:support@hqstore.com">support@hqstore.com</a></p>
    <p>Chúng tôi sẽ gửi email xác nhận đơn hàng đến <strong>${orderData.customer.email}</strong></p>
  `;
  main.appendChild(contactInfo);

  let footer = document.getElementById("footer");
  document.body.insertBefore(main, footer);
}

// Helper functions
function extractColor(variantName) {
  let match = variantName.match(/Màu\s+(\S+)/i);
  return match ? match[1] : variantName.split('-')[0].trim();
}

function extractSize(variantName) {
  let match = variantName.match(/Size\s+(\S+)/i);
  return match ? match[1] : variantName.split('-')[1]?.trim() || "M";
}

renderThankYou();