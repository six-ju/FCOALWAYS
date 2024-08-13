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

    // 강화 버튼 눌렀을때
    $('.grade-upgrade-btn').click(function () {
        let grade = $('.show-choose-grade').text().split(' ')[0];
        console.log(grade);
        var successRate;

        if (grade == 1) {
            successRate = 80; // 80% 확률
        } else if (grade == 2) {
            successRate = 70; // 70% 확률
        } else if (grade == 3) {
            successRate = 60; // 60% 확률
        } else if (grade == 4) {
            successRate = 50; // 50% 확률
        } else if (grade == 5) {
            successRate = 40; // 40% 확률
        } else if (grade == 6) {
            successRate = 30; // 30% 확률
        } else if (grade == 7) {
            successRate = 20; // 20% 확률
        } else if (grade == 8) {
            successRate = 10; // 10% 확률
        } else {
            successRate = 5; // 5% 확률 (최종 단계)
        }

        var randomNumber = Math.floor(Math.random() * 100); // 0 ~ 99.999... 사이의 수 생성

        if (randomNumber < successRate) {
            // 강화 성공
            alert('강화 성공!');
            // 강화 등급을 증가시키는 로직 추가
        } else {
            // 강화 실패
            alert('강화 실패...');
            // 강화 실패 시의 로직 추가 (예: 등급 감소 또는 유지)
        }
    });
    
    // 강화 단계
    $('.input-range').on('input', function(){
        $('.input-range-num').text($(this).val());
    })
});
