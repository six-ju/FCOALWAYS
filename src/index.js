$(document).ready(function () {
  $("#pw").click(function () {
    let id = $(".id").val();
    fifa(id);
  });

  // 엔터
  $(".id").on("keyup", function (key) {
    if (key.keyCode == 13) {
      let id = $(".id").val();
      fifa(id);
    }
  });
});

let API_KEY =
  "test_3a3ad56d3237983d9aaa7efed61238cf0550885dd47411e8a09fa4bf3c910dabefe8d04e6d233bd35cf2fabdeb93fb0d";

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
    .catch((error) => $(".here").html(`
      <p>사용자를 찾지 못했습니다.</p>
      <p>다시 입력해주세요. </p>
  `));
}

//  내정보 몰아서 보기
async function fifaUser(data) {
  let userInfo =
    "https://open.api.nexon.com/fconline/v1/user/basic?ouid=" + data.ouid;
  let maxdivision = await fifaMatchfinal(data.ouid);
  let answers = fetch(userInfo, {
    headers: {
      "x-nxopen-api-key": API_KEY,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // 예시: 가져온 데이터를 HTML에 추가하는 경우
      $(".here").html(`
            <p>닉네임: ${data.nickname}</p>
            <p>레 벨: ${data.level}</p>
            <p>달성 일자 : ${maxdivision.achievementDate}</p>
            <p>최고 점수 : ${maxdivision.division}</p>
            <p>경기 타입 : ${maxdivision.matchType}</p>
        `);
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
  maxdivisionData[0].achievementDate = maxdivisionData[0].achievementDate.split("T")[0];
  maxdivisionData[0].division = await fifaDivision(maxdivisionData[0].division);
  maxdivisionData[0].matchType = await fifaMathType(maxdivisionData[0].matchType);
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
