'use strict';

angular
	.module('mean101', [])
	// .controller('main', function ($scope) {
	// 	$scope.title = 'MEAN 101 from Angular'
	// })
	.controller('main', function($scope, $http) {
		$http
			.get('/api/title') //route
			.then(({data: {title}}) => $scope.title = title)
	})
