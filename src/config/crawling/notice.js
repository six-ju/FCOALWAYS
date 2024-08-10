const puppeteer = require('puppeteer');

async function runCrawler() {
    // 브라우저 실행
    const browser = await puppeteer.launch({ headless: false });

    // 페이지 열기 및 크기설정
    const page = await browser.newPage();
    await page.setViewport({ width: 1900, height: 1800 });

    let userMatchInfoURL = `https://open.api.nexon.com/static/fconline/meta/spid.json`;
    let answers = await fetch(userMatchInfoURL);
    let playerId = await answers.json();
    
    // URL 접속
    for(let i = 0; i <= playerId.length; i++){
        console.log(playerId[i].id) 
        await page.goto(`https://fconline.nexon.com/DataCenter/PlayerInfo?spid=${playerId[i].id}&n1Strong=1`);
    }

    // 페이지 HTML 가져오기
    const content = await page.content();

    // 필요한 추가 작업을 여기서 수행

    // 브라우저 닫기
    // await browser.close();
}

module.exports = runCrawler;