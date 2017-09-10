import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import CartController from './cart.controller.es6';
import shoppingState from '../services/shoppingState.service.es6';
import routing from './cart.routes.es6';

export default angular.module('cart', [uirouter, shoppingState])
  .config(routing)
  .controller('CartController', CartController)
  .name;