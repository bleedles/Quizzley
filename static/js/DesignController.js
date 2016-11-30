(function() {
    angular.module('app').controller("DesignController", ['$scope', 'QuizService', '$routeParams', '$location', DesignController]);

    function DesignController($scope, QuizService, $routeParams, $location) {
        $scope.QuizService = QuizService;
        $scope.newQuiz = {};
        $scope.showNewQuiz = false;
        $scope.quizId = $routeParams.quizId;

        if($scope.quizId) {
            QuizService.getQuiz($scope.quizId).then(function (quiz) {
                $scope.quiz = quiz;
            });
        }
        QuizService.getQuizzes().then(function(quizzes) {
            $scope.quizzes = quizzes;
        });

        $scope.baseQuestion = {
            quizName: "",
            questionNumber: 1,
            question: "",
            choices: "",
            answer: "",
            answerExplanation: "",
            points: 0
        };

        $scope.switchDesignView = function (view) {
            $scope.designView = view;
            switch (view) {
                case 'create':
                    $scope.newQuiz = {};
                    break;
                case 'editList':
                    break;
                case 'edit':
                    break;
            }
        }

        $scope.addQuiz = function () {
            $scope.newQuiz = {};
            
        };

        $scope.createQuiz = function(newQuizName) {
            if (newQuizName) {
                //call to DB to insert, when return, go to edit view (Mock for now)
                $scope.newQuiz = {};
                $scope.newQuiz.quizName = newQuizName;
                $scope.newQuiz.questions = [];
                $scope.newQuiz.createdDate = new Date();
                $scope.newQuiz.lastModified = new Date();
                QuizService.insertQuiz($scope.newQuiz).then(function(data) {
                    $location.path("edit/" + data._id);
                });
                $scope.quiz = $scope.newQuiz;
                $scope.quizzes.push($scope.quiz);
                $scope.designView = 'edit';
            } else {
                alert("You need to enter a Quiz Name");
            }
        };

        $scope.editQuiz = function (i) {
            $scope.quiz = $scope.quizzes[i];
            $scope.designView = 'edit';
        };

        $scope.addQuestion = function () {
            var newQuestion = angular.copy($scope.baseQuestion);
            newQuestion.questionNumber = $scope.quiz.questions.length + 1;
            $scope.quiz.questions.push(newQuestion);
        };

        $scope.removeQuestion = function (i) {
            $scope.quiz.questions.splice(i, 1);
            for (var j = 0; j < $scope.quiz.questions.length; j++) {
                $scope.quiz.questions[j].questionNumber = j + 1;
            }
        };

        $scope.saveQuiz = function () {
            QuizService.updateQuiz($scope.quiz).then(function(response) {
                console.log(response);
                $location.path("/quizzes");
            });
        };

        $scope.deletQuiz = function (quizId) {
            QuizService.deleteQuiz(quizId).then(function(response) {
                $location.path("/quizzes");
            });
        };
    }
})();

