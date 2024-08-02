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

    $('.modal-member-tab').click(function () {
        $(this).addClass('detail-click-tab');
        $('.modal-title').removeClass('detail-click-tab');
    });

    $('.modal-title').click(function () {
        $(this).addClass('detail-click-tab');
        $('.modal-member-tab').removeClass('detail-click-tab');
    });

    // 모달 닫기 버튼
    $(document).on('click', '.btn-close', async function () {
        $('.scoreSpan').empty();
        $('.matchDetailInfo').empty();
        $('#matchInfoModal').css('display', 'none');
        $('.modal-title').addClass('detail-click-tab');
        $('.modal-member-tab').removeClass('detail-click-tab');
    });
});
