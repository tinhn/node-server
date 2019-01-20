var amqp = require('amqplib/callback_api');
const config = require('./config');

var channel = null;
var rabbit_queue = config.rabbit.queue_name;

//Queue info
class QueueHelper {
  constructor() {
    this.startConnection();
  }

  async startConnection() {
    //let rabbit_url = 'amqp://dev:dev@192.168.100.112:5672/';
    let rabbit_url = `amqp://${config.rabbit.user}:${config.rabbit.password}@${config.rabbit.host}:${config.rabbit.port}/`;
    amqp.connect(rabbit_url, function (err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
        return setTimeout(startConnection, 1000);
      }
      conn.on("error", function (err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", function () {
        console.error("[AMQP] reconnecting");
        return setTimeout(startConnection, 1000);
      });

      console.log(`[AMQP] ${rabbit_url} connected`);
      conn.createChannel(function (err, ch) {
        ch.on("error", function (err) {
          console.error("[AMQP] channel error", err.message);
          conn.close();
        });
        ch.on("close", function () {
          console.log("[AMQP] channel closed");
        });

        ch.assertQueue(rabbit_queue);
        channel = ch;
      });

    });
  }

  async publishDataToQueue(message_content) {
    try {
      channel.sendToQueue(rabbit_queue, Buffer.from(message_content));
    } catch (err) {
      console.log('publishDataToQueue: ' + err);
    }
  }

}
module.exports = new QueueHelper();
