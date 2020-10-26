const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector("#chat-form").addEventListener('submit', (e) =>{
    e.preventDefault()
    const sentMessage = e.target.elements.message.value
    socket.emit('sentMessage', sentMessage, (deliveryMessage) => {
        console.log(deliveryMessage)
    })
})
document.querySelector('#location-button').addEventListener('click',() => {
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sentLocation',{latitude: position.coords.latitude, longitude: position.coords.longitude})
    })
})