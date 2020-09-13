const redis = require('redis');
const client = redis.createClient(6379, 'localhost');
client.on('connect', function () {
    console.log("connected to client")
});
module.exports = client;

