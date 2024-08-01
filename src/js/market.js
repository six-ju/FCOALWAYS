import fifaKey from "/config/config.js";

$(document).ready(function(){
    $('.test').click(async function(){
        console.log(1)
        await test();
    })
})
const API_KEY = fifaKey.NEXON_API_KEY;
async function test(){

    console.log(2)

let maxdivision =
`https:open.api.nexon.com/fconline/v1/user/trade?tradetype=buy`;
let answers = await fetch(maxdivision, {
headers: {
  "x-nxopen-api-key": API_KEY,
},
});

let maxdivisionData = await answers.json();
console.log(maxdivisionData)
}