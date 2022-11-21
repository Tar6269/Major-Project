// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let hostOrClient
let displayTest = false;
function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  menuScreen();
  if(displayTest){
    text("it worked", width/2, height/2);
  }
}

function menuScreen(){
  let buttonWidth = windowWidth/3
  let buttonHeight = windowHeight/5
  let hostButtonX = windowWidth/2 - buttonWidth/2;
  let hostbuttonY = windowHeight/2;
  let joinButtonX = windowWidth/2 + buttonWidth/2;
  let joinButtonY = windowHeight/2;
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(windowWidth/10)
  rect(hostButtonX, hostbuttonY, buttonWidth, buttonHeight);
  text("Host", hostButtonX, hostbuttonY);

  rect(joinButtonX, joinButtonY, buttonWidth, buttonHeight);
  text("Join", joinButtonX, joinButtonY);

}


function mouseClicked(){
  if(mouseX > hostButtonX && mouseX < (hostbuttonX + buttonWidth) && mouseY > hostButtonY && mouseY < (hostButtonY + buttonHeight)){
    displayTest = true;
  }
}