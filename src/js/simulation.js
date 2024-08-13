import season from '../data/season.js';

$(document).ready(function () {
    // 최상단 시즌별 아이콘 생성
    for (let i = 0; i < season.length; i++) {
        let lineNumber = Math.floor(i / 15) + 1;
        $(`.line-${lineNumber}`).append(`
            <td class="season-icon" data-id='${season[i].className}'>
                <img src='../img/season/${season[i].className}.png' alt='${season[i].className}' style="margin: 6px; width: 30px;">
            </td>
        `);
    }

    // 시즌 클릭시 어떤 시즌 클릭한지 확인
    $('.season-icon').click(function () {
        let a = $(this).data('id');
        console.log(a);
    });

    // 강화 단계 열고 닫는버튼
    $('.upgrade-simulation-player-basic').click(function () {
        if ($('.player-grade').hasClass('hide')) {
            $('.player-grade').removeClass('hide');
        } else {
            $('.player-grade').addClass('hide');
        }
    });

    // 시즌 열고 닫는 버튼
    $('.season-show-btn').click(function () {
        if ($('.season-sec-table').hasClass('hide')) {
            $('.season-sec-table').removeClass('hide');
            $('.season-show-btn').text('시즌 닫기');
        } else {
            $('.season-sec-table').addClass('hide');
            $('.season-show-btn').text('시즌 보기');
        }
    });

    // 특정강화 선택시 강화단계로 변경
    $('.player-grade li').on('click', function () {
        if ($(this).hasClass('upgrade-simulation-player-basic')) {
            $('.show-choose-grade').removeClass(
                'upgrade-simulation-player-bronze upgrade-simulation-player-silver upgrade-simulation-player-gold',
            );

            let grade = $(this).text();
            if (1 < grade && grade <= 4) {
                $('.show-choose-grade').addClass('upgrade-simulation-player-bronze');
            } else if (5 <= grade && grade <= 7) {
                $('.show-choose-grade').addClass('upgrade-simulation-player-silver');
            } else if (8 <= grade) {
                $('.show-choose-grade').addClass('upgrade-simulation-player-gold');
            }
            $('.show-choose-grade').text(`${grade} ▼`);
        }
    });
});
