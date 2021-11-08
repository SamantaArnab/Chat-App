const socket = io();

const chatForm = document.getElementById("message-form")
const messageInput = document.getElementById("message-input")
const messageContainer = document.getElementById('message-container')
const name = prompt('What is your name?')
appendMessage('You joined')
socket.emit("new-user", name)

socket.on("message", message => {
  console.log(message);
});
socket.on("chat-message", data => {
  appendMessage(`${data.name} : ${data.message}`)
})

socket.on("user-connected", name => {
  appendMessage(`${name} connected`)
})

socket.on("user-disconnected", name => {
  appendMessage(`${name} disconnected`)
})

chatForm.addEventListener("submit", e => {
  e.preventDefault();
  // const sentMessage = e.target.elements.message.value;
  const message = messageInput.value
  sentDate = new Date()
  hour = sentDate.getHours()
  minute = sentDate.getMinutes()
  appendMessage(`You: ${message}`, `${hour}:${minute}`)
  // appendTime(`${hour} : ${minute}`)
  socket.emit("send-chat-message", message, deliveryMessage => {
    console.log(deliveryMessage);
  });
  messageInput.value = ''
});
//-------------
document.querySelector("#location-button").addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported");
  }
  navigator.geolocation.getCurrentPosition(position => {
    socket.emit(
      "sentLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      },
      (deliveryMessage) => {
        console.log(deliveryMessage);
      }
    );
  });
});

function appendMessage(message, sentTime) {
  const testContainer = document.createElement('div')
  testContainer.id = "test";
  const messageContent = document.createElement('div')
  messageContent.id = "message"
  const timeContent = document.createElement('div')
  timeContent.id = "time"
  messageContent.innerText = message
  timeContent.innerText = sentTime
  testContainer.appendChild(messageContent)
  testContainer.appendChild(timeContent)
  messageContainer.appendChild(testContainer)

}
function appendTime(sentTime) {
  const messageElement = document.createElement('div',{id: "time"})
  timeDisplay.innerText = sentTime
  timeDisplay.append(messageElement)
}