// contact.js
function renderContactForm() {
  let main = document.getElementById("main"); // Lấy div#main thay vì tạo mới
  
  if (!main) {
    console.error("Element #main not found");
    return;
  }

  // Clear existing content
  main.innerHTML = "";
  main.className = "main-container";

  // === Contact Form Section ===
  let contactSection = document.createElement("section");
  contactSection.className = "contact-section";

  let contactForm = document.createElement("div");
  contactForm.className = "contact-form";

  let formTitle = document.createElement("h2");
  formTitle.textContent = "Gửi Tin Nhắn Cho Chúng Tôi";
  contactForm.appendChild(formTitle);

  let form = document.createElement("form");
  form.id = "contactForm";

  const formFields = [
    { type: "text", placeholder: "Họ và Tên", required: true },
    { type: "email", placeholder: "Email", required: true },
    { type: "tel", placeholder: "Số điện thoại", required: true }
  ];

  formFields.forEach(field => {
    let input = document.createElement("input");
    input.type = field.type;
    input.placeholder = field.placeholder;
    if (field.required) input.required = true;
    form.appendChild(input);
  });

  let textarea = document.createElement("textarea");
  textarea.placeholder = "Nội dung tin nhắn";
  textarea.required = true;
  form.appendChild(textarea);

  let submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "GỬI TIN NHẮN";
  form.appendChild(submitBtn);

  contactForm.appendChild(form);
  contactSection.appendChild(contactForm);
  main.appendChild(contactSection);
}

renderContactForm();