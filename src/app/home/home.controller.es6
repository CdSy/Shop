export default class HomeController {

    constructor(shoppingState, ngDialog) {
      this.shoppingState = shoppingState;
      this.ngDialog = ngDialog;
      this.currentPhone = this.shoppingState.getPhone();
      this.quantity = 1;
      this.sum = this.shoppingState.getPrice();
    }
  
    buyPhone(phone) {
      this.shoppingState.setPhone(phone);

      this.ngDialog.open({
        template: require('./modal.html'),
        className: 'ngdialog-theme-default',
        controller: HomeController,
        controllerAs: 'home',
        plain: true
      });
    }

    changeSum() {
      this.sum = this.currentPhone.price * (this.quantity || 1);
    }

    addToCart() {
      this.ngDialog.close();

      if (this.quantity) {
        this.shoppingState.pushPhones(this.currentPhone, this.quantity);
      }
    }
  }
  
  HomeController.$inject = ['shoppingState', 'ngDialog'];