const express = require('express');
const router = express.Router();
const path = require('path');

// 루트 라우트
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/view/index.html'));
});

// routes/index.js 파일에 새로운 라우트 추가
router.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../src/view/about.html'));
});

module.exports = router;
