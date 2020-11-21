const socket = io.connect('http://localhost:3000');


const messageInput = document.getElementById("messageInp");
messageInput.focus();
const sendBtn = document.getElementById("sendBtn");

const messageContainer = document.querySelector(".main-container");



const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add(position)
    if(position == "center"){
        messageElement.classList.add("info")
    } else 
    {
        messageElement.classList.add("message")
    }
    messageContainer.append(messageElement);
}

let name = prompt('Enter your name to join');
socket.emit('new-user-joined', name);


socket.on('user-joined',message=>{
    append(message, 'center')
});

socket.on('you-joined', (message) => {
    document.getElementById('username').innerHTML = name;
    append(message,'center');
})

messageInput.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key == "Enter") {
        sendMessage();
    }
});

function sendMessage(){
    
    const message = messageInput.value;
    console.log(message);
    messageInput.value = "" ;

    append(message, 'right');

    socket.emit('message-sent',message)

}

sendBtn.addEventListener('click', sendMessage);



socket.on('message-received', (message)=>{
    append(message, 'left');
})

