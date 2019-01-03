var amqp = require('amqplib/callback_api');

var channel = null;
const rabbit_queue = 'chat.message';

//Queue info
class QueueHelper {
  constructor() {
    amqp.connect('amqp://dev:dev@localhost:5672/', function (err, conn) {
      if (err) {
        console.error("[AMQP]", err.message);
      }
      conn.on("error", function (err) {
        if (err.message !== "Connection closing") {
          console.error("[AMQP] conn error", err.message);
        }
      });
      conn.on("close", function () {
        console.error("[AMQP] reconnecting");
      });

      //console.log("[AMQP] connected");

      conn.createChannel(function (err, ch) {
        ch.on("error", function (err) {
          console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function () {
          console.log("[AMQP] channel closed");
        });

        ch.assertQueue(rabbit_queue);
        channel = ch;
      });
    });
  }


  async writeToQueue(message_content) {
    try {
      channel.sendToQueue(rabbit_queue, Buffer.from(message_content));
    } catch (err) {
      console.log('writeToQueue: ' + err);
    }
  }
  
}
module.exports = new QueueHelper();
