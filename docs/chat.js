ws = new WebSocket("wss://cloud.achex.ca/chsite");

//メッセージ送信
function sendChat(){
  let msgElem = document.getElementById("msg");
  let msg = msgElem.value;
  msgElem.value = "";
  ws.send(JSON.stringify({"to": "mine","message": msg}));	
}

//サーバー起動時
ws.onopen = e => {
	ws.send(JSON.stringify({"auth": "mine", "password": "0205"}));
	ws.send(JSON.stringify({"to": "mine", "message": "Login"}));
	console.log("起動完了");
}

//切断時
ws.onclosed = e => {
console.log('closed');
}

//メッセージ受信
ws.onmessage = e => {
  var obj = JSON.parse(e.data);
  Msg = obj.message;
  console.log(Message);
}
