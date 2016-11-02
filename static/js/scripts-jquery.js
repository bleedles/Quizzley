////Solution currently in jQuery due to limitations on embedding HTML in sharepoint page. 
////Switching to a full Sharepoint solution developed in VisualStudio with AngularJS would create a better UX and make a more elegant solution.
//$(document).ready(function () {
//    //List for questions with Quiz Names
//    var questions;

//    //Current user
//    var user;

//    //Optional: Get list of users who have taken quizzes
//    var usersList;

//    //Get from another list? List of quiz definitions with passing scores
//    var quizPassScore = 10;

//    //Hardcoded for now, should be able to pass in.
//    var appWebUrl = "https://spot.nwie.net/site/samplets";

//    //Start time from when Quiz was opened. Could be changed to a button that "Starts" the quiz (Hide questions until button click, start timer, show questions).
//    var startTime = new Date();

//    /****** Timer on page ******/
//    var interval = 0;
//    var minutes = 0;
//    window.setInterval(updateTimer, 1000);

//    function updateTimer() {
//        if (interval == 60) {
//            minutes++;
//            interval = 0;
//        }
//        if (interval < 10) {
//            interval = "0" + interval;
//        }
//        $("#results").html(minutes + ":" + interval);
//    }
//    /****************************/

//    //var to store the stop time when quiz is submitted.
//    var stopTime;

//    //Delete any existing questions when page is loaded.
//    $("#quizTableBody").html("");

//    $("#submitQuiz").on("click", function () {
//        //Stop time, get it in minutes
//        stopTime = new Date();
//        user.time = stopTime.getTime() - startTime.getTime();
//        user.time = user.time / 60000;

//        //Compare user choices with answers and tally score.
//        $("#quizTable select").each(function (index) {
//            var choice = $(this).val();
//            var question = questions[index];
//            if (choice == questions[index].answer) {
//                user.score += parseInt(questions[index].points);
//            }
//        });

//        //Alert user if they passed or failed.
//        if (user.score >= quizPassScore) {
//            var message = "Passing score was " + quizPassScore + ".\nYou passed with a score of " + user.score + ".";
//            $("#results").html(message);
//            alert(message);
//        } else {
//            var message = "Passing score was " + quizPassScore + ".\nYou failed with a score of " + user.score + ".";
//            $("#results").html(message);
//            alert(message);
//        }

//        //Post results to list.
//        postUserResponse();
//    });

//    function postUserResponse() {

//        var headers = {
//            'Accept': 'application/json; odata=verbose',
//            'Content-Type': 'application/json; odata=verbose'
//        };
//        var typeUrl = 'Quiz User List'.replace(/%20/g, "_x0020_");
//        var getDigest = function(){
//            var digestEndpoint = appWebUrl + '/_api/contextinfo';

//            return $.ajax({
//                type: "POST",
//                url: digestEndpoint,
//                headers: headers,
//                success: function (data) {
//                    var digest = data.d.GetContextWebInformation.FormDigestValue;
//                    return digest;
//                }
//            }); 
//        }

//        return getDigest().success(function (data) {
//            var extraHeaders = headers;
//            extraHeaders['X-RequestDigest'] = data.d.GetContextWebInformation.FormDigestValue;
//            var typeUrl = 'Quiz User List'.replace(/%20/g, "_x0020_");
//            var postData = {
//                '__metadata': { 'type': 'SP.Data.Quiz_x0020_User_x0020_ListListItem' },
//                'Title': questions[0].title,
//                'Quiz_x0020_Name': questions[0].quizName, 
//                'First_x0020_Name': user.firstName,
//                'Last_x0020_Name': user.lastName,
//                'Email': user.email,
//                'Score': "" + user.score,
//                'Time_x0020_(minutes)': user.time
//            };
//            $.ajax({
//                type: "POST",
//                url: appWebUrl + "/_api/web/Lists/GetByTitle('Quiz User List')/items",
//                headers: extraHeaders,
//                data: JSON.stringify(postData)
//            });
//            //Possibly do more on success check. If response returns with new info, added, otherwise, already submitted. 
//            //Maybe do a check before submission. Get list, if email exists, you can't submit again.
//            user.score = 0;
//            window.location.replace("https://spot.nwie.net/home.aspx");

