export default class CartController {

    constructor(shoppingState) {
      this.shoppingState = shoppingState;
    }

    add(phone) {
      this.shoppingState.add(phone);
    }

    remove(phone) {
      this.shoppingState.remove(phone);
    }

    deletePhone(phone) {
      this.shoppingState.deletePhone(phone);
    }
  }
  
  CartController.$inject = ['shoppingState'];