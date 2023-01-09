const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5000 });
let hostList = [];
let gamesList = new Map();
function sendData(Type, data, websocket) {
  let newMessage = { messageType: Type, data: data };
  let newMessageString = JSON.stringify(newMessage);
  // let newMessage = "{testing testing 123}";
  websocket.send(newMessageString);

  console.log("message should be sent...");
}

wss.on("connection", (ws) => {
  console.log("new client connected");
  // console.log(ws)
  ws.binaryType = "string";
  // console.log(sockets);
  ws.on("message", (msg) => {
    let messageJSON = JSON.parse(msg);
    let messageType = messageJSON.messageType;
    let messageData = messageJSON.data;
    if (messageType === "typeChangeHost") {
        hostList.push({name:messageData, websocket:ws});
        sendData("text", "you are now hosting!", ws);
        
      
    }
     if (messageType === "request") {
       if(messageData === "hostList"){
         sendData("hostList",hostList, ws);       
       }
     }
    console.log("message:" + msg);
    // console.log(msg.data);

    // sends message to all connected clients
    if(messageType === "joinGame"){
      ws.gameID = "real";
      console.log(ws.newProperty);
    }
    wss.clients.forEach(function (client) {
      client.send(String(msg));
    });
  });
  ws.on("close", () => {
    console.log("client has disconnected");
    for(let i = hostList.length-1; i > -1 ; i--){
      if(hostList[i].websocket === ws){
        hostList.splice(i, 1);
      }
    }
    // console.log(sockets);
  });
});
