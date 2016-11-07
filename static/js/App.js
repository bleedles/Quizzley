(function() {
	var app = angular.module('app', ['ngRoute']);

	angular.module('app').config(['$routeProvider', '$locationProvider',
		function ($routeProvider, $locationProvider) {
			$routeProvider
			.when('/', {
				templateUrl: '/partial/home.jade',
				resolve: { currentPage: function() { return "Home"; }}
			})
			.when('/howTo', {
				templateUrl: '/partial/howToView.jade',
				resolve: { currentPage: function() { return "How To"; }}
			})
			.when('/quizzes', {
				templateUrl: '/partial/quizzes.jade',
				resolve: { currentPage: function() { return "Quizzes"; }},
				controller: 'DesignController'
			})
			.when('/quizzes/:quizId', {
				templateUrl: '/partial/quizzes.html',
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

		$scope.currentPage = "Home";

		$scope.changeCurrentPage = function(page) {
			$scope.currentPage = page;
		}

		QuizService.getQuizzes().then(function (quizzes) {
			$scope.quizzes = quizzes;
		});

		$scope.QuizService = QuizService;

		$scope.init = function () {
			//Don't allow admin access to certain quizzes, etc.

		}
	}
})();


