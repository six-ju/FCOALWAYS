const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// 서버 포트 설정
app.set('port', process.env.PORT || 3000);

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/view'));

// 미들웨어 설정
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());
app.use(express.urlencoded({ extended: true  }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        secret: process.env.COOKIE_SECRET || 'default-secret-key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'session-cookie',
    }),
);

// 라우터 설정
const indexRouter = require('./routes/routes');
app.use('/', indexRouter);

// 루트 경로에서 HTML 파일 제공
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src/view', 'index.html'));
});

// 소켓 연결 및 이벤트 핸들러 설정
io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('chat message', 'a user connected');

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
        io.emit('chat message', 'user disconnected');
    });
});

// 서버 시작
server.listen(app.get('port'), () => {
    console.log(`${app.get('port')}번 포트에서 대기 중`);
});
