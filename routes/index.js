const express = require('express');
const router = express.Router();
const redisClient = require('../src/util/cache');

// 루트 라우트
router.get('/', (req, res) => {
    res.render("index");
});

// routes/index.js 파일에 새로운 라우트 추가
router.get('/about', (req, res) => {
    res.render("about");
});

router.get('/market', (req, res) => {
    res.render("market");
});

// 라우트 설정
router.post('/cache-nickname', async (req, res) => {
    console.log(req)
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).send('Nickname is required');
    }

    try {
        // Redis에 nickname 캐싱
        await redisClient.set(`nickname:${nickname}`, nickname, 'EX', 3600); // 1시간 동안 유효
        res.status(200).send('Nickname cached successfully!');
    } catch (error) {
        console.error('Error caching nickname:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
