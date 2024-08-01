import fifaKey from "/config/config.js";

$(document).ready(function () {
  let win;
  let lose;
  let draw;
  let nickName;

  // form 이슈로 엔터 해도 적용됨
  $("#pw").click(async function (event) {
    event.preventDefault();

    // 로딩 gif 실행
    $('.loading').removeClass('hide')
    let $this = $(this); // 클릭된 버튼을 참조
    $this.prop("disabled", true); // 버튼 비활성화

    await searchEvent();
    
    $('.loading').addClass('hide')
    $this.prop("disabled", false); // 버튼 다시 활성화
  });

  $(".admin").click(function () {
    // 버튼 클릭 시 수행할 작업
    alert("Admin button clicked!");
  });

  // 더보기 버튼
  $(document).on("click", ".more-list-btn", async function () {
    let $this = $(this); // 클릭된 버튼을 참조
    $this.prop("disabled", true); // 버튼 비활성화
    let dataId = $(this).data("id");
    let ouId = await getOuid(nickName);
    if (dataId >= 2) {
      alert("최대 20개까지 조회가능합니다");
      return; // 함수 종료
    }
    await getMoreUserMatchInfo(ouId, dataId);
    $(this).remove();
    $(this).data("id", dataId + 1);
    $this.prop("disabled", false); // 버튼 다시 활성화
  });

  // 매치 디테일 정보 얻기 보기위함 클릭
  $(document).on("click", ".search-result", async function () {
    let id = $(this).attr("id");
    let list = sessionStorage.getItem("matchList");
    let matchList = JSON.parse(list); // 배열일 경우, 기본값을 빈 배열로 설정

    list = sessionStorage.getItem("matchListMore");
    let matchListMore = JSON.parse(list);
    matchList = matchList.concat(matchListMore);

    let selectMatchDetail = await getMatchDetil(id, matchList);
    console.log(selectMatchDetail);

    if (selectMatchDetail.matchInfo[0].nickname != nickName) {
      let tmp = selectMatchDetail.matchInfo[0];
      selectMatchDetail.matchInfo[0] = selectMatchDetail.matchInfo[1];
      selectMatchDetail.matchInfo[1] = tmp;
    }

    let userShootData = selectMatchDetail.matchInfo[0].shoot.shootTotal;
    let userEffectiveShootTotalData =
      selectMatchDetail.matchInfo[0].shoot.effectiveShootTotal;
    let userPassTryData = selectMatchDetail.matchInfo[0].pass.passTry;
    let userPassSuccessData = selectMatchDetail.matchInfo[0].pass.passSuccess;
    let userPossessionData =
      selectMatchDetail.matchInfo[0].matchDetail.possession;

    //슛 정확도
    let shootPercentage = (userEffectiveShootTotalData / userShootData) * 100;
    // 패스 정확도
    let passPercentage = (userPassSuccessData / userPassTryData) * 100;

    let shootData = [shootPercentage, 100 - shootPercentage];
    let passData = [passPercentage, 100 - passPercentage];
    let possessionData = [userPossessionData, 100 - userPossessionData];
    let backgroundColors = [
      "rgba(0, 255, 13, 0.8)",
      "rgba(255, 255, 255, 0.462)",
    ];
    let borderColors = ["rgba(0, 255, 13, 0.8)", "rgba(255, 255, 255, 0.462)"];

    $(".possesseionPercentage").text(Math.round(userPossessionData) + "%");
    $(".shootPercentage").text(Math.round(shootPercentage) + "%");
    $(".passPercentage").text(Math.round(passPercentage) + "%");

    await createDoughnutChart(
      "possesseionRateChart",
      possessionData,
      backgroundColors,
      borderColors
    );
    await createDoughnutChart(
      "shootRateChart",
      shootData,
      backgroundColors,
      borderColors
    );
    await createDoughnutChart(
      "passRateChart",
      passData,
      backgroundColors,
      borderColors
    );
  });

  // 모달 닫기 버튼
  $(document).on("click", ".btn-close", async function () {
    $(".scoreSpan").empty();
    $(".matchDetailInfo").empty();
    $("#matchInfoModal").css("display", "none");
  });

  $(document).click(function (event) {
    var target = $(event.target);
    if (
      !target.closest("#matchInfoModal .modal-content").length &&
      $("#matchInfoModal").is(":visible")
    ) {
      $("#matchInfoModal").modal("hide");
    }
  });

  // 검색버튼 클릭시
  async function searchEvent() {
    $(".notFoundNickName").html("");
    $(".userInfoPage").addClass("hide");
    $(".userAllMatchInfo").empty();
    nickName = $(".idinput").val().replace(/ /g, "");
    sessionStorage.setItem("nickname", nickName);
    let ouId = await getOuid(nickName);

    if (ouId == undefined) {
      alert("사용자를 찾지 못했습니다. 다시 입력해주세요.");
      return false;
    }

    let rateList = await fifaUser(ouId);
    win = rateList.win * 10;
    lose = rateList.lose * 10;
    draw = rateList.draw * 10;
    let average = 100 - lose - draw;
    $(".winRateNumber").text(`${average}%`);

    // 도넛 원 그래프
    const ctx = document.getElementById("winRateChart").getContext("2d");

    const winRateChart = new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "게임 결과",
            data: [win, lose, draw],
            backgroundColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(156, 163, 175, 0.8)",
            ],
            borderColor: [
              "rgba(34, 197, 94, 0.8)",
              "rgba(239, 68, 68, 0.8)",
              "rgba(156, 163, 175, 0.8)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
          },
          title: {
            display: true,
            text: "게임 승률",
          },
        },
      },
    });
  }

  // 매치 리스트 클릭시 디테일의 그래프
  function createDoughnutChart(chartId, data, backgroundColors, borderColors) {
    const element = document.getElementById(chartId);
    if (!element) {
      console.error(`Element with id ${chartId} not found`);
      return;
    }

    const ctx = element.getContext("2d");

    return new Chart(ctx, {
      type: "doughnut",
      data: {
        datasets: [
          {
            label: "게임 결과",
            data: data,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
      },
    });
  }
});

