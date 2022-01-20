var socket = io();

//1-You are joined
document.getElementById("messages").innerHTML +=
  "<div><b> You are Joined </b></div>";
let newUser = prompt("Ismingiz :");

//3- online userlar sonini chiqarish
socket.on("printNumOnUsers", (data) => {
  data.onlineUsers > 1
    ? (document.getElementById("numOnline").innerHTML =
        "Tarmoqda : " + data.onlineUsers + "kishi Online")
    : (document.getElementById("numOnline").innerHTML =
        "Tarmoqda : faqat siz Online");

  selUsers.innerHTML = null;
  data.users.forEach((user) => {
    selUsers.innerHTML += `<option>${user.name}</option>`;
    console.log(selUsers);
  });

  console.log(data.users);
});

//4-user kirs newUser function ishlasin
socket.emit("newUser", newUser);

//6-userslarga habar yuborilsin. yangi user haqida
socket.on("newUserJoined", (data) => {
  document.getElementById("messages").innerHTML +=
    "<div><b>" + data.newUser + "</b>: Joined" + "</div>";
});

//7-User input orqali habar yozsa shu va serverdagi newMessage funct ishlasin, data qilib habarni va uni yozgan userni yubrosin
function newMessage() {
  socket.emit("newMessage", {
    msg: messageIn.value,
    user: newUser,
    to: selUsers.value,
  });
}

//9-habarlarni hammaga usernomi bilan chiqgazsin.
socket.on("printMessage", (data) => {
  document.getElementById("messages").innerHTML +=
    "<div><b>" + data.user + "</b>: " + data.msg + "</div>";
});

socket.on("printMessageYou", (data) => {
  if (data.to != newUser) {
    document.getElementById("messages").innerHTML +=
      "<div><b>" + data.user + "</b>: " + data.msg + "</div>";
  } else {
    alert("O'zingizga o'zingiz habar yoza olmaysiz");
  }
});

socket.on("ErrorUser", (data) => {
  alert(data);
});
