(function() {
    angular.module('app').controller("DesignController", ['$scope', 'QuizService', '$routeParams', '$route', DesignController]);

    function DesignController($scope, QuizService, $routeParams, $route) {
        $scope.QuizService = QuizService;
        $scope.newQuiz = {};
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

        $scope.createQuiz = function () {
            if ($scope.newQuiz.quizName) {
                //call to DB to insert, when return, go to edit view (Mock for now)
                $scope.newQuiz.questions = [];
                $scope.newQuiz.createdDate = new Date();
                $scope.newQuiz.lastModified = new Date();
                $scope.newQuiz.quizId = $scope.quizzes.length + 1;
                $scope.quiz = $scope.newQuiz;
                $scope.quizzes.push($scope.quiz);
                $scope.designView = 'edit';
            } else {
                alert("You need to enter a Quiz Name");
            }
        }

        $scope.editQuiz = function (i) {
            $scope.quiz = $scope.quizzes[i];
            $scope.designView = 'edit';
        }

        $scope.addQuestion = function () {
            var newQuestion = angular.copy($scope.baseQuestion);
            newQuestion.questionNumber = $scope.quiz.questions.length + 1;
            $scope.quiz.questions.push(newQuestion);
        }

        $scope.removeQuestion = function (i) {
            $scope.quiz.questions.splice(i, 1);
            for (var j = 0; j < $scope.quiz.questions.length; j++) {
                $scope.quiz.questions[j].questionNumber = j + 1;
            }
        }

        $scope.saveQuiz = function () {
            QuizService.updateQuiz($scope.quiz).then(function(response) {
                console.log(response);
                $route.path("/quizzes");
            });
        }

        $scope.deletQuiz = function () {
            //Delete quiz from DB
        }
    }
})();

