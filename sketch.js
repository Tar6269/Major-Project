// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"
let buttonWidth;
let buttonHeight;
let hostButtonX;
let hostButtonY;
let joinButtonX;
let joinButtonY;
let hostOrClient
let displayTest = false;
let canvas;
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.center("horizontal");
  buttonWidth = windowWidth/3
  buttonHeight = windowHeight/5
  hostButtonX = windowWidth/2 - buttonWidth/2;
  hostButtonY = windowHeight/2;
  joinButtonX = windowWidth/2 + buttonWidth/2;
  joinButtonY = windowHeight/2;
}

function draw() {
  background(220);
  menuScreen();
  if(displayTest){

  }
}

function menuScreen(){

  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(windowWidth/10)
  rect(hostButtonX, hostButtonY, buttonWidth, buttonHeight);
  text("Host", hostButtonX, hostButtonY);

  rect(joinButtonX, joinButtonY, buttonWidth, buttonHeight);
  text("Join", joinButtonX, joinButtonY);

}


function mouseClicked(){
  if(mouseX > (hostButtonX - buttonWidth/2) && mouseX < (hostButtonX + buttonWidth/2) && mouseY > (hostButtonY - buttonHeight/2) && mouseY < (hostButtonY + buttonHeight/2)){
    hostServer();
  }
  if(mouseX > (joinButtonX - buttonWidth/2) && mouseX < (joinButtonX + buttonWidth/2) && mouseY > (joinButtonY - buttonHeight/2) && mouseY < (joinButtonY + buttonHeight/2)){
    connectToHost();
    print("test");

  }
}

function connectToHost(){
  // const ws = new WebSocket("ws:/tar6269.github.io/Major-Project/");
  const ws = new WebSocket("wss://momentous-honored-ragdoll.glitch.me/", {
    headers:{
      "user-agent": "Mozilla"
    }
  });

  ws.addEventListener("open", () =>{
  console.log("We are connected!")
});
}
