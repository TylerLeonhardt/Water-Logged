// imports

import * as fs from 'fs';
/* eslint-disable */
import document from 'document';
import * as messaging from 'messaging';
import { me as device } from 'device';
/* eslint-enable */
import util from './util';

if (!device.screen) device.screen = { width: 348, height: 250 };

// commonly used elements
const waterValue = document.getElementById('waterValue');
const rect = document.getElementById('levelRect');
const startup = document.getElementById('startup');
const newWater = document.getElementById('newWater');
const unitsText = document.getElementById('units');
const refreshingText = document.getElementById('refreshing');
const gradientRect = document.getElementById('gradient');

// Buttons
const save = document.getElementById('save');
const plusOne = document.getElementById('plusOne');
const minusOne = document.getElementById('minusOne');
const plusGlass = document.getElementById('plusGlass');
const plusSmallBottle = document.getElementById('plusSmallBottle');
const plusBigBottle = document.getElementById('plusBigBottle');

// The save button should be hidden by default
save.style.display = 'none';
minusOne.style.display = 'none';

// Used to count the new water being added
let newWaterCount = 0;

// Assign units
let units = 'fl oz';
unitsText.text = units;

let goal; let summary; let fileValue;

function setRefreshText(str) {
  refreshingText.text = str;
}

// Request/UI helpers
function doRequest(data) {
  setRefreshText('refreshing...');
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
    setTimeout(() => {
      if (refreshingText.text === 'refreshing...') {
        console.log('Failed to send message to companion.');
        setRefreshText('Failed. Please restart app.');
      }
    }, 5000);
  } else {
    setRefreshText('Failed. Please restart app.');
    console.log('Failed to send message to companion.');
  }
}

function clearRequest() {
  refreshingText.text = '';
  newWaterCount = 0;
  newWater.text = '';
  save.style.display = 'none';
  startup.style.display = 'none';
  plusGlass.style.display = 'inline';
  plusSmallBottle.style.display = 'inline';
  plusBigBottle.style.display = 'inline';
  minusOne.style.display = 'none';
}

function updateWaterLevel() {
  const rectHeight = Math.round((1 - (summary / goal)) * device.screen.height);
  rect.height = rectHeight < 0 ? 0 : rectHeight;

  if (summary / goal >= 1) {
    gradientRect.gradient.colors.c1 = '#a8e063';
    gradientRect.gradient.colors.c2 = '#56ab2f';
  } else {
    gradientRect.gradient.colors.c1 = '#baeaff';
    gradientRect.gradient.colors.c2 = '#3dc4ff';
  }
}

// grab goal and summary from cached file
try {
  fileValue = fs.readFileSync('waterValue.txt', 'ascii');
} catch (e) {
  console.log(e);
}
if (fileValue) {
  waterValue.text = fileValue;
  let tempUnits;
  [summary, goal, tempUnits] = waterValue.text.split('/');
  if (tempUnits) {
    units = tempUnits;
    unitsText.text = units;
  }
  updateWaterLevel();
  startup.style.display = 'none';
} else {
  setRefreshText('Open settings to login with fitbit');
}

// Message is received from companion
messaging.peerSocket.onmessage = (evt) => {
  if (evt.data.units) {
    ({ units } = evt.data);
    unitsText.text = units;
  }
  goal = util.convertToUnit(parseInt(evt.data.goal, 10), units);
  summary = util.convertToUnit(parseInt(evt.data.summary, 10), units);

  waterValue.text = `${summary}/${goal}`;
  fs.writeFileSync('waterValue.txt', waterValue.text, 'ascii');

  updateWaterLevel();
  clearRequest();
};

plusOne.onactivate = () => {
  newWaterCount += (units === 'fl oz' ? 1 : 100);
  newWater.text = `+${newWaterCount}`;
  save.style.display = 'inline';
  plusGlass.style.display = 'none';
  plusSmallBottle.style.display = 'none';
  plusBigBottle.style.display = 'none';
  minusOne.style.display = 'inline';
};

minusOne.onactivate = () => {
  newWaterCount -= (units === 'fl oz' ? 1 : 100);
  if (newWaterCount > 0) {
    newWater.text = `+${newWaterCount}`;
  } else {
    clearRequest();
  }
};

// Events
save.onactivate = () => {
  if (newWaterCount <= 0) return; // do nothing
  const saveData = {
    newWater: newWaterCount,
  };
  doRequest(saveData);
};

plusGlass.onactivate = () => {
  const saveData = {
    newWaterType: 'glass',
  };
  doRequest(saveData);
};

plusSmallBottle.onactivate = () => {
  const saveData = {
    newWaterType: 'oneBottle',
  };
  doRequest(saveData);
};

plusBigBottle.onactivate = () => {
  const saveData = {
    newWaterType: 'twoBottles',
  };
  doRequest(saveData);
};

messaging.peerSocket.onopen = () => {
  console.log('Opened socket.');
  doRequest('refresh');
};

// Touch Handlers
waterValue.onclick = () => {
  doRequest('refresh');
};
rect.onclick = () => {
  doRequest('refresh');
};
