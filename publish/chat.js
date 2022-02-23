let eventSource;

function getSendMsgBox(msg, time){
    return `<div class="sent_msg">
      <p>${msg}</p>
      <span class="time_date"> ${time} </span>
    </div>`;
}

function getReceiveMsgBox(msg, time){
    return `<div class="received_msg">
    <div class="received_withd_msg">
      <p>${msg}</p>
      <span class="time_date"> ${time} </span>
    </div>
    </div>`;
}

function initMessage(data){
    let chatBox = document.querySelector("#chat-box");
    let sender = document.querySelector("#sender");

    let message = document.createElement("div");
    console.log(data);
    if(data.sender === sender.value){
        message.className = "outgoing_msg";
        message.innerHTML = getSendMsgBox(data.msg, data.createdAt);
    }else{
        message.className = "incoming_msg";
        message.innerHTML = getReceiveMsgBox(data.msg, data.createdAt);
    }

    chatBox.append(message);

    // 스크롤 마지막으로 자동 이동
    chatBox.scrollTop = chatBox.scrollHeight;
}


async function addMessage(){
    let msgInput = document.querySelector("#chat-outgoing-msg")
    let sender = document.querySelector("#sender");
    let receiver = document.querySelector("#receiver");

    if(msgInput.value === ""){
        return;
    }
    console.log(sender.value);
    let chat = {
        sender: sender.value,
        receiver: receiver.value,
        msg: msgInput.value
    };

    await fetch("http://localhost:8080/chat", {
        method: "post",
        body: JSON.stringify(chat),
        headers: {
            "Content-Type":"application/json;charset=utf-8"
        }
    });

    msgInput.value = "";

}

document.querySelector("#chat-send").addEventListener("click", () => {
    addMessage();
});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown", (e) => {
    if(e.keyCode === 13){
        addMessage();
    }
});

document.querySelector("#start").addEventListener("click", function() {
    let chatBox = document.querySelector("#chat-box");
    let sender = document.querySelector("#sender");
    let receiver = document.querySelector("#receiver");

    if(sender.value === ""){
        alert("발신자를 지정하세요.");
        sender.focus();

        return false;
    }
    if(receiver.value === ""){
        alert("수신자를 지정하세요.");
        receiver.focus();
        
        return false;
    }

    chatBox.innerHTML= "";

    eventSource = new EventSource("http://localhost:8080/sender/"+sender.value+"/receiver/"+receiver.value);
    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);

        initMessage(data);
    };

});