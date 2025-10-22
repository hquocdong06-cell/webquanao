function renderLogin() {
  let container = document.createElement("div");
  container.className = "login-form";

  // Title
  let title = document.createElement("h2");
  title.className = "title";
  title.textContent = "Đăng nhập";
  container.appendChild(title);

  // Email label and input
  let emailLabel = document.createElement("div");
  emailLabel.textContent = "Email";
  container.appendChild(emailLabel);

  let emailInput = document.createElement("input");
  emailInput.type = "text";
  emailInput.id = "email";
  emailInput.placeholder = "Nhập email của bạn";
  emailInput.required = true;
  container.appendChild(emailInput);

  // Password label and input
  let passwordLabel = document.createElement("div");
  passwordLabel.textContent = "Mật khẩu";
  container.appendChild(passwordLabel);

  let passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.placeholder = "Nhập mật khẩu";
  passwordInput.required = true;
  container.appendChild(passwordInput);

  // Forgot password link
  let forgotLink = document.createElement("a");
  forgotLink.href = "#";
  forgotLink.className = "forgot";
  forgotLink.textContent = "Quên mật khẩu?";
  forgotLink.onclick = (e) => {
    e.preventDefault();
    alert("Chức năng khôi phục mật khẩu");
  };
  container.appendChild(forgotLink);

  // Login button
  let loginBtn = document.createElement("button");
  loginBtn.className = "btn";
  loginBtn.textContent = "Đăng nhập";
  loginBtn.onclick = handleLogin;
  container.appendChild(loginBtn);

  // Link to register
  let signupText = document.createElement("p");
  signupText.className = "signup";
  signupText.innerHTML = 'Chưa có tài khoản? <a href="dangky.html">Đăng ký ngay</a>';
  container.appendChild(signupText);

  document.getElementById("login").appendChild(container);
}

function handleLogin(e) {
  e.preventDefault();
  
  let email = document.getElementById("email").value.trim();
  let password = document.getElementById("password").value;

  // Validation
  if (!email || !password) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  // Lấy danh sách users từ localStorage (dùng biến thay vì localStorage)
  let usersData = localStorage.getItem("users");
  let users = [];
  
  if (usersData) {
    try {
      users = JSON.parse(usersData);
    } catch (e) {
      users = [];
    }
  }
  
  // Tìm user
  let user = users.find(u => u.email === email && u.password === password);

  if (user) {
    // Lưu session (dùng biến thay vì sessionStorage)
    let currentUser = {
      id: user.id,
      email: user.email,
      fullname: user.fullname,
      phone: user.phone,
      loginTime: new Date().toISOString()
    };
    
    sessionStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("Đăng nhập thành công!");
    window.location.href = "trangchinh.html";
  } else {
    alert("Email hoặc mật khẩu không đúng!");
  }
}

renderLogin();