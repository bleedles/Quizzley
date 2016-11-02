//setup Dependencies
var connect = require('connect')
    , express = require('express')
    , io = require('socket.io')
    , mongo = require('mongodb')
    , port = (process.env.PORT || 8081);

//Setup Express
var server = express.createServer();
server.configure(function(){
    server.set('views', __dirname + '/views');
    server.set('view options', { layout: false });
    server.use(connect.bodyParser());
    server.use(express.cookieParser());
    server.use(express.session({ secret: "shhhhhhhhh!"}));
    server.use(connect.static(__dirname + '/static'));
    server.use(server.router);
});

//setup the errors
server.error(function(err, req, res, next){
    if (err instanceof NotFound) {
        res.render('404.jade', { locals: { 
                  title : '404 - Not Found'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX' 
                },status: 404 });
    } else {
        res.render('500.jade', { locals: { 
                  title : 'The Server Encountered an Error'
                 ,description: ''
                 ,author: ''
                 ,analyticssiteid: 'XXXXXXX'
                 ,error: err 
                },status: 500 });
    }
});
server.listen( port);

//Setup Socket.IO
var io = io.listen(server);
io.sockets.on('connection', function(socket){
  console.log('Client Connected');
  socket.on('message', function(data){
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('getQuizzes', function(data) {
    data = getQuizzes();
    socket.broadcast.emit('server_message',data);
    socket.emit('server_message',data);
  });
  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});

//DB connect
function getQuizzes() {
    var MongoClient = mongo.MongoClient;
    MongoClient.connect('mongodb://quizzley:5hqbqzNv8a4bHOhkPsvdeOavgAHuKgIP2YBZAhBWOfoMGvF33SC7PBWjoApjZe7qSaLG6yC4Y9TLMB1lyi33oA==@quizzley.documents.azure.com:10250/quizzley?ssl=true', function(err, db) {
        if(err) {
            throw err;
        }
        var quizzes = db.quizzes.find();
        return quizzes;
        if(res) {
            /*db.quizzes.insert([
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
                ]);*/
        }
    });
}



///////////////////////////////////////////
//              Routes                   //
///////////////////////////////////////////

/////// ADD ALL YOUR ROUTES HERE  /////////

server.get('/', function(req,res){
  res.render('index.jade', {
    locals : { 
              title : 'Quizzley'
             ,description: 'Gamify your work life!'
             ,author: 'Blake Needleman'
             ,analyticssiteid: 'XXXXXXX' 
            }
  });
});


//A Route for Creating a 500 Error (Useful to keep around)
server.get('/500', function(req, res){
    throw new Error('This is a 500 Error');
});

//The 404 Route (ALWAYS Keep this as the last route)
server.get('/*', function(req, res){
    throw new NotFound;
});

function NotFound(msg){
    this.name = 'NotFound';
    Error.call(this, msg);
    Error.captureStackTrace(this, arguments.callee);
}


console.log('Listening on http://0.0.0.0:' + port );
