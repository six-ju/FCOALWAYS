// 어드민만 들어갈수있는 버튼 생성 크롤링을 위한 버튼 하나 만듬
// puppeteer을 가져온다.
const puppeteer = require('puppeteer');

(async () => {
    // 브라우저 실행
    // 옵션 headless모드
    const browser = await puppeteer.launch({headless: false});

    // 페이지 열기 및 크기설정
    const page = await browser.newPage();
    await page.setViewport({width:1900, height: 1800});

    // URL 접속
    await page.goto('https://fconline.nexon.com/news/notice/list');

    // 페이지 HTML 가져오기
    const content = await page.content();
})








