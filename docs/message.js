//インポートするための文
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, push, set, onChildAdded, remove, onChildRemoved, onValue , onChildChanged} from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js"; // 追加
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyALbxISZQW6hx97fFEOH7YkSPHZkHNwq6Y",
    authDomain: "test-6aa38.firebaseapp.com",
    databaseURL: "https://test-6aa38-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test-6aa38",
    storageBucket: "test-6aa38.firebasestorage.app",
    messagingSenderId: "327819738458",
    appId: "1:327819738458:web:c04cc599a731e1aa238763",
    measurementId: "G-QXNG59XZES"
};
          
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase(app);

//実際の処理を記述
//html要素を取得
const EnteruserName = document.querySelector('[id="userName"]');
const privateroomID = document.querySelector(`[id="roomID"]`)

//グローバル変数の宣言
let year,month,day,hours,minutes,seconds,userName,RoomID,Roomcount,Allcount;
let countjoin = 0;
let countpublic = 0;
let Roomactivecount = 0;
let Allactivecount = 0;
let ToroomID = "Public";
let Userroom;//IDを保存するルーム
let AllUserroom = ref(db, 'chatsite/AlluserID');
let ID = Math.random().toString(32).substring(2);//IDをランダムで生成(識別のため)
let RoomIdArray = [];//IDを格納する配列
let AllIdArray = [];//IDを格納する配列
let RoomActiveuser = document.getElementById('Roomactiveuser');
RoomActiveuser.textContent = "ルームのアクティブ..人";
let AllActiveuser = document.getElementById('Allactiveuser');
AllActiveuser.textContent = "サイトのアクティブ..人";
Public();

EnteruserName.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        StartClick();
    }
});

privateroomID.addEventListener('keydown', function(event) {
    if (event.key === "Enter") {
        join();
    }
});

// textarea 要素を取得
const MessageText = document.getElementById("MessageText");

// Enter キーが押されたときの処理
MessageText.addEventListener("keydown", function(event) {
    // Shift が押されていない Enter キーを押した場合、改行を防止
    if (event.key === "Enter" && !event.shiftKey) {
        sendMessage();
        event.preventDefault();  // Enter キーのデフォルト動作（改行）をキャンセル
    }
});

//時間を更新する関数
function updatatime(){
    const currentDate = new Date();
    year = currentDate.getFullYear();  //西暦
    month = currentDate.getMonth() + 1;  //月 
    day = currentDate.getDate();  //日
    hours = currentDate.getHours();  //時間
    minutes = currentDate.getMinutes();  //分
    seconds = currentDate.getSeconds();  //秒
}

//メッセージを送信するための関数
function sendMessage(){
    updatatime();
    const text = document.getElementById('MessageText').value;
    push(RoomID, {Name:userName, Type:"MSG", Text:text, Year:year, Month:month, Day:day, Hours:hours, Minutes:minutes, Seconds:seconds});
    document.getElementById('MessageText').value = '';
}

//スタートページのボタンが押されたら呼び出される関数
function StartClick(){
    userName = document.getElementById('userName').value;
    if(3 <= userName.length && userName.length <= 10 ){
        let StartPages = document.querySelectorAll('[name="startpage"]');

        // 取得した要素を非表示にする
        StartPages.forEach(function(StartPage) {
        StartPage.style.display = "none";
        TalkStart();
        });
    }
    else if(userName.length < 3){
        alert("ユーザネームが短すぎます。")
    }
    else if(userName.length > 10){
        alert("ユーザーネームが長すぎます。")
    }
}

//ユーザーネームが登録されトークが始まるときに呼び出される関数
function TalkStart(){
    document.getElementById("helloID").textContent = `ようこそ ${userName} さん`;
    // name属性が'talkpage'の要素をすべて取得
    let TalkPages = document.querySelectorAll('[name="talkpage"]');

    // 各要素のdisplayを'block'にして表示
    TalkPages.forEach(function(TalkPage) {
        TalkPage.style.display = 'block';
    });
}

