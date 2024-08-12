import season from '../data/season.js';

$(document).ready(function () {
    // 최상단 시즌별 아이콘 생성
    for(let i = 0; i < season.length; i++){
        let lineNumber = Math.floor(i / 15) + 1;
        $(`.line-${lineNumber}`).append(`
            <td class="season-icon" data-id='${season[i].className}'>
                <img src='../img/season/${season[i].className}.png' alt='${season[i].className}' style="margin: 6px; width: 30px;">
            </td>
        `);
    }

    // 시즌 클릭시 어떤 시즌 클릭한지 확인
    $('.season-icon').click(function(){
        let a = $(this).data('id')
        console.log(a)
    })
});
