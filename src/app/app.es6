import angular from 'angular';
import uirouter from '@uirouter/angularjs';
import 'angular-animate';
import 'ng-dialog';
import routing from './app.config.es6';
import home from './home/index.es6';
import cart from './shopping-cart/index.es6';
import HeaderController from './header/header.controller.es6';
import shoppingState from './services/shoppingState.service.es6';
import 'bootstrap/dist/css/bootstrap.css';
import '../../node_modules/ng-dialog/css/ngDialog.min.css';
import '../../node_modules/ng-dialog/css/ngDialog-theme-default.css';
import '../style/main.less';

const MODULE_NAME = 'app';

angular.module(MODULE_NAME, [uirouter, 'ngAnimate', 'ngDialog', shoppingState, home, cart])
  .controller('HeaderController', HeaderController)
  .config(routing)

export default MODULE_NAME;