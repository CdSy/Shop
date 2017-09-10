import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import HomeController from './home.controller.es6';
import shoppingState from '../services/shoppingState.service.es6';
import routing from './home.routes.es6';

export default angular.module('home', [uirouter, shoppingState])
  .config(routing)
  .controller('HomeController', HomeController)
  .name;