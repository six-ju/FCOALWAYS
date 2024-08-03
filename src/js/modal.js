import position from "../data/position.js";

$(document).ready(function () {
  $(".modal-member-tab").click(function () {
    $(this).addClass("detail-click-tab");
    $(".modal-title").removeClass("detail-click-tab");
    $(".modal-Squad-tab").removeClass("detail-click-tab");
  });

  $(".modal-title").click(function () {
    $(this).addClass("detail-click-tab");
    $(".modal-member-tab").removeClass("detail-click-tab");
    $(".modal-Squad-tab").removeClass("detail-click-tab");
  });

  $(".modal-Squad-tab").click(async function () {
    $(this).addClass("detail-click-tab");
    $(".modal-member-tab").removeClass("detail-click-tab");
    $(".modal-title").removeClass("detail-click-tab");
    $(".modal-header > div").removeClass("active");
    $(this).addClass("active");
    await playerPosition();
    $(".modal-body").hide();
    $(".squad-section").show();
  });

  // 모달 닫기 버튼
  $(document).on("click", ".btn-close", async function () {
    $(".scoreSpan").empty();
    $(".matchDetailInfo").empty();
    $("#matchInfoModal").css("display", "none");
    $(".modal-title").addClass("detail-click-tab");
    $(".modal-member-tab").removeClass("detail-click-tab");
  });
});

async function playerPosition() {
  let playerId = sessionStorage.getItem("playerId");
  playerId = JSON.parse(playerId);
  let matchInfo = sessionStorage.getItem("matchInfoPick");
  matchInfo = JSON.parse(matchInfo);

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
  console.log(userPlayerNameId)
  console.log(oppenPlayerNameId)
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
