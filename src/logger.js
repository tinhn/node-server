var {createLogger, format, transports} = require('winston');
var logrotate = require('winston-daily-rotate-file');
const config = require('./config');

var fs = require('fs');
const logDirs = config.logtrackingdir;

if(!fs.existsSync(logDirs)){
    fs.mkdirSync(logDirs);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDirs}/%DATE%_result.log`,
    datePattern: 'YYYY-MM-DD'
})

const logger = createLogger({
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports:[
        dailyRotateFileTransport
    ]
})
module.exports = logger