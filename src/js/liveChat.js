let randomNum = Math.floor(Math.random() * (10000 - 1) + 1);

await sessionStorage.setItem("randomnum", randomNum);
$(document).ready(function () {
  const socket = io();

  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    randomNum = sessionStorage.getItem("randomnum");
    if (input.value) {
      socket.emit("chat message", `${randomNum} : ${input.value}`);
      input.value = "";
    }
  });

  socket.on("chat message", (msg) => {
    const item = document.createElement("li");
    item.textContent = msg;
    messages.appendChild(item);

    // 하단으로 이동
    messages.scrollTop = messages.scrollHeight;
  });
});
