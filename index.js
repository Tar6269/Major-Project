const WebSocket = require("ws");

const wss = new WebSocket.Server({ port:5000 });

wss.on("connection", ws => {
    console.log("new client connected");

    // console.log(sockets);
  ws.on("message", function(msg){
    
    console.log("message:" + msg);

    // sends message to all connected clients
    wss.clients.forEach(function(client){
      client.send(String(msg));
    })

  });
    ws.on("close", () => {
       console.log("client has disconnected"); 
      // console.log(sockets);
    });
})
