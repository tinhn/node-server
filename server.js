var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redisAdapter = require('socket.io-redis');
var sticky = require('sticky-session');
var cluster = require('cluster');
var log = require('./logger');

var os = require( 'os' );
var networkInterfaces = os.networkInterfaces( );
console.log( networkInterfaces );

//Socket url: http://localhost:8888
const server_port = process.env.PORT || 8888;

//Cache info
const redis_host = '127.0.0.1';
const redis_port = 6379;

/* HTTP Register: 
    eg: http://localhost:8888/info | http://localhost:8888/health
*/
app.get('/', function (req, res) {
    res.status(200).send('Server work');
});
app.get('/info', function (req, res) {
    res.status(200).send({ status: 200, message: 'SC_OK' });
});
app.get('/health', function (req, res) {
    res.status(200).send({ status: 200, message: 'SC_OK' });
});

//Middleware to catch 404 error
app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + ' not found' });
})

//Server start
if (!sticky.listen(http, server_port)) {
    http.once('listening', function () {
        console.log('Server listening on *:' + server_port);
        //Write log file
        log.info('Server listening on *:' + server_port);
    });

    //Cache Register
    try {
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

/* Socket event listener */
io.on('connection', function (socket) {
    socket.on('client message', function (msg) {
        console.log(`client message: ${JSON.stringify(msg)}`);
        //broadcast to call client
        io.emit('server message', msg);
    });
});