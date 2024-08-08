$(document).ready(function () {
    // 홈 겸 유저 검색
    $('.userInfo').click(function (event) {
        event.preventDefault();
        window.location.href = '/';
    });

    $('.transferMarket').click(function (event) {
        event.preventDefault();
        window.location.href = '/market';
    });

    $('.live-chat').click(function (event) {
        event.preventDefault();
        window.location.href = '/liveChat';
    });

    $('.player-crawl').click(function (event) {
        event.preventDefault();
        window.location.href = '/player-crawler';
    });
});
