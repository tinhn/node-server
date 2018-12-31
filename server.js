var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redisAdapter = require('socket.io-redis');
var sticky = require('sticky-session');
var cluster = require('cluster');
var bodyParser = require('body-parser');

var api = require('./services/apis');
var log = require('./logger');

// Utilities
//var os = require('os');
//var networkInterfaces = os.networkInterfaces();
//console.log(networkInterfaces);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next();
})

//API route
app.use('/', api);

//Middleware to catch 404 error
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' });
})

//Server start
const server_port = process.env.PORT || 8888;
if (!sticky.listen(http, server_port)) {
    http.once('listening', function () {
        console.log('Server listening on *:' + server_port);
        //Write log file
        log.info('Server listening on *:' + server_port);
    });

    //Cache Register
    try {
        //Cache info
        let redis_host = '127.0.0.1';
        let redis_port = 6379;
        io.adapter(redisAdapter({ host: redis_host, port: redis_port }));
        io.of('/').adapter.on('error', err => {
            console.log(err);
        });
        console.log(`Redis connection to ${redis_host}:${redis_port}`);
    } catch (error) {
        console.log(error);
        log.error(error);
    }

    //Error handling
    http.once('error', err => {
        console.log(err);
    });
}
else {
    console.log(`Sticky session: child server on port ${server_port}, worker id ${cluster.worker.id}`);
}

//listen on every connection
io.on('connection', function (socket) {
    console.log('New user connected')
    //default username
    socket.username = "Anonymous"
    
    //listen on new_message
    socket.on('clientmessage', (data) => {
        console.log(`client message: ${JSON.stringify(data)}`);
        //broadcast the new message
        //io.emit('serveremit', msg);
        io.emit('serveremit', {message : data.message, username : socket.username});
    });

    //listen on user login
    socket.on('user_login', (data) => {
        socket.username = data.username
    })

    //listen on typing
    socket.on('typing', (data) => {
    	socket.broadcast.emit('typing', {username : socket.username})
    });
});