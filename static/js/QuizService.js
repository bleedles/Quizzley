(function() {
    angular.module('app').service("QuizService", QuizService);

    function QuizService() {
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

        return service;
    }
})();

