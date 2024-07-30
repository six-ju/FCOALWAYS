import fifaKey from '/config/config.js';

$(document).ready(function () {
    let win;
    let lose;
    let draw;

    $('#pw').click(async function () {
        await event();
    });

    // 엔터
    $('.idinput').on('keyup', async function (key) {
        if (key.keyCode == 13) {
            await event();
        }
    });

    $('.admin').click(function () {
        // 버튼 클릭 시 수행할 작업
        alert('Admin button clicked!');
    });

    // 더보기 버튼
    $(document).on('click', '.more-list-btn', async function () {
        let $this = $(this); // 클릭된 버튼을 참조
        $this.prop('disabled', true); // 버튼 비활성화
        let nickName = $('.idinput').val().replace(/ /g, '');
        let dataId = $(this).data('id');
        let ouId = await getOuid(nickName);
        if(dataId > 2){
          alert('최대 30개까지 조회가능합니다');
          return; // 함수 종료
        }
        await getMoreUserMatchInfo(ouId, dataId);
        $(this).remove();
        $(this).data('id', dataId + 1);
        $this.prop('disabled', false); // 버튼 다시 활성화
    });

    $('.goodManners').click(function() {
        $('#matchInfoModal').modal('show');
    });

    async function event() {
        $('.notFoundNickName').html('');
        $('.userInfoPage').addClass('hide');
        $('.userAllMatchInfo').empty();
        let nickName = $('.idinput').val().replace(/ /g, '');
        let ouId = await getOuid(nickName);
        let rateList = await fifaUser(ouId);
        win = rateList.win * 10;
        lose = rateList.lose * 10;
        draw = rateList.draw * 10;
        let average = 100 - lose - draw;
        $('.winRateNumber').text(`${average}%`);

        // 도넛 원 그래프
        const ctx = document.getElementById('winRateChart').getContext('2d');

        const winRateChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['승리', '패배', '무승부'],
                datasets: [
                    {
                        label: '게임 결과',
                        data: [win, lose, draw],
                        backgroundColor: [
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(156, 163, 175, 0.8)',
                        ],
                        borderColor: [
                            'rgba(34, 197, 94, 0.8)',
                            'rgba(239, 68, 68, 0.8)',
                            'rgba(156, 163, 175, 0.8)',
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
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: '게임 승률',
                    },
                },
            },
        });
    }
});

// 키값
const API_KEY = fifaKey.NEXON_API_KEY;
let characterName = '';

// OUID 가져오기
async function getOuid(nickName) {
    characterName = nickName;
    let ouIdURL = `https://open.api.nexon.com/fconline/v1/id?nickname=${nickName}`;
    try {
        let response = await fetch(ouIdURL, {
            headers: {
                'x-nxopen-api-key': API_KEY,
            },
        });

        if (!response.ok) {
            throw new Error('사용자를 찾지 못했습니다.');
        }

        let ouId = await response.json();
        return ouId.ouid;
    } catch (error) {
        $('.notFoundNickName').html(`
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

    let userInfo = 'https://open.api.nexon.com/fconline/v1/user/basic?ouid=' + ouid;

    // 정보 가져오기
    let maxdivision = await fifaMatchfinal(ouid);
    let userMatchInfo = await userAllMatchInfo(ouid);
    let palyerList = await getAllPlayerPhoto();

    let answers = await fetch(userInfo, {
        headers: {
            'x-nxopen-api-key': API_KEY,
        },
    })
        .then((response) => response.json())
        .then((data) => {
            $('.userInfoPage').removeClass('hide');

            $('.showUserRandomPhoto').html(`
              <img src="${palyerList[0].photo}" class="playPhoto">
              <div class="name-container">
                  <span id="player-name">${palyerList[0].name}</span>
              </div>

              `);
            // 예시: 가져온 데이터를 HTML에 추가하는 경우
            $('.showUserInfoTable').html(`
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
                $('.userAllMatchInfo').append(`
                    <div class = 'search-result'>
                      <div class = "date-name-score-center">
                        <p> ${userMatchInfo[i].matchDate.split('T')[0]}</p>
                        <div class = "nickname-score">
                          <span> 
                            ${userMatchInfo[i].matchInfo[0].nickname}  
                                ${userMatchInfo[i].matchInfo[0].shoot.goalTotal}  
                                    -  
                                ${userMatchInfo[i].matchInfo[1].shoot.goalTotal}  
                            ${userMatchInfo[i].matchInfo[1].nickname}
                          </span>
                        </div>
                      </div>
                    </div>
                    `);

                // Select the most recently appended .search-result element
                let $lastSearchResult = $('.userAllMatchInfo .search-result').last();

                // Apply the background color based on match result
                if (userMatchInfo[i].matchInfo[0].matchDetail.matchResult === '승') {
                    $lastSearchResult.addClass('win');
                    console.log(rateList.win);
                    rateList.win += 1;
                } else if (userMatchInfo[i].matchInfo[0].matchDetail.matchResult === '패') {
                    $lastSearchResult.addClass('lose');
                    console.log(rateList.lose);
                    rateList.lose += 1;
                } else if (userMatchInfo[i].matchInfo[0].matchDetail.matchResult === '무') {
                    $lastSearchResult.addClass('draw');
                    console.log(rateList.draw);
                    rateList.draw += 1;
                }
            }
            console.log('rateList');
            console.log(rateList);
            $('.userAllMatchInfo').append(`
              <div class='search-result more-list-btn' data-id="1">더보기</div>
              `);
        });
    return rateList;
}

