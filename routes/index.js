const express = require('express');
const router = express.Router();

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

module.exports = router;