// 키값
const API_KEY = fifaKey.NEXON_API_KEY;
let characterName = "";

// OUID 가져오기
async function getOuid(nickName) {
  characterName = nickName;
  let ouIdURL = `https://open.api.nexon.com/fconline/v1/id?nickname=${nickName}`;
  try {
    let response = await fetch(ouIdURL, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error("사용자를 찾지 못했습니다.");
    }

    let ouId = await response.json();
    return ouId.ouid;
  } catch (error) {
    $(".notFoundNickName").html(`
          <p>${error.message}</p>
          <p>다시 입력해주세요. </p>
      `);
  }
}

//  내정보 몰아서 보기
async function fifaUser(ouid) {
  let rateList = {
    win: 0,
    lose: 0,
    draw: 0,
  };

  let userInfo =
    "https://open.api.nexon.com/fconline/v1/user/basic?ouid=" + ouid;

  // 정보 가져오기
  let maxdivision = await fifaMatchfinal(ouid);
  let userMatchInfo = await userAllMatchInfo(ouid);
  let palyerList = await getAllPlayerPhoto();

  let answers = await fetch(userInfo, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $(".userInfoPage").removeClass("hide");

      $(".showUserRandomPhoto").html(`
              <img src="${palyerList[0].photo}" class="playPhoto">
              <div class="name-container">
                  <span id="player-name">${palyerList[0].name}</span>
              </div>

              `);
      // 예시: 가져온 데이터를 HTML에 추가하는 경우
      $(".showUserInfoTable").html(`
            <p>닉네임: ${data.nickname}</p>
            <p>레 벨: ${data.level}</p>
            <p>달성 일자 : ${maxdivision.achievementDate}</p>
            <p>최고 점수 : ${maxdivision.division}</p>
            <p>경기 타입 : ${maxdivision.matchType}</p>
              `);

      for (let i = 0; i < userMatchInfo.length; i++) {
        if (userMatchInfo[i].matchInfo[0].nickname != characterName) {
          let temp = userMatchInfo[i].matchInfo[0];
          userMatchInfo[i].matchInfo[0] = userMatchInfo[i].matchInfo[1];
          userMatchInfo[i].matchInfo[1] = temp;
        }
        $(".userAllMatchInfo").append(`
                    <div class = 'search-result' id='${
                      userMatchInfo[i].matchId
                    }'>
                      <div class = "date-name-score-center">
                        <p> ${userMatchInfo[i].matchDate.split("T")[0]}</p>
                        <div class = "nickname-score">
                          <span> 
                            ${userMatchInfo[i].matchInfo[0].nickname}  
                                ${
                                  userMatchInfo[i].matchInfo[0].shoot.goalTotal
                                }  
                                    -  
                                ${
                                  userMatchInfo[i].matchInfo[1].shoot.goalTotal
                                }  
                            ${userMatchInfo[i].matchInfo[1].nickname}
                          </span>
                        </div>
                      </div>
                    </div>
                    `);

        // Select the most recently appended .search-result element
        let $lastSearchResult = $(".userAllMatchInfo .search-result").last();

        // Apply the background color based on match result
        if (userMatchInfo[i].matchInfo[0].matchDetail.matchResult === "승") {
          $lastSearchResult.addClass("win");
          rateList.win += 1;
        } else if (
          userMatchInfo[i].matchInfo[0].matchDetail.matchResult === "패"
        ) {
          $lastSearchResult.addClass("lose");
          rateList.lose += 1;
        } else if (
          userMatchInfo[i].matchInfo[0].matchDetail.matchResult === "무"
        ) {
          $lastSearchResult.addClass("draw");
          rateList.draw += 1;
        }
      }
      $(".userAllMatchInfo").append(`
              <div class='search-result more-list-btn' data-id="1">더보기</div>
              `);
    });
  return rateList;
}

