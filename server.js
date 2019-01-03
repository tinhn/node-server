var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redisAdapter = require('socket.io-redis');
var sticky = require('sticky-session');
var cluster = require('cluster');
var bodyParser = require('body-parser');

var api = require('./services/apis');
var log = require('./logger');
const queue = require('./queue-sending');

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

app.use('/', api);
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' });
})

const server_port = process.env.PORT || 8888;

if (!sticky.listen(http, server_port)) {
    http.once('listening', function () {
        console.log('Server listening on *:' + server_port);
    });

    try {
        io.adapter(redisAdapter({ host: '127.0.0.1', port: 6379 }));
        io.of('/').adapter.on('error', err => {
            console.log(err);
        });
        console.log(`Redis connection to ${redis_host}:${redis_port}`);
    } catch (error) {
        console.log(error);
        log.error(error);
    }

    http.once('error', err => {
        console.log(err);
    });
}
else {
    console.log(`Sticky session: child server on port ${server_port}, worker id ${cluster.worker.id}`);
}

io.on('connection', function (socket) {
    socket.username = "Anonymous"
    socket.on('clientmessage', (data) => {
        io.emit('serveremit', { message: data.message, username: socket.username });

        try {
            if (data !== undefined || data !== '')
                queue.writeToQueue(JSON.stringify(data));
        } catch (err) {
            log.error(err);
        }
    });
    socket.on('user_login', (data) => {
        socket.username = data.username
    })
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', { username: socket.username })
    });
});