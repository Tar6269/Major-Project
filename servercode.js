const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 5000 });
let hostList = [];
let gamesList = new Map();
// stores references to each websocket client connected as data, access key to the data is the websocket's ID
let clientIDMap = new Map();

function sendData(Type, data, websocket) {
  // functions the same way as client sendData function. see description there
  let newMessage = { messageType: Type, data: data };
  let newMessageString = JSON.stringify(newMessage);

  websocket.send(newMessageString);

  console.log("message should be sent...");
}

function generateID() {
  // generates an ID almost guaranteed to be unique. the most lightweight solution I managed to come up with
  return Date.now() * Math.random(100);
}
// logic for receiving messages from clients
wss.on("connection", (ws) => {
  console.log("new client connected");
  // 
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
    // assigns the client as a host
    if (messageType === "typeChangeHost") {
      hostList.push({ name: messageData, websocket: ws.ID });
      sendData("text", "you are now hosting!", ws);
    }
    // sends a client back the list of hosts if requested
    if (messageType === "request") {
      if (messageData === "hostList") {
        sendData("hostList", hostList, ws);
      }
    }
// puts both player requesting to join a game, and the host of the game, into a match
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
      sendData("text","a client has connected!", clientIDMap.get(messageData.websocket));

      sendData("gameOn",{ shipLocation: 200, enemyShipLocation: 2800, host:true},
        clientIDMap.get(messageData.websocket)
      );

      sendData("gameOn", { shipLocation: 200, enemyShipLocation: 2800, host:false}, ws);
    }
    // tells the client's opponent that they have fired
    if (messageType === "cannonFired") {
      sendData("fireCannon", messageData, ws.partner);
    }

    // sends message to all connected client
    wss.clients.forEach(function (client) {
      client.send(String(msg));
    });
  });
  ws.on("close", () => {
    // logic for when websocket disconnects from server
    console.log("client has disconnected");
    if(ws.partner !== undefined){
    sendData("partnerDisconnect", "", ws.partner);
    // disassociates client from it's opponent
    ws.partner.partner = undefined;
    }
// removes client from hostlist
    for (let i = hostList.length - 1; i > -1; i--) {
      if (hostList[i].websocket === ws.ID) {
        hostList.splice(i, 1);
        console.log("server removed from list")
      }
    }
    // removes client from the client ID storage
    clientIDMap.delete(ws.ID);
    // console.log(sockets);
  });
});
