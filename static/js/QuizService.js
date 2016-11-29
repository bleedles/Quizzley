(function() {
    angular.module('app').service("QuizService", ["$http", QuizService]);

    function QuizService($http) {
        var service = {};

        service.getPoints = function (quiz) {
            var total = 0;
            for (var i in quiz.questions) {
                total += quiz.questions[i].points;
            }
            return total;
        }

        service.setQuizId = function(id) {
            service.id = id;
        }

        service.getQuizzes = function() {
            return $http.get("/api/quizzes").then(function (response) {
                return response.data;
            });
        }

        service.getQuiz = function(quizId) {
            return $http.get("/api/quizzes/" + quizId).then(function (response) {
                return response.data;
            });
        }

        service.updateQuiz = function(quiz) {
            return $http.put("/api/quizzes/" + quiz.quizId, quiz).then(function (response) {
                return response.data;
            });
        }

        return service;
    }
})();

