(function() {
    var app = angular.module('app', ['ngRoute']);

    /*angular.module('app').config(['$routeProvider', '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $routeProvider
            .when('/index', {
                templateUrl: '/views/home.html'
            })
            .when('/howTo', {
                templateUrl: '/views/howToView.html'
            })
            .when('/quizzes', {
                templateUrl: '/views/quizzesView.html'
            })
            .when('/quiz/:quizId', {
                templateUrl: '/views/quizView.html',
                controller: 'QuizController'
            })
            .when('/edit', {
                templateUrl: '/views/editListView.html',
                controller: 'DesignController'
            });

            $locationProvider.html5Mode(false);
    }]);*/

    angular.module('app').controller("AppController", ["$scope", "GetInfoService", 'QuizService', AppController]);

    function AppController($scope, GetInfoService, QuizService) {
        GetInfoService.getUser().then(function (user) {
            $scope.user = user;
        });

        GetInfoService.getQuizzes().then(function (quizzes) {
            $scope.quizzes = quizzes;
        });

        $scope.QuizService = QuizService;

        $scope.view = 'homeView';

        $scope.init = function () {
            //Don't allow admin access to certain quizzes, etc.

        }

        $scope.nav = function (view, id) {
            $scope.view = view;
            if (id) {
                QuizService.setQuizId(id);
            }
        }
    }

    angular.module('app').directive("homeView", homeView);

    function homeView() {
        return {
            restrict: "E",
            templateUrl: "/views/homeView.html"
        };
    }

    angular.module('app').directive("howToView", howToView);

    function howToView() {
        return {
            restrict: "E",
            templateUrl: "/views/howToView.html"
        };
    }

    angular.module('app').directive("quizzesView", quizzesView);

    function quizzesView() {
        return {
            restrict: "E",
            templateUrl: "/views/quizzesView.html"
        };
    }

    angular.module('app').directive("createView", createView);

    function createView() {
        return {
            restrict: "E",
            templateUrl: "/views/createView.html"
        };
    }

    angular.module('app').directive("editListView", editListView);

    function editListView() {
        return {
            restrict: "E",
            templateUrl: "/views/editListView.html"
        };
    }

    angular.module('app').directive("editView", editView);

    function editView() {
        return {
            restrict: "E",
            templateUrl: "/views/editView.html"
        };
    }

    angular.module('app').directive("quizView", quizView);

    function quizView() {
        return {
            restrict: "E",
            templateUrl: "/views/quizView.html"
        };
    }

    angular.module('app').directive("designView", designView);

    function designView() {
        return {
            restrict: "E",
            templateUrl: "/views/designView.html"
        };
    }
})();


