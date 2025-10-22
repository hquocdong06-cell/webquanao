

class Customer {
  constructor(name, email, phone) {
    this.name = name;
    this._email = email; 
    this.phone = phone;
  }

 
  getInfo() {
    return `${this.name} | 📧 ${this._email} | 📱 ${this.phone}`;
  }


  get email() {
    return this._email;
  }

  set email(newEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(newEmail)) {
      this._email = newEmail;
    } else {
      throw new Error("Email không hợp lệ!");
    }
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Customer;
}