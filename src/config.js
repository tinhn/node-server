module.exports = {
    redis: {
        host: '192.168.100.112',
        port: 6379
    },
    rabbit:{
        host: '192.168.100.112',
        port: 5672,
        user: 'dev',
        password: 'dev',
        queue_name: 'chat.message'
    },
    socketaddress: 8888,
    logtrackingdir:'chatlogs'
};