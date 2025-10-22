function renderRegister() {
  let container = document.createElement("div");
  container.className = "login-form";

  // Title
  let title = document.createElement("h2");
  title.className = "title";
  title.textContent = "Đăng ký tài khoản";
  container.appendChild(title);

  // Họ tên
  let nameLabel = document.createElement("div");
  nameLabel.textContent = "Họ và tên";
  container.appendChild(nameLabel);

  let nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.id = "fullname";
  nameInput.placeholder = "Nhập họ và tên của bạn";
  nameInput.required = true;
  container.appendChild(nameInput);

  // Email
  let emailLabel = document.createElement("div");
  emailLabel.textContent = "Email";
  container.appendChild(emailLabel);

  let emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.id = "email";
  emailInput.placeholder = "Nhập email của bạn";
  emailInput.required = true;
  container.appendChild(emailInput);

  // Số điện thoại
  let phoneLabel = document.createElement("div");
  phoneLabel.textContent = "Số điện thoại";
  container.appendChild(phoneLabel);

  let phoneInput = document.createElement("input");
  phoneInput.type = "text";
  phoneInput.id = "phone";
  phoneInput.placeholder = "Nhập số điện thoại";
  phoneInput.required = true;
  container.appendChild(phoneInput);

  // Mật khẩu
  let passwordLabel = document.createElement("div");
  passwordLabel.textContent = "Mật khẩu";
  container.appendChild(passwordLabel);

  let passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.placeholder = "Nhập mật khẩu (tối thiểu 6 ký tự)";
  passwordInput.required = true;
  container.appendChild(passwordInput);

  // Xác nhận mật khẩu
  let confirmPasswordLabel = document.createElement("div");
  confirmPasswordLabel.textContent = "Xác nhận mật khẩu";
  container.appendChild(confirmPasswordLabel);

  let confirmPasswordInput = document.createElement("input");
  confirmPasswordInput.type = "password";
  confirmPasswordInput.id = "confirmPassword";
  confirmPasswordInput.placeholder = "Nhập lại mật khẩu";
  confirmPasswordInput.required = true;
  container.appendChild(confirmPasswordInput);

  // Register button
  let registerBtn = document.createElement("button");
  registerBtn.className = "btn";
  registerBtn.textContent = "Đăng ký";
  registerBtn.onclick = handleRegister;
  container.appendChild(registerBtn);

  // Link to login
  let loginText = document.createElement("p");
  loginText.className = "signup";
  loginText.innerHTML = 'Đã có tài khoản? <a href="login.html">Đăng nhập ngay</a>';
  container.appendChild(loginText);

  document.getElementById("register").appendChild(container);
}

function handleRegister(e) {
  e.preventDefault();
  
  let fullname = document.getElementById("fullname").value.trim();
  let email = document.getElementById("email").value.trim();
  let phone = document.getElementById("phone").value.trim();
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  // Validation
  if (!fullname || !email || !phone || !password || !confirmPassword) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  if (password !== confirmPassword) {
    alert("Mật khẩu xác nhận không khớp!");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu phải có ít nhất 6 ký tự!");
    return;
  }

  // Validate email format
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("Email không hợp lệ!");
    return;
  }

  // Validate phone format (Vietnamese phone)
  let phoneRegex = /^(0|\+84)[0-9]{9}$/;
  if (!phoneRegex.test(phone)) {
    alert("Số điện thoại không hợp lệ! (VD: 0912345678)");
    return;
  }

  // Lưu thông tin người dùng (dùng biến thay vì localStorage trực tiếp)
  let usersData = localStorage.getItem("users");
  let users = [];
  
  if (usersData) {
    try {
      users = JSON.parse(usersData);
    } catch (e) {
      users = [];
    }
  }
  
  // Kiểm tra email đã tồn tại
  if (users.some(u => u.email === email)) {
    alert("Email đã được đăng ký!");
    return;
  }

  // Thêm user mới
  let newUser = {
    id: Date.now(),
    fullname: fullname,
    email: email,
    phone: phone,
    password: password,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  
  alert("Đăng ký thành công! Chuyển đến trang đăng nhập...");
  window.location.href = "login.html";
}

renderRegister();