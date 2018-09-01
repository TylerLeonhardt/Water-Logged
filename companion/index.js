/* eslint-disable */
import * as messaging from 'messaging';
import { settingsStorage } from 'settings';
/* eslint-enable */
import request from './request';
import utils from './utils';
import secrets from '../secrets.json';

let TOKEN;
let REFRESH;
let UNITS = 'fl oz';
let PRESETS = {
  glass: 8,
  oneBottle: 16,
  twoBottles: 32,
};

// Refreshes the auth and refresh tokens
async function refreshTokens() {
  for (let i = 0; i < 5; i++) {
    try {
      // eslint-disable-next-line
      const data = await request.post(`https://api.fitbit.com/oauth2/token?grant_type=refresh_token&refresh_token=${REFRESH}`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: secrets.companion.basicAuth,
        },
      });
      settingsStorage.setItem('oauth', JSON.stringify(data));
      break;
    } catch (e) {
      console.log(`[FETCH REFRESH TOKEN]: ${e.name}\n${e.message}\n${e.stack}`);
      utils.sleep(500);
    }
  }
}

// Fetch Sleep Data from Fitbit Web API
async function fetchWaterData() {
  const todayDate = utils.getTodayDate();
  const promises = [];

  // Get water goal
  promises.push(request.get('https://api.fitbit.com/1/user/-/foods/log/water/goal.json', {
    headers: { Authorization: `Bearer ${TOKEN}` },
  }));

  // Get water logs
  promises.push(request.get(`https://api.fitbit.com/1/user/-/foods/log/water/date/${todayDate}.json`, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
  }));

  await refreshTokens();
  const data = await Promise.all(promises);
  // Handle API errors
  if (data[0].errors && data[0].errors.length > 0) {
    throw data[0].errors[0].message;
  }

  // Send data to watch app
  for (let i = 0; i < 5; i++) {
    try {
      messaging.peerSocket.send({
        goal: data[0].goal.goal,
        summary: data[1].summary.water,
        units: UNITS,
      });
    } catch (e) {
      console.log(`[DATA TO WATCH]: Not connected to watch. ${e.name}\n${e.message}\n${e.stack}\n\nTrying again...`);
      // eslint-disable-next-line
      await utils.sleep(500);
    }
  }
}

// A user changes Settings
settingsStorage.onchange = async (evt) => {
  const data = JSON.parse(evt.newValue);
  switch (evt.key) {
    case 'oauth':
      TOKEN = data.access_token;
      REFRESH = data.refresh_token;
      await fetchWaterData();
      break;
    case 'units':
      UNITS = data.values[0].name;
      console.log(`[UNITS]: ${data.values[0].name}`);
      await fetchWaterData();
      break;
    case 'glass':
    case 'oneBottle':
    case 'twoBottles':
      PRESETS[evt.key] = parseInt(data.name, 10);
      console.log(`[${evt.key}]: ${JSON.stringify(data)}`);
      break;
    default:
      break;
  }
};

// Restore previously saved settings and send to the device
function restoreSettings() {
  let tokenData; let unitsData; let presetData;
  try {
    tokenData = JSON.parse(settingsStorage.getItem('oauth'));
    unitsData = JSON.parse(settingsStorage.getItem('units')).values[0].name;
    presetData = {
      glass: JSON.parse(settingsStorage.getItem('glass')).name,
      oneBottle: JSON.parse(settingsStorage.getItem('oneBottle')).name,
      twoBottles: JSON.parse(settingsStorage.getItem('twoBottles')).name,
    };
  } catch (e) {
    console.log('OAuth/units data not found.');
  }

  if (unitsData) {
    UNITS = unitsData;
  } else {
    console.log('No units data found. Defaulting to fl oz.');
  }

  if (tokenData) {
    TOKEN = tokenData.access_token;
    REFRESH = tokenData.refresh_token;
  } else {
    console.log('No auth data found.');
  }

  if (presetData) {
    PRESETS = presetData;
  } else {
    console.log('No units data found. Defaulting to fl oz.');
  }
}

// Message socket opens
messaging.peerSocket.onopen = async () => {
  restoreSettings();
  await fetchWaterData();
};

// When we receive a message from the watch
messaging.peerSocket.onmessage = async (evt) => {
  if (!TOKEN) restoreSettings();

  // If we have actual data (besides a string which means 'refresh') we need to process it
  if (typeof evt.data !== 'string') {
    // if we didn't get a raw value, grab the value of the preset
    const newWater = evt.data.newWater ? evt.data.newWater : PRESETS[evt.data.newWaterType];

    // Submit new water log
    const todayDate = utils.getTodayDate();
    await refreshTokens();
    const data = await request.post(`https://api.fitbit.com/1/user/-/foods/log/water.json?amount=${newWater}&date=${todayDate}&unit=${UNITS}`, {
      headers: {
        'Accept-Language': UNITS,
        Accept: 'application/json',
        Authorization: `Bearer ${TOKEN}`,
      },
    });
    if (data.errors && data.errors.length > 0) {
      throw data.errors[0].message;
    }
  }

  await fetchWaterData();
};
