//setup Dependencies
var connect = require('connect'),
    express = require('express'),
    io = require('socket.io'),
    mongo = require('mongodb'),
    ObjectID = mongo.ObjectID,
    port = (process.env.PORT || 8081);

//Constants
var QUIZZES_COLLECTION = "quizzes";

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

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message, "reason": reason});
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



/*  "/contacts"
 *    GET: finds all quizzes
 *    POST: creates a new quiz
 */
server.get("/api/quizzes", function(req, res) {
    db.collection(QUIZZES_COLLECTION).find({}).toArray(function(err, docs) {
        if (err) {
            throw err;
        } else {
            res.status(200).json(docs);
        }
    });
});

server.post("/api/quizzes", function(req, res) {
    var now = new Date();
    
    if(req.body._id) {
        var updateDoc = req.body;
        updateDoc.lastModifiedDate = now;
        var id = updateDoc._id;
        delete updateDoc._id;

        db.collection(QUIZZES_COLLECTION).updateOne({_id: new ObjectID(id)}, updateDoc, function(err, doc) {
            if (err) {
                handleError(res, err.message, "Failed to update quiz");
            } else {
                res.status(204).end();
            }
        });
    } else {
        var newQuiz = req.body;
        newQuiz.createdDate = now;
        newQuiz.lastModifiedDate = now;
        if (!req.body.quizName) {
            throw new Error('Invalid user input, Must provide a quiz name.');
        }

        db.collection(QUIZZES_COLLECTION).insertOne(newQuiz, function(err, doc) {
            if (err) {
                throw err;
            } else {
                res.status(201).json(doc.ops[0]);
            }
        });
    }
});

/*  "/quizzes/:id"
 *    GET: find quiz by id
 *    PUT: update quiz by id
 *    DELETE: deletes quiz by id
 */

server.get("/api/quizzes/:id", function(req, res) {
    db.collection(QUIZZES_COLLECTION).findOne({_id: new ObjectID(req.params.id)}, function(err, doc) {
        if(err) {
            handleError(res, err.message, "Failed to get quiz");
        } else {
            res.status(200).json(doc);
        }
    });
});

server.put("/api/quizzes/:id", function(req, res) {
    var updateDoc = req.body;
    updateDoc.lastModifiedDate = new Date();
    delete updateDoc._id;

    db.collection(QUIZZES_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
        if (err) {
            handleError(res, err.message, "Failed to update quiz");
        } else {
            res.status(204).end();
        }
    });
});

server.delete("/api/quizzes/:id", function(req, res) {
    db.collection(QUIZZES_COLLECTION).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
        if (err) {
            handleError(res, err.message, "Failed to delete quiz");
        } else {
            res.status(204).end();
        }
    });
});

/*  "/quizzes/:userid"
 *    GET: find quizzes by userid
 */

server.get("/api/quizzes/:userId", function(req, res) {
    db.collection(QUIZZES_COLLECTION).find({createdBy: req.params.userId}).toArray(function(err, docs) {
        if(err) {
            handleError(res, err.message, "Failed to get quizzes");
        } else {
            res.status(200).json(docs);
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
