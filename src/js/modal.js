import position from '../data/position.js';

$(document).ready(function () {
    // 멤버 클릭시
    $('.modal-member-tab').click(function () {
        $(this).addClass('detail-click-tab');
        $('.modal-title').removeClass('detail-click-tab');
        $('.modal-Squad-tab').removeClass('detail-click-tab');
    });

    // detail 클릭시
    $('.modal-title').click(function () {
        $(this).addClass('detail-click-tab');
        $('.modal-member-tab').removeClass('detail-click-tab');
        $('.modal-Squad-tab').removeClass('detail-click-tab');
        $('.modal-body').show();
        $('.squad-section').addClass('hide');
    });

    // 스쿼드탭 클릭시
    $('.modal-Squad-tab').click(async function () {
        $(this).addClass('detail-click-tab');
        $('.modal-member-tab').removeClass('detail-click-tab');
        $('.modal-title').removeClass('detail-click-tab');
        $('.modal-header > div').removeClass('active');
        $(this).addClass('active');
        $('.squad-tap-each-user').empty();
        $('.oppenPlayer').addClass('hide');
        $('.userPlayer').removeClass('hide');
        await playerPosition();
        $('.modal-body').hide();
        $('.squad-section').show();
    });

    // 유저 닉네임 클릭시(스쿼드탭)
    $(document).on('click', '#userPlayer', async function () {
        $('.userPlayer').removeClass('hide');
        $('#oppenPlayer').removeClass('select');
        $('#userPlayer').addClass('select');
        $('.oppenPlayer').addClass('hide');
    });

    // 상대 닉네임 클릭시(스쿼드탭)
    $(document).on('click', '#oppenPlayer', async function () {
        $('.oppenPlayer').removeClass('hide');
        $('.userPlayer').addClass('hide');
        $('#oppenPlayer').addClass('select');
        $('#userPlayer').removeClass('select');
    });

    // 모달 닫기 버튼
    $(document).on('click', '.btn-close', async function () {
        $('.scoreSpan').empty();
        $('.matchDetailInfo').empty();
        $('#matchInfoModal').css('display', 'none');
        $('.modal-title').addClass('detail-click-tab');
        $('.modal-Squad-tab').removeClass('detail-click-tab');
        $('.modal-member-tab').removeClass('detail-click-tab');
        $('.oppenPlayer').addClass('hide');
        $('.userPlayer').removeClass('hide');
        $('.modal-body').show();
        $('.squad-section').hide();
    });
});

async function playerPosition() {
    let playerId = sessionStorage.getItem('playerId');
    playerId = JSON.parse(playerId);
    let matchInfo = sessionStorage.getItem('matchInfoPick');
    matchInfo = JSON.parse(matchInfo);

    $('.squad-tap-each-user').append(`
        <div class='select' id="userPlayer">${matchInfo.matchInfo[0].nickname}</div>
        <div id="oppenPlayer">${matchInfo.matchInfo[1].nickname}</div>
    `);

    let userPlayer = [];
    let oppenPlayer = [];
    for (let i = 0; i <= 17; i++) {
        // 검색한 사용자 모든정보
        if (matchInfo.matchInfo[0].player[i].spPosition != 28) {
            userPlayer.push(matchInfo.matchInfo[0].player[i]);
        }

        // 상대편 모든정보
        if (matchInfo.matchInfo[1].player[i].spPosition != 28) {
            oppenPlayer.push(matchInfo.matchInfo[1].player[i]);
        }
    }

    // 검색한 사용자 포지션 변경
    for (let i = 0; i < userPlayer.length; i++) {
        for (let j = 0; j < position.length; j++) {
            if (position[j].spposition == userPlayer[i].spPosition) {
                userPlayer[i].spPosition = position[j].desc;
                break;
            }
        }
    }

    // 상대편 포지션 변경
    for (let i = 0; i < oppenPlayer.length; i++) {
        for (let j = 0; j < position.length; j++) {
            if (position[j].spposition == oppenPlayer[i].spPosition) {
                oppenPlayer[i].spPosition = position[j].desc;
                break;
            }
        }
    }

    // 정리된 선수 데이터
    const filteredData = filterPlayers(playerId);

    // 결과 출력
    let userPlayerNameId = [];
    let oppenPlayerNameId = [];

    // 유저 선수
    for (let j = 0; j < userPlayer.length; j++) {
        let idString = userPlayer[j].spId.toString().slice(3);
        // filteredData 배열을 순회
        for (let i = 0; i < filteredData.length; i++) {
            let filterIdString = filteredData[i].id.toString().slice(3);
            if (filterIdString == idString) {
                userPlayerNameId.push({
                    name: filteredData[i].name,
                    playerInfo: userPlayer[j],
                });
                break; // `filteredData` 배열의 현재 루프 종료
            }
        }
    }

    // 상대방 선수
    for (let j = 0; j < oppenPlayer.length; j++) {
        let idString = oppenPlayer[j].spId.toString().slice(3);
        // filteredData 배열을 순회
        for (let i = 0; i < filteredData.length; i++) {
            let filterIdString = filteredData[i].id.toString().slice(3);
            if (filterIdString == idString) {
                oppenPlayerNameId.push({
                    name: filteredData[i].name,
                    playerInfo: oppenPlayer[j],
                });
                break; // `filteredData` 배열의 현재 루프 종료
            }
        }
    }

    // 유저 스쿼드 
    for (let i = 0; i < userPlayerNameId.length; i++) {
        $('.userPlayer').append(`
        <div class='player ${userPlayerNameId[i].playerInfo.spPosition}'>${userPlayerNameId[i].playerInfo.spPosition}</div>
          <div class='playerName ${userPlayerNameId[i].playerInfo.spPosition}' style='margin-top: 50px;'>${userPlayerNameId[i].name}</div>
      `);
    }

    // 상대 스쿼드 
    for (let i = 0; i < oppenPlayerNameId.length; i++) {
        $('.oppenPlayer').append(`
        <div class='player ${oppenPlayerNameId[i].playerInfo.spPosition}'>${oppenPlayerNameId[i].playerInfo.spPosition}</div>
          <div class='playerName ${oppenPlayerNameId[i].playerInfo.spPosition}' style='margin-top: 50px;'>${oppenPlayerNameId[i].name}</div>
      `);
    }
}

// 선수 데이터를 정리하는 함수
function filterPlayers(data) {
    let playerList = [];
    // 한번 지나간 숫자를 기억하고있는다.
    let seenNumbers = new Set();

    data.forEach((player) => {
        let stringPlayerId = player.id.toString();
        let num = stringPlayerId.slice(3);

        if (!seenNumbers.has(num)) {
            playerList.push(player);
            seenNumbers.add(num);
        }
    });
    return playerList;
}
