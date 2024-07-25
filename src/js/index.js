import fifaKey from "/config/config.js";

$(document).ready(function () {
  $("#pw").click(function () {
    $(".notFoundNickName").html("");
    $(".userInfoPage").addClass("hide");
    let id = $(".idinput").val().replace(/ /g, "");
    fifa(id);
  });

  // 엔터
  $(".idinput").on("keyup", function (key) {
    if (key.keyCode == 13) {
      $(".notFoundNickName").html("");
      $(".userInfoPage").addClass("hide");
      let id = $(".idinput").val().replace(/ /g, "");
      fifa(id);
    }
  });
  $(".admin").click(function () {
    // 버튼 클릭 시 수행할 작업
    alert("Admin button clicked!");
  });
});
const API_KEY = fifaKey.NEXON_API_KEY;

function fifa(id) {
  let characterName = id;
  let ouId =
    "https://open.api.nexon.com/fconline/v1/id?nickname=" + characterName;

  let answer = fetch(ouId, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => fifaUser(data))
    .catch((error) =>
      $(".notFoundNickName").html(`
      <p>사용자를 찾지 못했습니다.</p>
      <p>다시 입력해주세요. </p>
  `)
    );
}

//  내정보 몰아서 보기
async function fifaUser(data) {
  let userInfo =
    "https://open.api.nexon.com/fconline/v1/user/basic?ouid=" + data.ouid;

  // 정보 가져오기
  let maxdivision = await fifaMatchfinal(data.ouid);
  let userMatchInfo = await userAllMatchInfo(data.ouid);
  console.log(userMatchInfo);
  let answers = fetch(userInfo, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      $(".userInfoPage").removeClass("hide");
      // 예시: 가져온 데이터를 HTML에 추가하는 경우
      $(".showUserInfoTable").html(`
            <p>닉네임: ${data.nickname}</p>
            <p>레 벨: ${data.level}</p>
            <p>달성 일자 : ${maxdivision.achievementDate}</p>
            <p>최고 점수 : ${maxdivision.division}</p>
            <p>경기 타입 : ${maxdivision.matchType}</p>
              `);

      for (let i = 0; i < userMatchInfo.length; i++) {
        $(".userAllMatchInfo").append(`
                    <div class = 'search-result'>
                      <div class = "date-name-score-center">
                        <p> ${userMatchInfo[i].matchDate}</p>
                        <div class = "nickname-score">
                          <span> ${userMatchInfo[i].matchInfo[0].nickname}</span>
                          <span> ${userMatchInfo[i].matchInfo[0].shoot.goalTotal}</span>
                          - 
                          <span> ${userMatchInfo[i].matchInfo[1].shoot.goalTotal}</span>
                          <span> ${userMatchInfo[i].matchInfo[1].nickname}</span>
                        </div>
                      </div>
                    </div>
                    `);

        // Select the most recently appended .search-result element
        let $lastSearchResult = $(".userAllMatchInfo .search-result").last();

        // Apply the background color based on match result
        if (userMatchInfo[i].matchInfo[0].matchDetail.matchResult === "승") {
          $lastSearchResult.addClass("win");
        } else {
          $lastSearchResult.addClass("lose");
        }
      }
    });
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
  console.log(datafordivision);
  for (let i = 0; i < datafordivision.length; i++) {
    if (datafordivision[i].divisionId == data) {
      return datafordivision[i].divisionName;
    }
  }
}

// 유저 매치 정보 가져오기
async function userAllMatchInfo(ouid) {
  let userMatchInfoURL = `https://open.api.nexon.com/fconline/v1/user/match?ouid=${ouid}&matchtype=50&limit=2`;
  let answers = await fetch(userMatchInfoURL, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  });
  let getUserMatchId = await answers.json();
  console.log(getUserMatchId);
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

  return matchList;
}