// 경기 최고 기록
async function fifaMatchfinal(data) {
    let maxdivision = 'https:open.api.nexon.com/fconline/v1/user/maxdivision?ouid=' + data;
    let answers = await fetch(maxdivision, {
        headers: {
            'x-nxopen-api-key': API_KEY,
        },
    });

    let maxdivisionData = await answers.json();
    maxdivisionData[0].achievementDate = maxdivisionData[0].achievementDate.split('T')[0];
    maxdivisionData[0].division = await fifaDivision(maxdivisionData[0].division);
    maxdivisionData[0].matchType = await fifaMathType(maxdivisionData[0].matchType);
    return maxdivisionData[0];
}

// 경기 타입 (예 공식경기)
async function fifaMathType(data) {
    let matchType = 'https:open.api.nexon.com/static/fconline/meta/matchtype.json';
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
    let divisionData = 'https:open.api.nexon.com/static/fconline/meta/division.json';
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
            'x-nxopen-api-key': API_KEY,
        },
    });
    let getUserMatchId = await answers.json();
    let matchList = [];

    for (let i = 0; i < getUserMatchId.length; i++) {
        let userMatchInfoDetailURL = `https://open.api.nexon.com/fconline/v1/match-detail?ouid=${ouid}&matchid=${getUserMatchId[i]}`;
        answers = await fetch(userMatchInfoDetailURL, {
            headers: {
                'x-nxopen-api-key': API_KEY,
            },
        });
        let getUserMatchDetailInfo = await answers.json();
        matchList.push(getUserMatchDetailInfo);
    }

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
            'x-nxopen-api-key': API_KEY,
        },
    });
    let getUserMatchId = await answers.json();
    let matchList = [];

    for (let i = 0; i < getUserMatchId.length; i++) {
        let userMatchInfoDetailURL = `https://open.api.nexon.com/fconline/v1/match-detail?ouid=${ouId}&matchid=${getUserMatchId[i]}`;
        answers = await fetch(userMatchInfoDetailURL, {
            headers: {
                'x-nxopen-api-key': API_KEY,
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
        $('.userAllMatchInfo').append(`
          <div class = 'search-result'>
            <div class = "date-name-score-center">
              <p> ${matchList[i].matchDate.split('T')[0]}</p>
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

        let $lastSearchResult = $('.userAllMatchInfo .search-result').last();

        if (matchList[i].matchInfo[0].matchDetail.matchResult === '승') {
            $lastSearchResult.addClass('win');
        } else if (matchList[i].matchInfo[0].matchDetail.matchResult === '패') {
            $lastSearchResult.addClass('lose');
        } else if (matchList[i].matchInfo[0].matchDetail.matchResult === '무') {
            $lastSearchResult.addClass('draw');
        }
    }

    $('.userAllMatchInfo').append(`
      <div class='search-result more-list-btn' data-id=${dataId + 1}>더보기</div>
      `);
}

// 모든 선수 이미지 가져오기
async function getAllPlayerPhoto() {
    let playerData = [];
    // 모든 선수 ID 가져옴
    let userMatchInfoURL = `https://open.api.nexon.com/static/fconline/meta/spid.json`;
    let answers = await fetch(userMatchInfoURL);
    let playerId = await answers.json();
    console.log(playerId);
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
