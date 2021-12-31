const socket = io.connect("https://node-and-chat.herokuapp.com/");

const messageInput = document.getElementById("messageInp");
messageInput.focus();
const sendBtn = document.getElementById("sendBtn");

const messageContainer = document.querySelector(".main-container");
j;
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add(position);
  if (position == "center") {
    messageElement.classList.add("info");
  } else {
    messageElement.classList.add("message");
  }
  messageContainer.append(messageElement);
};

socket.on("user-joined", (message) => {
  append(message, "center");
});

socket.on("you-joined", (message) => {
  console.log(message);
  append(message, "center");
});

messageInput.addEventListener("keyup", function (event) {
  event.preventDefault();
  if (event.key == "Enter") {
    sendMessage();
  }
});

const start = () => {
  return new Promise((resolve, reject) => {
    const name = prompt("Enter your name to enter the chat: ");

    if (name === undefined || name.length === 0) {
      reject(
        "A valid name was not provided.\nPlease relaunch the application."
      );
    } else {
      socket.emit("new-user-joined", name);
      resolve(name);
    }
  });
};
start()
  .then((name) => {
    const alert = document.getElementById("success-alert");
    document.getElementById("username").innerText = name;
    setTimeout(() => {
      alert.classList.add("fade-out");
    }, 2000);
  })
  .catch((error) => {
    alert(error);
    while (document.firstChild) {
      document.body.remove(document.firstChild);
    }
  });

function sendMessage() {
  const message = messageInput.value;
  console.log(message);
  messageInput.value = "";

  append(message, "right");

  socket.emit("message-sent", message);
}

sendBtn.addEventListener("click", sendMessage);

socket.on("message-received", (message) => {
  append(message, "left");
});
