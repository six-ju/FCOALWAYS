const express = require('express');
const morgan = require('morgan');
const cookiParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const dotenv = require('dotenv');
const sql = require('mssql');
const schedule = require('./src/config/schedules/scheduler')
//설치한 미들웨어 및 모듈  불러오기

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);
//app.set('port,포트) : 서버가 실행될 포트 설정

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/view'));

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookiParser(process.env.COOKIE_SECRET));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false,
        },
        name: 'session-cookie',
    }),
);

const io = require('socket.io')(4000, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('새로운 소켓이 연결됐어요!');

    socket.on('message', (data) => {
        console.log(data);
    });
});


// SQL 접속 설정
const pool = new sql.ConnectionPool({
    user: process.env.DB_USER, // DB 사용자 이름
    password: process.env.DB_PASSWORD, // DB 사용자의 암호
    server: process.env.DB_HOST, // DB 서버 주소, localhost : 로컬호스트
    database: process.env.DB_NAME, // DB의 데이터베이스 이름
    options: {
      trustServerCertificate: true // 자체 신뢰 서버 인증
    },
  });

// 데이터베이스 연결
pool.connect((err) => {
    // 연결이 안될 경우 에러 내용 콘솔에 출력
    if (err) {
      console.error('Error connecting to database:', err);
      return;
    }
    // 연결에 성공할 경우 연결 성공 메시지 콘솔에 출력
    console.log('Connected to database!');
    console.log('Connected to 111111111111111111111!');
  });

app.use((req, res, next) => {
    next();
});

const indexRouter = require('./routes/index');
app.use('/', indexRouter);

// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname, 'src/view', 'index.html'));
// });
/*app.get(주소, 라우터) : 주소에 대한 GET요청이 올 때 어떤 동작을 할지 적는 부분
ex) app.post, app.patch, app.put, app.delete, app.options
express에서는 http와 다르게 res.write, rew.end 대신 res.send 사용
**/

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
