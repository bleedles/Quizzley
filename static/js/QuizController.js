(function() {
    angular.module('app').controller("QuizController", ["$scope", "$http", "GetInfoService", "$timeout", "$routeParams", "QuizService", QuizController]);

    function QuizController($scope, $http, GetInfoService, $timeout, $routeParams, QuizService) {

        $scope.quizId = $routeParams.quizId;

        GetInfoService.getUser().then(function (user) {
            $scope.user = user;
        });

        QuizService.getQuiz($scope.quizId).then(function (quiz) {
            $scope.quiz = quiz;
        });


        var mytimeout;
        $scope.start = function () {
            $scope.started = true;
            $scope.startDate = new Date();
            $scope.dateDifference = 0;
            $scope.onTimeout = function () {
                $scope.dateDifference = new Date().getTime() - $scope.startDate.getTime();
                mytimeout = $timeout($scope.onTimeout, 1000);
            }
            mytimeout = $timeout($scope.onTimeout, 1000);
        }


        $scope.submit = function () {
            $scope.stop();
            $scope.user.time = $scope.dateDifference / 60;
            $scope.user.time = $scope.user.time.toFixed(2);

            for (var i in $scope.quiz.questions) {
                tally($scope.quiz.questions[i]);
            }

            function tally(question) {
                if (question.userChoice == question.answer) {
                    question.correct = true;
                    $scope.user.score += question.points;
                }
            }

            $scope.submitted = true;
            PostListService.postResults($scope.user);
        }

        $scope.stop = function () {
            $timeout.cancel(mytimeout);
        }
    }
})();

