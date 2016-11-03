(function() {
    angular.module('app').service("GetInfoService", ["$http", "$q", GetInfoService]);

    function GetInfoService($http, $q) {
        var service = {};
        var quizzes = [];
        getWebAbsoluteUrl = function () {
            var url = window.location.href;
            var webUrlPattern = /^\S+?(?=\/SitePages)/gmi;
            var webUrl = url.match(webUrlPattern);
            if (webUrl) {
                return webUrl[0];
            }
            else {
                throw new Error("Unable to find page url");
            }
        };

        var appWebUrl = !window.location.href.indexOf("localhost") ? getWebAbsoluteUrl() : "";

        var getFirstName = function (name) {
            //see if there are () to find the preferred name, otherwise split the name

            var preferredNamePattern = /\(([^)]+)\)/;	//gets the parenthesis as well as inside them
            var preferredName = name.match(preferredNamePattern);
            if (preferredName) {
                return preferredName[1]		//this gets the match that doesn't have parenthesis
            }
            else {
                var splitName = name.split(",");
                var firstName = splitName[1].trim();
                return firstName;
            }
        }

        var getLastName = function (name) {
            var splitName = name.split(",");
            var lastName = splitName[0].trim();
            return lastName;
        };

        var parseUserProfileProperties = function (userProfile) {
            var results = userProfile.results;
            var userObject = {};

            results.forEach(function (result, key) {
                if (result.Key == "Department") {
                    userObject.department = result.Value;
                } else if (result.Key == "NW-Location") {
                    userObject.location = result.Value;
                } else if (result.Key == "NW-MailCode") {
                    userObject.mailCode = result.Value;
                }
            });

            return userObject;
        }

        service.getUser = function () {
            //Remove once hooks are usable.
            var user = {
                firstName: "Blake",
                lastName: "Needleman",
                email: "NEEDLB1@nationwide.com",
                score: 0
            };

            var endpoint = appWebUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties";
            return user ? $q.resolve(user) : $http.get(endpoint).then(function (response) {
                data = response.data.d;
                var userObject = parseUserProfileProperties(data.UserProfileProperties);
                userObject.firstName = getFirstName(data.DisplayName);
                userObject.lastName = getLastName(data.DisplayName);
                userObject.name = data.DisplayName;
                userObject.email = data.Email;
                userObject.title = data.Title;
                return userObject;
            });

        };

        service.getUserList = function () {
            //can use /items to get all the items from the list
            var endpoint = appWebUrl + "/_api/web/Lists/GetByTitle('Quiz User List')/items";
            return $http.get(endpoint).then(function (data) {
                var users = [];
                for (var i in data.d.results) {
                    var object = data.d.results[i];
                    var user = {
                        id: object["Id"],
                        firstName: object["First_x0020_Name"],
                        lastName: object["Last_x0020_Name"],
                        email: object["Email"],
                        score: object["Score"],
                        title: object["Title"],
                        quizName: object["Quiz_x0020_Name"]
                    };
                    users.push(user);
                }
                return users;
            });
        };

        service.getQuizzes = function (user) {
            return $q.resolve(quizzes);

            // return $http.get('resources/quizzes.json').then(function (response) {
            // return response.data;
            // });
        }

        service.getQuiz = function (id) {
            //Remove once hooks are usable.
            var quiz = {
                quizId: 1,
                quizName: 'Olympic Quiz',
                createdDate: new Date(),
                lastModifiedDate: new Date(),
                questions: [
                {
                    questionNumber: 1,
                    question: "A women's discus weighs 1 kg (2 lbs 3oz). How much does a men's discus weigh?",
                    questionType: "Single Response",
                    choices:
                        ["1 kg (2 lbs 3 oz)",
                        "2 kg (4 lbs 7 oz)",
                        "3 kg (6 lbs 10 oz)",
                        "4 kg (8 lbs 14 oz)"],
                    answer: "1",
                    answerExplanation: "It's just a bit heavier",
                    points: 1
                },
                {
                    questionNumber: 2,
                    question: "Before it begins its trip through 20 countries, where is the Olympic flame kindled?",
                    questionType: "Single Response",
                    choices:
                        ["Mount Everest",
                        "Mount Olympus",
                        "Mount Cho Oyu",
                        "Mount k2"],
                    answer: "1",
                    answerExplanation: "",
                    points: 1
                },
                {
                    questionNumber: 3,
                    question: "Blue, red, and green are three of the five rings of the olympic flag. What are the other two?",
                    questionType: "Single Response",
                    choices:
                        ["Yellow and Black",
                        "Yellow and White",
                        "Orange and White",
                        "Gold and White"],
                    answer: "0",
                    answerExplanation: "",
                    points: 1
                },
                {
                    questionNumber: 4,
                    question: "Competitors of which surname have won the most Olympic Medals?",
                    questionType: "Single Response",
                    choices:
                        ["Smith",
                        "Singh",
                        "Kim"],
                    answer: "2",
                    answerExplanation: "",
                    points: 1
                },
                {
                    questionNumber: 5,
                    question: "Eddie the Eagle became famous at the 1988 Calgary Olympics. In which even did he take part?",
                    questionType: "Single Response",
                    choices:
                        ["Flying",
                        "Golf",
                        "Ski Jumping",
                        "Weight Lifting"],
                    answer: "2",
                    answerExplanation: "",
                    points: 1
                },
                {
                    questionNumber: 6,
                    question: "What do the five rings of the Olympic flag symbolize?",
                    questionType: "Single Response",
                    choices:
                        ["The five world languages",
                        "The first five wonders of the world",
                        "The five athletic elements in sports",
                        "The five continents"],
                    answer: "3",
                    answerExplanation: "",
                    points: 1
                },
                {
                    questionNumber: 7,
                    question: "Phiedippides ran over 26 miles in 490 BC to deliver the news of a lost battle. He ran from Marathon to which city?",
                    questionType: "Single Response",
                    choices:
                        ["Athens",
                        "Rome",
                        "Carthage",
                        "Oreos"],
                    answer: "0",
                    answerExplanation: "",
                    points: 1
                }
                ]
            };
            //can use /items to get all the items from the list
            var endpoint = appWebUrl + "/_api/web/Lists/GetByTitle('Quiz List')/items";

            
            for (var i = 0; i < quizzes.length; i++) {
                if (quizzes[i].quizId === id) {
                    return $q.resolve(quizzes[i]);
                }
            }
            return $q.resolve(quiz);

            // return $http.get('resources/quizzes.json').then(function (response) {
            // for(var i in response.data) {
            // if(response.data[i].quizId == id) {
            // return response.data[i];
            // }
            // }
            // return quiz;
            // }); 

            // return quiz ? $q.resolve(quiz) : $http.get(endpoint).then(function (data) {
            // var items = [];
            // for (var i in data.d.results) {
            // var object = data.d.results[i];
            // var item = {
            // id: object["Id"],
            // title: object["Title"],
            // quizName: object["Quiz_x0020_Name"],
            // questionNumber: object["Question_x0020_Number"],
            // question: object["Question"],
            // questionType: object["Question_x0020_Type"],
            // choices: object["Choices"].split("\n"),
            // points: object["Points"],
            // answerExplanation: object["Answer_x0020_Explanation"],
            // answer: object["Answer"]
            // };
            // items.push(item);
            // }
            // return items;
            // });
        };

        quizzes = [
            {
                "quizId": 1,
                "quizName": "Olympic Quiz",
                "createdDate": "",
                "lastModifiedDate": "",
                "questions": [
                    {
                        "questionNumber": 1,
                        "question": "A women's discus weighs 1 kg (2 lbs 3oz). How much does a men's discus weigh?",
                        "questionType": "Single Response",
                        "choices": [
                            "1 kg (2 lbs 3 oz)",
                            "2 kg (4 lbs 7 oz)",
                            "3 kg (6 lbs 10 oz)",
                            "4 kg (8 lbs 14 oz)"
                        ],
                        "answer": "1",
                        "answerExplanation": "It's just a bit heavier",
                        "points": 1
                    },
                    {
                        "questionNumber": 2,
                        "question": "Before it begins its trip through 20 countries, where is the Olympic flame kindled?",
                        "questionType": "Single Response",
                        "choices": [
                            "Mount Everest",
                            "Mount Olympus",
                            "Mount Cho Oyu",
                            "Mount k2"
                        ],
                        "answer": "1",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 3,
                        "question": "Blue, red, and green are three of the five rings of the olympic flag. What are the other two?",
                        "questionType": "Single Response",
                        "choices": [
                            "Yellow and Black",
                            "Yellow and White",
                            "Orange and White",
                            "Gold and White"
                        ],
                        "answer": "0",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 4,
                        "question": "Competitors of which surname have won the most Olympic Medals?",
                        "questionType": "Single Response",
                        "choices": [
                            "Smith",
                            "Singh",
                            "Kim"
                        ],
                        "answer": "2",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 5,
                        "question": "Eddie the Eagle became famous at the 1988 Calgary Olympics. In which even did he take part?",
                        "questionType": "Single Response",
                        "choices": [
                            "Flying",
                            "Golf",
                            "Ski Jumping",
                            "Weight Lifting"
                        ],
                        "answer": "2",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 6,
                        "question": "What do the five rings of the Olympic flag symbolize?",
                        "questionType": "Single Response",
                        "choices": [
                            "The five world languages",
                            "The first five wonders of the world",
                            "The five athletic elements in sports",
                            "The five continents"
                        ],
                        "answer": "3",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 7,
                        "question": "Phiedippides ran over 26 miles in 490 BC to deliver the news of a lost battle. He ran from Marathon to which city?",
                        "questionType": "Single Response",
                        "choices": [
                            "Athens",
                            "Rome",
                            "Carthage",
                            "Oreos"
                        ],
                        "answer": "0",
                        "answerExplanation": "",
                        "points": 1
                    }
                ]
            },
            {
                "quizId": 2,
                "quizName": "Second Olympic Quiz",
                "createdDate": "",
                "lastModifiedDate": "",
                "questions": [
                    {
                        "questionNumber": 1,
                        "question": "A women's discus weighs 1 kg (2 lbs 3oz). How much does a men's discus weigh?",
                        "questionType": "Single Response",
                        "choices": [
                            "1 kg (2 lbs 3 oz)",
                            "2 kg (4 lbs 7 oz)",
                            "3 kg (6 lbs 10 oz)",
                            "4 kg (8 lbs 14 oz)"
                        ],
                        "answer": "1",
                        "answerExplanation": "It's just a bit heavier",
                        "points": 1
                    },
                    {
                        "questionNumber": 2,
                        "question": "Before it begins its trip through 20 countries, where is the Olympic flame kindled?",
                        "questionType": "Single Response",
                        "choices": [
                            "Mount Everest",
                            "Mount Olympus",
                            "Mount Cho Oyu",
                            "Mount k2"
                        ],
                        "answer": "1",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 3,
                        "question": "Blue, red, and green are three of the five rings of the olympic flag. What are the other two?",
                        "questionType": "Single Response",
                        "choices": [
                            "Yellow and Black",
                            "Yellow and White",
                            "Orange and White",
                            "Gold and White"
                        ],
                        "answer": "0",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 4,
                        "question": "Competitors of which surname have won the most Olympic Medals?",
                        "questionType": "Single Response",
                        "choices": [
                            "Smith",
                            "Singh",
                            "Kim"
                        ],
                        "answer": "2",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 5,
                        "question": "Eddie the Eagle became famous at the 1988 Calgary Olympics. In which even did he take part?",
                        "questionType": "Single Response",
                        "choices": [
                            "Flying",
                            "Golf",
                            "Ski Jumping",
                            "Weight Lifting"
                        ],
                        "answer": "2",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 6,
                        "question": "What do the five rings of the Olympic flag symbolize?",
                        "questionType": "Single Response",
                        "choices": [
                            "The five world languages",
                            "The first five wonders of the world",
                            "The five athletic elements in sports",
                            "The five continents"
                        ],
                        "answer": "3",
                        "answerExplanation": "",
                        "points": 1
                    },
                    {
                        "questionNumber": 7,
                        "question": "Phiedippides ran over 26 miles in 490 BC to deliver the news of a lost battle. He ran from Marathon to which city?",
                        "questionType": "Single Response",
                        "choices": [
                            "Athens",
                            "Rome",
                            "Carthage",
                            "Oreos"
                        ],
                        "answer": "0",
                        "answerExplanation": "",
                        "points": 1
                    }
                ]
            }
        ];

        return service;
    }

    angular.module('app').service("PostInfoService", ["$http", PostInfoService]);

    function PostInfoService($http) {
        var service = {};

        getWebAbsoluteUrl = function () {
            var url = window.location.href;
            var webUrlPattern = /^\S+?(?=\/SitePages)/gmi;
            var webUrl = url.match(webUrlPattern);
            if (webUrl) {
                return webUrl[0];
            }
            else {
                throw new Error("Unable to find page url");
            }
        };

        var appWebUrl = !window.location.href.indexOf("localhost") ? getWebAbsoluteUrl() : "";

        return service;
    }
})();