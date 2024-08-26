const express = require('express');
const requestIp = require("request-ip");
const router = express.Router();
const runCrawler = require('../src/config/crawling/notice'); // 경로를 정확히 지정해야 합니다

// 루트 라우트
router.get('/', (req, res) => {
    res.render("index");
    console.log(requestIp.getClientIp(req))
});

// routes/index.js 파일에 새로운 라우트 추가
router.get('/about', (req, res) => {
    res.render("about");
});

router.get('/market', (req, res) => {
    res.render("market");
});

router.get('/liveChat', (req, res) => {
    res.render("liveChat");
});

router.get('/simulation', (req, res) => {
    res.render("simulation");
    console.log(requestIp.getClientIp(req))
});

// 크롤러 실행 라우트 추가
router.get('/player-crawler', async (req, res) => {
    try {
        await runCrawler(); // 크롤러 실행
        res.send("크롤러가 성공적으로 실행되었습니다!");
    } catch (error) {
        console.error("크롤러 실행 중 오류 발생:", error);
        res.status(500).send("크롤러 실행 중 오류가 발생했습니다.");
    }
});

module.exports = router;
