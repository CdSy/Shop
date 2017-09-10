routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
  $stateProvider
    .state('cart', {
      url: '/shopping-cart',
      template: require('./shopping-cart.html'),
      controller: 'CartController',
      controllerAs: 'cart'
    });
}