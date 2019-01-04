var amqp = require('amqplib/callback_api');

var channel = null;
const rabbit_queue = 'chat.message';

//Queue info
class QueueHelper {
  constructor() {
    this.startConnection();
  }

  async startConnection() {
    amqp.connect('amqp://dev:dev@localhost:5672/', function (err, conn) {
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

      //console.log("[AMQP] connected");
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
