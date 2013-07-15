var module = angular.module('psychopass', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/', {templateUrl: 'templates/main.html',   controller: MainCtrl}).
      when('/register', {templateUrl: 'templates/register.html',   controller: RegisterCtrl}).
      when('/notfound', {templateUrl: 'templates/notfound.html'}).
      otherwise({redirectTo: '/'});
}]);

module.config(function($locationProvider) {
  $locationProvider.hashPrefix('!');
});