// 경기 최고 기록
async function fifaMatchfinal(data) {
  let maxdivision =
    "https:open.api.nexon.com/fconline/v1/user/maxdivision?ouid=" + data;
  let answers = await fetch(maxdivision, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  });

  let maxdivisionData = await answers.json();
  maxdivisionData[0].achievementDate =
    maxdivisionData[0].achievementDate.split("T")[0];
  maxdivisionData[0].division = await fifaDivision(maxdivisionData[0].division);
  maxdivisionData[0].matchType = await fifaMathType(
    maxdivisionData[0].matchType
  );
  return maxdivisionData[0];
}

// 경기 타입 (예 공식경기)
async function fifaMathType(data) {
  let matchType =
    "https:open.api.nexon.com/static/fconline/meta/matchtype.json";
  let answers = await fetch(matchType, {});
  let type = await answers.json();
  for (let i = 0; i < type.length; i++) {
    if (type[i].matchtype == data) {
      return type[i].desc;
    }
  }
}

// 점수에 따른 등급이름
async function fifaDivision(data) {
  let divisionData =
    "https:open.api.nexon.com/static/fconline/meta/division.json";
  let answers = await fetch(divisionData, {});
  let datafordivision = await answers.json();
  for (let i = 0; i < datafordivision.length; i++) {
    if (datafordivision[i].divisionId == data) {
      return datafordivision[i].divisionName;
    }
  }
}

// 유저 매치 정보 가져오기
async function userAllMatchInfo(ouid) {
  let userMatchInfoURL = `https://open.api.nexon.com/fconline/v1/user/match?ouid=${ouid}&matchtype=50&offset=0&limit=10`;
  let answers = await fetch(userMatchInfoURL, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  });
  let getUserMatchId = await answers.json();
  let matchList = [];

  for (let i = 0; i < getUserMatchId.length; i++) {
    let userMatchInfoDetailURL = `https://open.api.nexon.com/fconline/v1/match-detail?ouid=${ouid}&matchid=${getUserMatchId[i]}`;
    answers = await fetch(userMatchInfoDetailURL, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    let getUserMatchDetailInfo = await answers.json();
    matchList.push(getUserMatchDetailInfo);
  }
  sessionStorage.setItem("matchList", JSON.stringify(matchList));
  return matchList;
}

