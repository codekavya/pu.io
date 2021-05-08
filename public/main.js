var form = document.getElementById("form");
var input = document.getElementById("input");

//Socket logic
var socket = io();
document.querySelector(".send").addEventListener("click", (e) => {
    if (input.value) {
        e.preventDefault();
        socket.emit("message", input.value);
        input.value = "";
    }
});


socket.on("messageObj", function(msgObj) {
    const message = {
        message: msgObj.message,
        messageBy: msgObj.messageBy.Name,
        sendAt: msgObj.messageSentAt,
    };
    var item = document.createElement("li");
    item.textContent = `${msgObj.messageBy}: ${msgObj.message}`;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

//Query extractor
const roomid = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});


socket.on('userDetails', (obj) => {
    console.log(obj)
})
socket.on("database-messages", (msg) => {
    for (let index = 0; index < msg.length; index++) {
        let messageFromServer;
        const element = msg[index];
        messageFromServer = element.message;

        var item = document.createElement("li");
        item.textContent = `${element.messageBy.Name}: ${messageFromServer}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    }
});

socket.emit("room", roomid.id);