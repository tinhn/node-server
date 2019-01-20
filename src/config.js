module.exports = {
    redis: {
        host: '192.168.100.x',
        port: 6379
    },
    rabbit:{
        host: '192.168.100.x',
        port: 5672,
        user: 'user',
        password: 'password',
        queue_name: '<your_queue_name>'
    },
    socketaddress: 8888,
    logtrackingdir:'chatlogs'
};