// 매치 정보 더보기
async function getMoreUserMatchInfo(ouId, dataId) {
  let offset = 10;
  let limit = 10;
  if (dataId > 1) {
    offset += (dataId - 1) * 10;
  }

  let userMatchInfoURL = `https://open.api.nexon.com/fconline/v1/user/match?ouid=${ouId}&matchtype=50&offset=${offset}&limit=${limit}`;
  let answers = await fetch(userMatchInfoURL, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  });
  let getUserMatchId = await answers.json();
  let matchList = [];

  for (let i = 0; i < getUserMatchId.length; i++) {
    let userMatchInfoDetailURL = `https://open.api.nexon.com/fconline/v1/match-detail?ouid=${ouId}&matchid=${getUserMatchId[i]}`;
    answers = await fetch(userMatchInfoDetailURL, {
      headers: {
        "x-nxopen-api-key": API_KEY,
      },
    });
    let getUserMatchDetailInfo = await answers.json();
    matchList.push(getUserMatchDetailInfo);
  }

  for (let i = 0; i < matchList.length; i++) {
    if (matchList[i].matchInfo[0].nickname != characterName) {
      let temp = matchList[i].matchInfo[0];
      matchList[i].matchInfo[0] = matchList[i].matchInfo[1];
      matchList[i].matchInfo[1] = temp;
    }
    $(".userAllMatchInfo").append(`
          <div class = 'search-result' id='${matchList[i].matchId}'>
            <div class = "date-name-score-center">
              <p> ${matchList[i].matchDate.split("T")[0]}</p>
              <div class = "nickname-score">
                <span> 
                  ${matchList[i].matchInfo[0].nickname}  
                      ${matchList[i].matchInfo[0].shoot.goalTotal}  
                          -  
                      ${matchList[i].matchInfo[1].shoot.goalTotal}  
                  ${matchList[i].matchInfo[1].nickname}
                </span>
              </div>
            </div>
          </div>
          `);

    let $lastSearchResult = $(".userAllMatchInfo .search-result").last();

    if (matchList[i].matchInfo[0].matchDetail.matchResult === "승") {
      $lastSearchResult.addClass("win");
    } else if (matchList[i].matchInfo[0].matchDetail.matchResult === "패") {
      $lastSearchResult.addClass("lose");
    } else if (matchList[i].matchInfo[0].matchDetail.matchResult === "무") {
      $lastSearchResult.addClass("draw");
    }
  }

  sessionStorage.setItem("matchListMore", JSON.stringify(matchList));
}

