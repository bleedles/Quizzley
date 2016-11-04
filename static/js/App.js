(function() {
	var app = angular.module('app', ['ngRoute']);

	angular.module('app').config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider) {
			$routeProvider
			.when('/', {
				templateUrl: '/partial/home.jade',
				controller: 'AppController'
			})
			.when('/howTo', {
				templateUrl: '/partial/howToView.jade'
			})
			.when('/quizzes', {
				templateUrl: '/partial/quizzes.jade',
				controller: 'DesignController'
			})
			.when('/quizzes/:quizId', {
				templateUrl: '/partial/quizView.html',
				controller: 'QuizController'
			})
			.when('/edit', {
				templateUrl: '/partial/editListView.html',
				controller: 'DesignController'
			});

			$locationProvider.html5Mode(false);
	}]);

	angular.module('app').controller("AppController", ["$scope", "$routeParams","GetInfoService", 'QuizService', AppController]);

	function AppController($scope, GetInfoService, QuizService) {
		/*GetInfoService.getUser().then(function (user) {
			$scope.user = user;
		});*/

		QuizService.getQuizzes().then(function (quizzes) {
			$scope.quizzes = quizzes;
		});

		$scope.QuizService = QuizService;

		$scope.init = function () {
			//Don't allow admin access to certain quizzes, etc.

		}
	}
})();


