// profile.js - Render form thông tin khách hàng

function renderProfile() {
  // Kiểm tra đăng nhập
  let currentUserData = sessionStorage.getItem("currentUser");
  
  if (!currentUserData) {
    alert("Vui lòng đăng nhập để xem thông tin!");
    window.location.href = "login.html";
    return;
  }

  let userData = JSON.parse(currentUserData);
  
  // Tạo đối tượng Customer từ dữ liệu đã đăng nhập
  let customer = new Customer(
    userData.fullname || "Khách hàng",
    userData.email,
    userData.phone || "Chưa cập nhật"
  );

  let container = document.createElement("div");
  container.className = "profile-container";

  // Header
  let header = document.createElement("div");
  header.className = "profile-header";
  
  let avatar = document.createElement("div");
  avatar.className = "profile-avatar";
  avatar.innerHTML = "👤";
  
  let headerInfo = document.createElement("div");
  headerInfo.className = "profile-header-info";
  
  let welcomeText = document.createElement("h2");
  welcomeText.textContent = `Xin chào, ${customer.name}!`;
  
  let infoText = document.createElement("p");
  infoText.className = "info-summary";
  infoText.textContent = customer.getInfo();
  
  headerInfo.appendChild(welcomeText);
  headerInfo.appendChild(infoText);
  header.appendChild(avatar);
  header.appendChild(headerInfo);
  container.appendChild(header);

  // Form thông tin
  let form = document.createElement("div");
  form.className = "profile-form";

  let formTitle = document.createElement("h3");
  formTitle.textContent = "THÔNG TIN TÀI KHOẢN";
  formTitle.style.marginBottom = "20px";
  formTitle.style.color = "#333";
  form.appendChild(formTitle);

  // Họ và tên
  let nameGroup = createFormGroup("Họ và tên", "name", "text", customer.name);
  form.appendChild(nameGroup);

  // Email
  let emailGroup = createFormGroup("Email", "email", "email", customer.email);
  form.appendChild(emailGroup);

  // Số điện thoại
  let phoneGroup = createFormGroup("Số điện thoại", "phone", "tel", customer.phone);
  form.appendChild(phoneGroup);

  // Địa chỉ
  let addressGroup = createFormGroup("Địa chỉ", "address", "text", "Chưa cập nhật");
  form.appendChild(addressGroup);

  // Buttons
  let btnGroup = document.createElement("div");
  btnGroup.className = "button-group";

  let saveBtn = document.createElement("button");
  saveBtn.className = "btn btn-primary";
  saveBtn.textContent = "Lưu thay đổi";
  saveBtn.onclick = () => handleSaveProfile(customer);

  let logoutBtn = document.createElement("button");
  logoutBtn.className = "btn btn-secondary";
  logoutBtn.textContent = "Đăng xuất";
  logoutBtn.onclick = handleLogout;

  btnGroup.appendChild(saveBtn);
  btnGroup.appendChild(logoutBtn);
  form.appendChild(btnGroup);

  container.appendChild(form);

  // Order history section
  let orderSection = document.createElement("div");
  orderSection.className = "order-history";
  
  let orderTitle = document.createElement("h3");
  orderTitle.textContent = "LỊCH SỬ ĐƠN HÀNG";
  orderTitle.style.marginBottom = "20px";
  orderTitle.style.color = "#333";
  orderSection.appendChild(orderTitle);

  let emptyOrder = document.createElement("p");
  emptyOrder.className = "empty-message";
  emptyOrder.textContent = "Bạn chưa có đơn hàng nào.";
  orderSection.appendChild(emptyOrder);

  container.appendChild(orderSection);

  document.getElementById("profile").appendChild(container);
}

// Hàm tạo form group
function createFormGroup(label, id, type, value) {
  let group = document.createElement("div");
  group.className = "form-group";

  let labelEl = document.createElement("label");
  labelEl.textContent = label;
  labelEl.setAttribute("for", id);
  group.appendChild(labelEl);

  let input = document.createElement("input");
  input.type = type;
  input.id = id;
  input.value = value;
  input.className = "form-input";
  group.appendChild(input);

  return group;
}

// Hàm lưu thông tin
function handleSaveProfile(customer) {
  let name = document.getElementById("name").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let address = document.getElementById("address").value.trim();

  if (!name || !email || !phone) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    return;
  }

  // Validate email bằng setter
  try {
    customer.email = email;
  } catch (e) {
    alert(e.message);
    return;
  }

  // Cập nhật thông tin
  customer.name = name;
  customer.phone = phone;

  // Lưu vào session
  let currentUserData = JSON.parse(sessionStorage.getItem("currentUser"));
  currentUserData.fullname = name;
  currentUserData.email = email;
  currentUserData.phone = phone;
  currentUserData.address = address;
  
  sessionStorage.setItem("currentUser", JSON.stringify(currentUserData));

  // Cập nhật vào localStorage users
  let usersData = localStorage.getItem("users");
  if (usersData) {
    let users = JSON.parse(usersData);
    let userIndex = users.findIndex(u => u.id === currentUserData.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...currentUserData };
      localStorage.setItem("users", JSON.stringify(users));
    }
  }

  alert("Cập nhật thông tin thành công!");
  console.log(customer.getInfo()); // Dùng getter để hiển thị
}

// Hàm đăng xuất
function handleLogout() {
  if (confirm("Bạn có chắc muốn đăng xuất?")) {
    sessionStorage.removeItem("currentUser");
    alert("Đăng xuất thành công!");
    window.location.href = "trangchinh.html";
  }
}

renderProfile();