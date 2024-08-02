$(document).ready(function () {
    $('.modal-member-tab').click(function () {
        $(this).addClass('detail-click-tab');
        $('.modal-title').removeClass('detail-click-tab');
        $('.modal-Squad-tab').removeClass('detail-click-tab');
    });

    $('.modal-title').click(function () {
        $(this).addClass('detail-click-tab');
        $('.modal-member-tab').removeClass('detail-click-tab');
        $('.modal-Squad-tab').removeClass('detail-click-tab');
    });

    $('.modal-Squad-tab').click(async function () {
        $(this).addClass('detail-click-tab');
        $('.modal-member-tab').removeClass('detail-click-tab');
        $('.modal-title').removeClass('detail-click-tab');
        $('.modal-header > div').removeClass('active');
        $(this).addClass('active');
        await playerPosition()
        $('.modal-body').hide();
        $('.squad-section').show();
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

async function playerPosition(){
    let playerId = sessionStorage.getItem('playerId')
    playerId = JSON.parse(playerId)
    let matchInfo = sessionStorage.getItem('matchInfoPick')
    matchInfo = JSON.parse(matchInfo)

    console.log("playerId", playerId)

    let userPlayer = []
    let oppenPlayer = []
    for(let i = 0; i <= 17; i++){
        // 검색한 사용자
        if(matchInfo.matchInfo[0].player[i].spPosition != 28){
            userPlayer.push(matchInfo.matchInfo[0].player[i])
        }

        // 상대편
        if(matchInfo.matchInfo[1].player[i].spPosition != 28){
            oppenPlayer.push(matchInfo.matchInfo[1].player[i])
        }
    }


    // 정리된 선수 데이터
const filteredData = filterPlayers(playerId);

// 결과 출력
console.log(filteredData);

    console.log("userPlayer", userPlayer)
    console.log("oppenPlayer", oppenPlayer)

}

// 선수 데이터를 정리하는 함수
function filterPlayers(data) {
    const playerMap = new Map();

    data.forEach(player => {
        const seasonNumber = Math.floor(player.id / 1000000);
        const playerNumber = player.id % 1000000;

        if (!playerMap.has(playerNumber) || seasonNumber > Math.floor(playerMap.get(playerNumber).id / 1000000)) {
            playerMap.set(playerNumber, player);
        }
    });

    return Array.from(playerMap.values());
}

