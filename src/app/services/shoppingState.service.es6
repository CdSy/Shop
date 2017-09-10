import angular from 'angular';
import phonesList from './../../json/phones.json';

class ShoppingState {
  constructor() {
    this.phones = phonesList;
    this.checkedPhones = [];
    this.currentPhone = {
      price: 0
    };
    this.quantity = 0;
    this.totalMoney = 0;
  }

  pushPhones(phone, quantity) {
    const isAdded = this.checkedPhones.indexOf(phone);

    if (isAdded >= 0) {
      this.checkedPhones[isAdded].quantity += quantity;
    } else {
      phone.quantity = quantity;
      this.checkedPhones.push(phone);
    }

    this.refreshState();
  }

  add(phone) {
    const index = this.checkedPhones.indexOf(phone);

    this.checkedPhones[index].quantity += 1;
    this.refreshState();
  }

  remove(phone) {
    const index = this.checkedPhones.indexOf(phone);

    this.checkedPhones[index].quantity > 1 ? this.checkedPhones[index].quantity -= 1 : void(0);
    this.refreshState();
  }

  deletePhone(phone) {
    const index = this.checkedPhones.indexOf(phone);

    this.checkedPhones.splice(index, 1);
    this.refreshState();
  }

  setPhone(phone) {
    this.currentPhone = phone;
  }

  getPhone() {
    return this.currentPhone;
  }

  getPrice() {
    return this.currentPhone.price;
  }

  getTotal() {
    const total = this.checkedPhones.reduce((sum, el) => {
      return sum + (el.price * el.quantity);
    }, 0);

    return total;
  }

  getQuantity() {
    let quantity = 0;

    this.checkedPhones.forEach((phone) => {
      quantity += phone.quantity;
    });

    return quantity;
  }

  refreshState() {
    this.quantity = this.getQuantity();
    this.totalMoney = this.getTotal();
  }
}

export default angular.module('services.shopping-state', [])
  .service('shoppingState', ShoppingState)
  .name;