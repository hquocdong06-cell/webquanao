function footer() {
    let footer = document.createElement("footer");
    footer.className = "footer";
    
    // Container chính
    let container = document.createElement("div");
    container.className = "footer-container";
    
    // Cột 1: FreshDrinks
    let col1 = document.createElement("div");
    col1.className = "footer-column";
    let brand = document.createElement("h3");
    brand.textContent = "QĐSTORE";
    let brandDesc = document.createElement("p");
    brandDesc.textContent = "Thương hiệu thời trang hiện đại, mang lại phong cách cho mọi khoảnh khắc.";
    col1.appendChild(brand);
    col1.appendChild(brandDesc);
    
    // Cột 2: Liên kết
    let col2 = document.createElement("div");
    col2.className = "footer-column";
    let heading2 = document.createElement("h3");
    heading2.textContent = "Liên kết";
    col2.appendChild(heading2);
    let links = ["Trang chủ", "Sản phẩm", "Khuyến mãi", "Liên hệ"];
    links.forEach(link => {
        let a = document.createElement("a");
        a.href = "#";
        a.textContent = link;
        col2.appendChild(a);
    });
    
    // Cột 3: Hỗ trợ
    let col3 = document.createElement("div");
    col3.className = "footer-column";
    let heading3 = document.createElement("h3");
    heading3.textContent = "Hỗ trợ";
    col3.appendChild(heading3);
    let support = ["FAQ", "Chính sách bảo mật", "Điều khoản dịch vụ", "Góp ý"];
    support.forEach(item => {
        let a = document.createElement("a");
        a.href = "#";
        a.textContent = item;
        col3.appendChild(a);
    });
    
    // Cột 4: Liên hệ
    let col4 = document.createElement("div");
    col4.className = "footer-column";
    let heading4 = document.createElement("h3");
    heading4.textContent = "Liên hệ";
    col4.appendChild(heading4);
    let email = document.createElement("p");
    email.innerHTML = "Email: support@freshdrinks.com";
    let hotline = document.createElement("p");
    hotline.innerHTML = "Hotline: 1900 123 456";
    col4.appendChild(email);
    col4.appendChild(hotline);
    
    // Social icons
    let socialDiv = document.createElement("div");
    socialDiv.className = "social-icons";
    let socialIcons = ["📘", "💳", "🏪", "☁️"];
    socialIcons.forEach(icon => {
        let span = document.createElement("span");
        span.textContent = icon;
        socialDiv.appendChild(span);
    });
    col4.appendChild(socialDiv);
    
    // Thêm các cột vào container
    container.appendChild(col1);
    container.appendChild(col2);
    container.appendChild(col3);
    container.appendChild(col4);
    
    // Copyright
    let copyright = document.createElement("div");
    copyright.className = "copyright";
    copyright.textContent = "© 2025 FreshDrinks. All Rights Reserved.";
    
    footer.appendChild(container);
    footer.appendChild(copyright);
    
    // Tìm div#footer trong HTML và thay thế bằng footer element
    let footerContainer = document.getElementById('footer');
    if (footerContainer) {
        footerContainer.appendChild(footer);
    } else {
        // Nếu không có #footer container, append vào body
        document.body.appendChild(footer);
    }
}
footer();