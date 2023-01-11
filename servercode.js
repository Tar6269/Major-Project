const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 5000 });
let hostList = [];
let gamesList = new Map();
let clientIDMap = new Map();

function sendData(Type, data, websocket) {
  let newMessage = { messageType: Type, data: data };
  let newMessageString = JSON.stringify(newMessage);
  // let newMessage = "{testing testing 123}";
  websocket.send(newMessageString);

  console.log("message should be sent...");
}

function generateID(){
  return Date.now() * Math.random(100);
}
wss.on("connection", (ws) => {
  console.log("new client connected");
  let newID = generateID();
  
  ws.ID = newID;
  clientIDMap.set(newID, ws);
  
  // console.log(ws)
  ws.binaryType = "string";
  // console.log(sockets);
  ws.on("message", (msg) => {
    let messageJSON = JSON.parse(msg);
    let messageType = messageJSON.messageType;
    let messageData = messageJSON.data;
    if (messageType === "typeChangeHost") {
        hostList.push({name:messageData, websocket:ws.ID});
        sendData("text", "you are now hosting!", ws);
        
      
    }
     if (messageType === "request") {
       if(messageData === "hostList"){
         sendData("hostList",hostList, ws);       
       }
     }
    console.log("message:" + msg);

    if(messageType === "joinGame"){
      
        gamesList.set(messageData.name, {host:clientIDMap.get(messageData.websocket), client:ws});
        let testingVariable;
        console.log(gamesList.get(messageData.name).host);

        sendData("text", "a client has connected!", clientIDMap.get(messageData.websocket));
    }
    // sends message to all connected client
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
    clientIDMap.delete(ws.ID);
    // console.log(sockets);
  });
});
