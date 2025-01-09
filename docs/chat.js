// WebSocket接続を作成
const ws = new WebSocket("wss://cloud.achex.ca/chsite");

let clientNumber = null;  // 接続中のクライアント番号

// メッセージ送信
function sendChat() {
  let msgElem = document.getElementById("msg");
  let msg = msgElem.value;
  let name = document.getElementById("name").value;
  msgElem.value = "";
  msg = "<" + name + ">" + msg; 
  ws.send(JSON.stringify({"to": "mine","message": msg}));	
}

// サーバー起動時
ws.onopen = e => {
  ws.send(JSON.stringify({"auth": "mine", "password": "0205"}));
  console.log("起動");
  ws.send(JSON.stringify({"to": "mine", "message": "アカウントがログイン中..."}));
}

// サーバーからのメッセージ受信
ws.onmessage = e => {
  var obj = JSON.parse(e.data);
  var Msg = obj.message;
  
  // サーバーからクライアント番号を受け取った場合
  if (obj.clientNumber) {
    clientNumber = obj.clientNumber;  // クライアント番号を保存
    console.log(`このクライアントの番号は: ${clientNumber}`);
  }

  // メッセージが受信できたら表示
  console.log(Msg);
  var MSG = document.getElementById('MSG');
  if (Msg !== undefined) {
    MSG.appendChild(document.createTextNode(Msg));
    MSG.appendChild(document.createElement('br'));
  }
}

// 切断時
ws.onclose = e => {
  console.log('WebSocket connection closed');
  // クライアント番号が存在していれば、切断時にその番号を表示
  if (clientNumber !== null) {
    console.log(`クライアント番号 ${clientNumber} が切断されました`);
  }
}
