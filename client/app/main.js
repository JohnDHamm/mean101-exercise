'use strict';

angular
	// .module('mean101', [])
	// .controller('main', function ($scope) {
	// 	$scope.title = 'MEAN 101 from Angular'
	// })
	.module('mean101', ['ngRoute'])
	.config($routeProvider =>
		$routeProvider
			.when('/', {
				controller: 'MainCtrl',
				templateUrl: 'partials/main.html'
			})
			.when('/chat', {
				controller: 'ChatCtrl',
				templateUrl: 'partials/chat.html'
			})
	)
	.controller('MainCtrl', function($scope, $http) {
		$http
			.get('/api/title') //route
			.then(({data: {title}}) => $scope.title = title)
	})
	.controller('ChatCtrl', function($scope, $http) {
		$http
			.get('/api/messages') //route
			.then(({data: {messages}}) => $scope.messages = messages)
	})