//        });
//    }
//    $.when(getQuiz(), getUser(), getUserList()).done(function (quizResponse, userResponse, userListResponse) {
//        //Build Quiz in HTML table
//        var html = '<tr unselectable="on"><th unselectable="on">Question Number</th><th unselectable="on">Question</th><th unselectable="on">Question Type</th><th unselectable="on">Choice</th><th unselectable="on">Points</th></tr>';
//        for (var i = 0; i < questions.length; i++) {
//            html += "<tr><td>" + questions[i].questionNumber + "</td><td>" + questions[i].question + "</td><td>" + questions[i].questionType + "</td><td>";
//            html += "<select id='choiceFor" + i + "'>";
//            html += "<option>Select One</option>";
//            for (var j = 0; j < questions[i].choices.length; j++) {
//                html += "<option value='" + j + "'>" + questions[i].choices[j] + "</option>";
//            }
//            html += "</select></td><td>" + questions[i].points + "</td></tr>";
//        }
//        $(html).appendTo("#quizTableBody");
//    });

//    function getQuiz() {
//        return $.ajax({
//            url: appWebUrl + "/_api/web/Lists/GetByTitle('Quiz List')/items",
//            headers: {
//                'Accept': 'application/json;odata=verbose'
//            },
//            success: function (data) {
//                var items = [];
//                for (var i in data.d.results) {
//                    var object = data.d.results[i];
//                    var item = {
//                        id: object["Id"],
//                        title: object["Title"],
//                        quizName: object["Quiz_x0020_Name"],
//                        questionNumber: object["Question_x0020_Number"],
//                        question: object["Question"],
//                        questionType: object["Question_x0020_Type"],
//                        choices: object["Choices"].split("\n"),
//                        points: object["Points"],
//                        answerExplanation: object["Answer_x0020_Explanation"],
//                        answer: object["Answer"]
//                    };
//                    items.push(item);
//                }
//                questions = items;
//            }
//        });
//    }
//    function getUser() {
//        //current user
//        return $.ajax({
//            url: appWebUrl + "/_api/SP.UserProfiles.PeopleManager/GetMyProperties",
//            headers: {
//                'Accept': 'application/json;odata=verbose'
//            },
//            success: function (data) {
//                var data = data.d;
//                var userObject = parseUserProfileProperties(data.UserProfileProperties);
//                userObject.firstName = getFirstName(data.DisplayName);
//                userObject.lastName = getLastName(data.DisplayName);
//                userObject.name = data.DisplayName;
//                userObject.email = data.Email;
//                userObject.title = data.Title;
//                userObject.score = 0;
//                user = userObject;
//            }
//        });
//    }

//    function getUserList() {
//        //User from list
//        return $.ajax({
//            url: appWebUrl + "/_api/web/Lists/GetByTitle('Quiz User List')/items",
//            headers: {
//                'Accept': 'application/json;odata=verbose'
//            },
//            success: function (data) {
//                var users= [];
//                for (var i in data.d.results) {
//                    var object = data.d.results[i];
//                    var user = {
//                        id: object["Id"],
//                        firstName: object["First_x0020_Name"],
//                        lastName: object["Last_x0020_Name"],
//                        email: object["Email"],
//                        score: object["Score"],
//                        title: object["Title"],
//                        quizName: object["Quiz_x0020_Name"]
//                    };
//                    users.push(user);
//                }
//                usersList = users;
//            }
//        });
//    }
//    var getFirstName = function (name) {
//        //see if there are () to find the preferred name, otherwise split the name
//        var preferredNamePattern = /\(([^)]+)\)/;	//gets the parenthesis as well as inside them
//        var preferredName = name.match(preferredNamePattern);
//        if (preferredName) {
//            return preferredName[1]		//this gets the match that doesn't have parenthesis
//        }
//        else {
//            var splitName = name.split(",");
//            var firstName = splitName[1].trim();
//            return firstName;
//        }
//    }

//    var getLastName = function (name) {
//        var splitName = name.split(",");
//        var lastName = splitName[0].trim();
//        return lastName;
//    };

//    var parseUserProfileProperties = function (userProfile) {
//        var results = userProfile.results;
//        var userObject = {};

//        results.forEach(function (result, key) {
//            if (result.Key == "Department") {
//                userObject.department = result.Value;
//            } else if (result.Key == "NW-Location") {
//                userObject.location = result.Value;
//            } else if (result.Key == "NW-MailCode") {
//                userObject.mailCode = result.Value;
//            }
//        });
//        return userObject;
//    }
//});