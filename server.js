const express = require('express');
const fs = require('fs');
const util = require('util');
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const socketSrc = require('./socket');

const session = require('express-session')({
    secret: 'line chaser',
    resave: true,
    saveUninitialized: true,
    // cookie: {
    //   maxAge: 1000 * 60 * 10
    // },
});
const sharedsession = require('express-socket.io-session');

const port = process.env.PORT || 5555;

const baseUrl = '0.0.0.0';
// const baseUrl = 'quizpuzzle.chileracing.net'

// app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/Chaser_app/www'));

app.use(session);
app.get('/', (req, res) => {
    req.session.game_exists = false;
    res.sendFile(__dirname + '/Chaser_app/www/index.html');
});
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

io.use(sharedsession(session));

let connections = [];
let heart_timer;

socketSrc.useSocket(io).then(() => {
    server.listen(port, baseUrl, () => {
        console.log(`Listening on ${server.address().port}`);
    });
    heart_timer = setInterval(() => {
        socketSrc.onTimeInteval(io);
    }, 600 * 1000);// 

    process.on('SIGTERM', shutDown);
    process.on('SIGINT', shutDown);

    server.on('connection', connection => {
        connections.push(connection);
        connection.on('close', () => connections = connections.filter(curr => curr !== connection));
    });
});

function shutDown() {
    clearInterval(heart_timer);
    server.close(() => {
        process.exit(0);
    });

    setTimeout(() => {
        process.exit(1);
    }, 10000);

    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}