
var express = require('express');
var bodyParser = require('body-parser');
var config = require("./config");
const path = require('path');
var session = require('express-session');

const app = express();
app.use(express.json());
app.use(express.static(__dirname))
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

LoadFile();



function LoadFile() {
    app.use(express.static(__dirname))
    app.use(bodyParser.json())

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    var normalizedPath = require("path").join(__dirname);
    app.use((req, res) => res.sendFile(path.join(__dirname, "/index.html")))
    app.use(express.static(normalizedPath));

    app.get('/', function (req, res) {
        var normalizedPath = require("path").join(__dirname, "/index.html");
        res.sendfile(normalizedPath);
    });

    app.listen(config.port, function (error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log("listen port " + config.port);
        }
    })
}



