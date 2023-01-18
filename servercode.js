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

function generateID() {
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
      hostList.push({ name: messageData, websocket: ws.ID });
      sendData("text", "you are now hosting!", ws);
    }
    if (messageType === "request") {
      if (messageData === "hostList") {
        sendData("hostList", hostList, ws);
      }
    }
    console.log("message:" + msg);

    if (messageType === "joinGame") {
      gamesList.set(messageData.name, {
        host: clientIDMap.get(messageData.websocket),
        client: ws,
      });
      ws.partner = gamesList.get(messageData.name).host;
      gamesList.get(messageData.name).host.partner = ws;
      // console.log(gamesList.get(messageData.name).host);

      for (let i = hostList.length - 1; i > -1; i--) {
        console.log(messageData.websocket);
        console.log(hostList[i].websocket);
        if (hostList[i].websocket === messageData.websocket) {
          hostList.splice(i, 1);
        }
      }
      sendData(
        "text",
        "a client has connected!",
        clientIDMap.get(messageData.websocket)
      );
      sendData(
        "gameOn",
        { shipLocation: 200, enemyShipLocation: 2800, host:true},
        clientIDMap.get(messageData.websocket)
      );
      sendData("gameOn", { shipLocation: 200, enemyShipLocation: 2800, host:false}, ws);
    }
    if (messageType === "cannonFired") {
      sendData("fireCannon", messageData, ws.partner);
    }

    // sends message to all connected client
    wss.clients.forEach(function (client) {
      client.send(String(msg));
    });
  });
  ws.on("close", () => {
    console.log("client has disconnected");
    if(ws.partner !== undefined){
    sendData("partnerDisconnect", "", ws.partner);
    ws.partner.partner = undefined;
    }

    for (let i = hostList.length - 1; i > -1; i--) {
      if (hostList[i].websocket === ws.ID) {
        hostList.splice(i, 1);
        console.log("server removed from list")
      }
    }
    clientIDMap.delete(ws.ID);
    // console.log(sockets);
  });
});
