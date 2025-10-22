function renderHeader() {
  let header = document.createElement("div");
  header.className = "header";


  let logo = document.createElement("div");
  logo.className = "logo";
  logo.textContent = "HQSTORE";
  logo.onclick = () => {
    window.location.href = "trangchinh.html";
  };
  logo.style.cursor = "pointer";


  let nav = document.createElement("nav");
  let ul = document.createElement("ul");

  const menuItems = [
    { text: "Trang chủ", link: "trangchinh.html" },
    { text: "Sản phẩm", link: "sanpham.html" },
    { text: "Giới thiệu", link: "gioithieu.html" },
    { text: "Liên hệ", link: "lienhe.html" }
  ];

  menuItems.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item.text;
    li.onclick = () => {
      window.location.href = item.link;
    };
    ul.appendChild(li);
  });

  nav.appendChild(ul);

 
  let extra = document.createElement("div");
  extra.className = "extra";

  let searchIcon = document.createElement("span");
  searchIcon.innerHTML = "🔍";
  searchIcon.title = "Tìm kiếm";
  searchIcon.style.cursor = "pointer";
  searchIcon.onclick = () => {
    alert("Chức năng tìm kiếm");
  };

  // User icon - CẬP NHẬT: Kiểm tra đăng nhập
  let userIcon = document.createElement("span");
  userIcon.innerHTML = "👤";
  userIcon.title = "Tài khoản";
  userIcon.style.cursor = "pointer";
  userIcon.onclick = () => {
    // Kiểm tra đã đăng nhập chưa
    let currentUser = sessionStorage.getItem("currentUser");
    if (currentUser) {
      window.location.href = "profile.html";
    } else {
      window.location.href = "login.html";
    }
  };

  // Cart icon with link
  let cartIcon = document.createElement("span");
  cartIcon.innerHTML = "🛒";
  cartIcon.title = "Giỏ hàng";
  cartIcon.style.cursor = "pointer";
  cartIcon.onclick = () => {
    window.location.href = "giohang.html";
  };

  extra.appendChild(searchIcon);
  extra.appendChild(userIcon);
  extra.appendChild(cartIcon);

  // Append all to header
  header.appendChild(logo);
  header.appendChild(nav);
  header.appendChild(extra);

  // Insert header into DOM
  document.getElementById("header").appendChild(header);
}

renderHeader();