//公開ルームに移動する関数
function Public(){
    countpublic++;
    let i = countpublic;
    RoomID = ref(db, 'chatsite/message/pablicroom');
    Userroom = ref(db, 'chatsite/userID/pablicroom');
    document.getElementById('roomID').value = '';
    document.getElementById("chat-box").textContent = ``;
    document.getElementById('roomDetail').innerHTML = `あなたは現在公開ルームに参加しています。`;
    CountStart();
    //MSG受信処理
    onChildAdded(RoomID, function (snapshot) {
    if(countpublic <= i){
    let data = snapshot.val();
    let chatbox = document.getElementById('chat-box');
    if (data.Name !== undefined && data.Text !== undefined && data.Type == "MSG"){
    let msg = `<${data.Name}> ${data.Text} ${data.Year}/${data.Month}/${data.Day}/${data.Hours}:${data.Minutes}:${data.Seconds}`;
    chatbox.appendChild(document.createTextNode(msg));
    chatbox.appendChild(document.createElement('br'));
    }
    }
    });
}

function join(){
    countjoin++;
    let i = countjoin;
    ToroomID = document.getElementById('roomID').value;
    console.log(ToroomID);
    if(1 <= ToroomID.length && ToroomID.length <= 10){
        RoomID = ref(db, 'chatsite/message/privateroom/' + ToroomID);
        Userroom = ref(db, 'chatsite/userID/privateroom/' + ToroomID);
        document.getElementById('roomID').value = '';
        document.getElementById("chat-box").textContent = ``;
        document.getElementById('roomDetail').innerHTML = `あなたは現在 ${ToroomID} ルームに参加しています。`;
        CountStart();
        //MSG受信処理
        onChildAdded(RoomID, function (snapshot) {
        if(countjoin <= i){
        let data = snapshot.val();
        let chatbox = document.getElementById('chat-box');
        if (data.Name !== undefined && data.Text !== undefined && data.Type == "MSG"){
        let msg = `<${data.Name}> ${data.Text} ${data.Year}/${data.Month}/${data.Day}/${data.Hours}:${data.Minutes}:${data.Seconds}`;
                chatbox.appendChild(document.createTextNode(msg));
                chatbox.appendChild(document.createElement('br'));
            }
            }
        });
    }
    else if(ToroomID.length < 1){
        alert("ルームIDが短すぎます。")
    }
    else if(ToroomID.length > 10){
        alert("ルームIDが長すぎます。")
    }
}

//IDの削除+追加+取得(参加している部屋)
setInterval(function() {
    const currentDate = new Date();
    const seconds = currentDate.getSeconds();
    
      if(Roomcount !== undefined){
        if(Roomcount !== seconds){
          Roomcount = seconds;
            if(seconds % 3 == 0){
              remove(Userroom);
              RoomIdArray=[];
            }
            else if(seconds % 3 == 1){
              push(Userroom, {ID:ID});
            }
            else if(seconds % 3 == 2){
              const Activeusercount = RoomIdArray.length;
                if (Activeusercount > 0){
                RoomActiveuser.textContent = `ルームアクティブ${Activeusercount}人`;
                }
                else{
                RoomActiveuser.textContent = "ルームアクティブ..人";  
                }
            }
        }
      }
      else{
        Roomcount = seconds;
      }

      if(Allcount !== undefined){
        if(Allcount !== seconds){
          Allcount = seconds;
            if(seconds % 3 == 0){
              remove(AllUserroom);
              AllIdArray=[];
            }
            else if(seconds % 3 == 1){
              push(AllUserroom, {ID:ID});
            }
            else if(seconds % 3 == 2){
              const Activeusercount = AllIdArray.length;
                if (Activeusercount > 0){
                AllActiveuser.textContent = `サイトアクティブ${Activeusercount}人`;
                }
                else{
                AllActiveuser.textContent = "サイトアクティブ..人";  
                }
            }
        }
      }
      else{
        Allcount = seconds;
      }    
  }, 1);
  
function CountStart(){
    Roomactivecount++;
    let i = Roomactivecount;
    Allactivecount++;
    let p = Roomactivecount;
    onChildAdded(Userroom, function (snapshot) {
        if(Roomactivecount <= i){
            let data = snapshot.val();
            RoomIdArray.push(data.ID);
        }
    });

    onChildAdded(AllUserroom, function (snapshot) {
        if(Allactivecount <= p){
            let data = snapshot.val();
            AllIdArray.push(data.ID);
        }
    });
}

document.getElementById("TalkingStart").addEventListener("click", StartClick);
document.getElementById("join").addEventListener("click", join);