// 모든 선수 이미지 가져오기
async function getAllPlayerPhoto() {
  let playerData = [];
  // 모든 선수 ID 가져옴
  let userMatchInfoURL = `https://open.api.nexon.com/static/fconline/meta/spid.json`;
  let answers = await fetch(userMatchInfoURL);
  let playerId = await answers.json();
  // 랜덤으로 선수 숫자가져오기
  let min = 62300;
  let max = 71214;
  let randomPlayerNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  let randomPlayerSpId = playerId[randomPlayerNumber].id;
  let randomPlayerName = playerId[randomPlayerNumber].name;

  // ID에 맞는 선수 이미지 가져오기
  let playerActionPhoto = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${randomPlayerSpId}.png`;

  playerData.push({
    id: randomPlayerSpId,
    name: randomPlayerName,
    photo: playerActionPhoto,
  });

  return playerData;
}

// 매치클릭시 디테일 매치정보 보여주기
async function getMatchDetil(id, matchList) {
  let selectDetailId = [];
  for (let i = 0; i <= matchList.length; i++) {
    if (matchList[i].matchId == id) {
      // 검색 유저가 무조건 0번째로 변경함
      if (matchList[i].matchInfo[0].nickname != characterName) {
        let temp = matchList[i].matchInfo[0];
        matchList[i].matchInfo[0] = matchList[i].matchInfo[1];
        matchList[i].matchInfo[1] = temp;
      }

      // 키보드 스틱 유저 분리
      let userPlayType =
        matchList[i].matchInfo[0].matchDetail.controller == "keyboard"
          ? "⌨️"
          : "🎮";
      let oppenPlayType =
        matchList[i].matchInfo[1].matchDetail.controller == "keyboard"
          ? "⌨️"
          : "🎮";

      $(".detail-score").append(`
                <span class='scoreSpan'> 
                <span class='playType'>${userPlayType}</span>
                    ${matchList[i].matchInfo[0].nickname}  
                        ${matchList[i].matchInfo[0].shoot.goalTotal}  
                            -  
                        ${matchList[i].matchInfo[1].shoot.goalTotal}  
                    ${matchList[i].matchInfo[1].nickname}
                    <span class='playType'>${oppenPlayType}</span>
                </span>
            `);

      Math.floor(1.777 * 10) / 10;
      let userAverage =
        Math.floor(
          matchList[i].matchInfo[0].matchDetail.averageRating * 2 * 10
        ) / 10;
      let oppenAverage =
        Math.floor(
          matchList[i].matchInfo[1].matchDetail.averageRating * 2 * 10
        ) / 10;

      if (userAverage > oppenAverage) {
        $(".detail-left").addClass("asd");
      } else {
        $(".detail-left").addClass("asd");
      }

      // 리펙토링 필요
      $(".matchDetailInfo").append(`
                <div class="matchInfoClass">
                    <span class='average-left'> ${userAverage} / 10 </span> <span> 경기 평점 </span> <span class='average-right'> ${oppenAverage} / 10 </span>
                </div>
                <div class="matchInfoClass">
                    <span class='goal-left'> ${matchList[i].matchInfo[0].shoot.goalTotal} </span> <span> 골 </span> <span class='goal-right'> ${matchList[i].matchInfo[1].shoot.goalTotal} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='shoot-left'>${matchList[i].matchInfo[0].shoot.shootTotal} </span> <span> 슛 </span> <span class='shoot-right'> ${matchList[i].matchInfo[1].shoot.shootTotal} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='effect-shoot-left'>${matchList[i].matchInfo[0].shoot.effectiveShootTotal} </span>  <span> 유효 슛 </span> <span class='effect-shoot-right'> ${matchList[i].matchInfo[1].shoot.effectiveShootTotal} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='pass-left'>${matchList[i].matchInfo[0].pass.passTry} </span>  <span> 패스 </span> <span class='pass-right'> ${matchList[i].matchInfo[1].pass.passTry} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='tackle-left'>${matchList[i].matchInfo[0].defence.tackleTry} </span> <span> 태클 </span> <span class='tackle-right'> ${matchList[i].matchInfo[1].defence.tackleTry} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='foul-left'>${matchList[i].matchInfo[0].matchDetail.foul} </span> <span> 파울 </span> <span class='foul-right'> ${matchList[i].matchInfo[1].matchDetail.foul} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='yellow-card-left'>${matchList[i].matchInfo[0].matchDetail.yellowCards} </span> <span> 엘로카드 </span> <span class='yellow-card-right'> ${matchList[i].matchInfo[1].matchDetail.yellowCards} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='red-card-left'>${matchList[i].matchInfo[0].matchDetail.redCards} </span> <span> 레드카드 </span> <span class='red-card-right'> ${matchList[i].matchInfo[1].matchDetail.redCards} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='free-kick-left'>${matchList[i].matchInfo[0].shoot.shootFreekick} </span> <span> 프리킥 </span> <span class='free-kick-right'> ${matchList[i].matchInfo[1].shoot.shootFreekick} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='corner-kick-left'>${matchList[i].matchInfo[0].matchDetail.cornerKick} </span> <span> 코너킥 </span> <span class='corner-kick-right'> ${matchList[i].matchInfo[1].matchDetail.cornerKick} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='penal-kick-left'>${matchList[i].matchInfo[0].shoot.shootPenaltyKick} </span> <span> 패널티킥 </span> <span class='penal-kick-right'> ${matchList[i].matchInfo[1].shoot.shootPenaltyKick} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='offside-left'>${matchList[i].matchInfo[0].matchDetail.offsideCount} </span> <span> 오프사이드 </span> <span class='offside-right'> ${matchList[i].matchInfo[1].matchDetail.offsideCount} </span>
                </div>
                <div class="matchInfoClass">
                    <span class='pause-left'>${matchList[i].matchInfo[0].matchDetail.systemPause} </span> <span> 일시정지 </span> <span class='pause-right'> ${matchList[i].matchInfo[1].matchDetail.systemPause} </span>
                </div>
            `);

      // Average
      compareAndAddClass(
        ".average-left",
        ".average-right",
        userAverage,
        oppenAverage
      );

      // Goal
      compareAndAddClass(
        ".goal-left",
        ".goal-right",
        matchList[i].matchInfo[0].shoot.goalTotal,
        matchList[i].matchInfo[1].shoot.goalTotal
      );

      // Shoot
      compareAndAddClass(
        ".shoot-left",
        ".shoot-right",
        matchList[i].matchInfo[0].shoot.shootTotal,
        matchList[i].matchInfo[1].shoot.shootTotal
      );

      // Effective Shoot
      compareAndAddClass(
        ".effect-shoot-left",
        ".effect-shoot-right",
        matchList[i].matchInfo[0].shoot.effectiveShootTotal,
        matchList[i].matchInfo[1].shoot.effectiveShootTotal
      );

      // Pass
      compareAndAddClass(
        ".pass-left",
        ".pass-right",
        matchList[i].matchInfo[0].pass.passTry,
        matchList[i].matchInfo[1].pass.passTry
      );

      // Tackle
      compareAndAddClass(
        ".tackle-left",
        ".tackle-right",
        matchList[i].matchInfo[0].defence.tackleTry,
        matchList[i].matchInfo[1].defence.tackleTry
      );

      // Foul
      compareAndAddClass(
        ".foul-left",
        ".foul-right",
        matchList[i].matchInfo[0].matchDetail.foul,
        matchList[i].matchInfo[1].matchDetail.foul
      );

      // Yellow Cards
      compareAndAddClass(
        ".yellow-card-left",
        ".yellow-card-right",
        matchList[i].matchInfo[0].matchDetail.yellowCards,
        matchList[i].matchInfo[1].matchDetail.yellowCards
      );

      // Red Cards
      compareAndAddClass(
        ".red-card-left",
        ".red-card-right",
        matchList[i].matchInfo[0].matchDetail.redCards,
        matchList[i].matchInfo[1].matchDetail.redCards
      );

      // Free Kick
      compareAndAddClass(
        ".free-kick-left",
        ".free-kick-right",
        matchList[i].matchInfo[0].shoot.shootFreekick,
        matchList[i].matchInfo[1].shoot.shootFreekick
      );

      // Corner Kick
      compareAndAddClass(
        ".corner-kick-left",
        ".corner-kick-right",
        matchList[i].matchInfo[0].matchDetail.cornerKick,
        matchList[i].matchInfo[1].matchDetail.cornerKick
      );

      // Penalty Kick
      compareAndAddClass(
        ".penal-kick-left",
        ".penal-kick-right",
        matchList[i].matchInfo[0].shoot.shootPenaltyKick,
        matchList[i].matchInfo[1].shoot.shootPenaltyKick
      );

      // Offside
      compareAndAddClass(
        ".offside-left",
        ".offside-right",
        matchList[i].matchInfo[0].matchDetail.offsideCount,
        matchList[i].matchInfo[1].matchDetail.offsideCount
      );

      // System Pause
      compareAndAddClass(
        ".pause-left",
        ".pause-right",
        matchList[i].matchInfo[0].matchDetail.systemPause,
        matchList[i].matchInfo[1].matchDetail.systemPause
      );

      $("#matchInfoModal").show();
      selectDetailId.push(matchList[i]);
      break;
    }
  }

  return await selectDetailId[0];
}

// 승패에 따른 색 부여
function compareAndAddClass(
  selectorLeft,
  selectorRight,
  valueLeft,
  valueRight
) {
  if (valueLeft > valueRight) {
    $(selectorLeft).addClass("win");
    $(selectorRight).addClass("lose");
  } else if(valueLeft < valueRight){
    $(selectorRight).addClass("win");
    $(selectorLeft).addClass("lose");
  }
}
