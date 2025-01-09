ws = new WebSocket("wss://cloud.achex.ca/kaburanaiyouni");

function sendChat(){
  let msgElem = document.getElementById("msg");
  let msg = msgElem.value;

	
}


ws.onmessage = e => {
	var obj = JSON.parse(e.data);
	if (obj.message == sendMsg) {
		activeUserCount++;
		document.getElementById("activeUsers").innerText = activeUserCount;
	} else if (obj.message != undefined && gotMsg.filter(msg => msg = obj.message).length == 0) {
		gotMsg.push(obj.message);
		ws.send(JSON.stringify({"to": "hogehoge", "message": obj.message}));
	}
}

ws.onopen = e => {
	ws.send(JSON.stringify({"auth": "hogehoge", "password": "1234"}));
	ws.send(JSON.stringify({"to": "hogehoge", "message": sendMsg}));
}

ws.onclosed = e => {
console.log('closed');
}
