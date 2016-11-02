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

//DB connect
var db;
var MongoClient = mongo.MongoClient;
MongoClient.connect('mongodb://quizzley:5hqbqzNv8a4bHOhkPsvdeOavgAHuKgIP2YBZAhBWOfoMGvF33SC7PBWjoApjZe7qSaLG6yC4Y9TLMB1lyi33oA==@quizzley.documents.azure.com:10250/quizzley?ssl=true', function(err, database) {
    if(err) {
        throw err;
    }
    db = database;
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

  socket.on('disconnect', function(){
    console.log('Client Disconnected.');
  });
});

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


/*  "/contacts"
 *    GET: finds all quizzes
 *    POST: creates a new quiz
 */
app.get("/quizzes", function(req, res) {
});

app.post("/quizzes", function(req, res) {
    var newQuiz = req.body;
    var now = new Date();
    newQuiz.createdDate = now;
    newQuiz.lastModifiedDate = now;

    if (!req.body.quizName) {
        handleError(res, "Invalid user input", "Must provide a quiz name.", 400);
    }

    db.collection("quizzes").insertOne(newQuiz, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to create new contact.");
        } else {
            res.status(201).json(doc.ops[0]);
        }
    });
});

/*  "/quizzes/:id"
 *    GET: find quiz by id
 *    PUT: update quiz by id
 *    DELETE: deletes quiz by id
 */

app.get("/quizzes/:id", function(req, res) {
});

app.put("/quizzes/:id", function(req, res) {
});

app.delete("/quizzes/:id", function(req, res) {
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
