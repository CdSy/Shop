import angular from 'angular';
import phonesList from './../../json/phones.json';

class ShoppingState {
  constructor() {
    this.phones = phonesList;
    this.addedPhones = [];
    this.currentPhone = {
      price: 0
    };
    this.quantity = 0;
    this.totalMoney = 0;
  }

  pushPhones(phone, quantity) {
    const isAdded = this.addedPhones.indexOf(phone);

    if (isAdded >= 0) {
      this.addedPhones[isAdded].quantity += quantity;
    } else {
      phone.quantity = quantity;
      this.addedPhones.push(phone);
    }

    this.refreshState();
  }

  add(phone) {
    const index = this.addedPhones.indexOf(phone);

    this.addedPhones[index].quantity += 1;
    this.refreshState();
  }

  remove(phone) {
    const index = this.addedPhones.indexOf(phone);

    this.addedPhones[index].quantity > 1 ? this.addedPhones[index].quantity -= 1 : void(0);
    this.refreshState();
  }

  deletePhone(phone) {
    const index = this.addedPhones.indexOf(phone);

    this.addedPhones.splice(index, 1);
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
    const total = this.addedPhones.reduce((sum, el) => {
      return sum + (el.price * el.quantity);
    }, 0);

    return total;
  }

  getQuantity() {
    let quantity = 0;

    this.addedPhones.forEach((phone) => {
      quantity += phone.quantity;
    });

    return quantity;
  }

  refreshState() {
    this.quantity = this.getQuantity();
    this.totalMoney = this.getTotal();
  }
}

export default angular.module('shoppingState', [])
  .service('shoppingState', ShoppingState)
  .name;