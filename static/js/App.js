(function() {
	var app = angular.module('app', ['ngRoute']);

	angular.module('app').config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider) {
			$routeProvider
			.when('/', {
				templateUrl: '/partials/home',
				controller: 'AppController'
			})
			.when('/howTo', {
				templateUrl: '/partials/howToView'
			})
			.when('/quizzes', {
				templateUrl: '/partials/quizzes',
				controller: 'DesignController'
			})
			.when('/quizzes/:quizId', {
				templateUrl: '/partials/quizView.html',
				controller: 'QuizController'
			})
			.when('/edit', {
				templateUrl: '/partials/editListView.html',
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


