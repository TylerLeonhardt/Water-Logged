//imports
import document from "document";
import * as fs from "fs";
import * as messaging from "messaging";
import { units } from "user-settings";
import * as util from "./util.js";

// commonly used elements
let waterValue = document.getElementById("waterValue");
let rect = document.getElementById("levelRect");
let startup = document.getElementById("startup");
let newWater = document.getElementById("newWater");
let units = document.getElementById("units");
let refreshingText = document.getElementById("refreshing");
let levelAnimation = document.getElementById("levelAnimate");
let gradientRect = document.getElementById("gradient");

// Buttons
let save = document.getElementById("save");
let plusOne = document.getElementById("plusOne");
let minusOne = document.getElementById("minusOne");
let plusGlass = document.getElementById("plusGlass");
let plusSmallBottle = document.getElementById("plusSmallBottle");
let plusBigBottle = document.getElementById("plusBigBottle");

// The save button should be hidden by default
save.style.display = "none";
minusOne.style.display = "none";


// Used to count the new water being added
let newWaterCount = 0;

// Assign units
units.text = units.volume === "metric" ? "ml" : "fl oz";

// grab goal and summary from cached file
let goal, summary, fileValue;
try {
  fileValue = fs.readFileSync("waterValue.txt", "ascii");
}catch (e) {
  console.log(e);
}
if(fileValue) {
  waterValue.text = fileValue;
  [summary, goal] = waterValue.text.split("/");
  updateWaterLevel();
  startup.style.display = "none";
} else {
  setRefreshText("Open settings to login with fitbit")
}

// Message is received from companion
messaging.peerSocket.onmessage = evt => {
  let from = Math.round((1 - (summary/goal))*250);
  goal = util.convertToUnit(parseInt(evt.data.goal), units.volume);
  summary = util.convertToUnit(parseInt(evt.data.summary), units.volume);
  
  waterValue.text = `${summary}/${goal}`;
  fs.writeFileSync("waterValue.txt", waterValue.text, "ascii");

  updateWaterLevel();
  // doAnimation(from, Math.round((1 - (summary/goal))*250))
  clearRequest();
};


// Touch Handlers
waterValue.onclick = function(e) {
  doRequest("refresh");
}
rect.onclick = function(e) {
  doRequest("refresh");
}

plusOne.onactivate = function(evt) {
  newWaterCount++;
  newWater.text = `+${newWaterCount}`
  save.style.display = "inline";
  plusGlass.style.display = "none";
  plusSmallBottle.style.display = "none";
  plusBigBottle.style.display = "none";
  minusOne.style.display = "inline";
}

minusOne.onactivate = function(evt) {
  newWaterCount--;
  if (newWaterCount > 0) {
    newWater.text = `+${newWaterCount}` 
  } else {
    clearRequest();
  }
}

save.onactivate = function(evt) {
  if(newWaterCount <= 0) return; // do nothing
  let saveData = {
    newWater: newWaterCount
  }
  doRequest(saveData);
}

plusGlass.onactivate = function(evt) {
  let saveData = {
    newWater: 8
  }
  doRequest(saveData);
}

plusSmallBottle.onactivate = function(evt) {
  let saveData = {
    newWater: 16
  }
  doRequest(saveData);
}

plusBigBottle.onactivate = function(evt) {
  let saveData = {
    newWater: 32
  }
  doRequest(saveData);
}

messaging.peerSocket.onopen = () => {
  console.log("Opened socket.");
  doRequest("refresh");
};

// Request/UI helpers
function doRequest(data) {
  refreshingText.text = "refreshing...";
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
    setTimeout(function () {
      if (refreshingText.text === "refreshing...") {
        console.log("Failed to send message to companion.");
        setRefreshText("Failed. Please restart app.");
      }
    }, 5000)
  } else {
    setRefreshText("Failed. Please restart app.");
    console.log("Failed to send message to companion.");
  }
}

function clearRequest() {
  refreshingText.text = "";
  newWaterCount = 0;
  newWater.text = "";
  save.style.display = "none";
  startup.style.display = "none";
  plusGlass.style.display = "inline";
  plusSmallBottle.style.display = "inline";
  plusBigBottle.style.display = "inline";
  minusOne.style.display = "none";
}

function setRefreshText(str) {
  refreshingText.text = str;
}


function updateWaterLevel() {
  let rectHeight = Math.round((1 - (summary/goal))*250);
  rect.height = rectHeight < 0 ? 0 : rectHeight;
  
  if(summary/goal >= 1) {
    gradientRect.gradient.colors.c1 = "#a8e063"
    gradientRect.gradient.colors.c2 = "#56ab2f"
  } else {
    gradientRect.gradient.colors.c1 = "#baeaff"
    gradientRect.gradient.colors.c2 = "#3dc4ff"
  }
}