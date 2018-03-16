import * as messaging from "messaging";
import secrets from "../secrets.json";
import { settingsStorage } from "settings";

let TOKEN, REFRESH;

let UNITS = "fl oz";

// Fetch Sleep Data from Fitbit Web API
function fetchWaterData() {
  
  let todayDate = getTodayDate();
  let promises = [];
  
  // Get water goal
  promises.push(fetch("https://api.fitbit.com/1/user/-/foods/log/water/goal.json", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${TOKEN}`
    }
  }))
  
  // Get water logs
  promises.push(fetch(`https://api.fitbit.com/1/user/-/foods/log/water/date/${todayDate}.json`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${TOKEN}`
    }
  }))
  
  refreshTokens()
  .then(() => { 
    return Promise.all(promises);
  })
  .then(function(res) {
    return Promise.all([res[0].json(), res[1].json()])
  })
  .then(function(data) {
    // Handle API errors
    if(data[0].errors && data[0].errors.length > 0) {
      throw data[0].errors[0].message;
    }
    
    // Send data to watch app
    let message = {
      goal: data[0].goal.goal,
      summary: data[1].summary.water,
      units: UNITS
    }
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      messaging.peerSocket.send(message);
    }
  })
  .catch(err => {
    console.log(`[FETCH NEW DATA]: ${err}`);
    refreshTokens()
      .then(() => { fetchWaterData(); })
      .catch((e) => { console.log(`[FETCH REFRESH TOKEN]: ${e}`); });
  });
}

// A user changes Settings
settingsStorage.onchange = evt => {
  if (evt.key === "oauth") {
    // Settings page sent us an oAuth token or we refreshed the token
    let data = JSON.parse(evt.newValue);
    TOKEN = data.access_token;
    REFRESH = data.refresh_token;
    fetchWaterData();
  } else if (evt.key === "units") {
    let data = JSON.parse(evt.newValue);
    UNITS = data.values[0].name
    fetchWaterData();
    console.log(`[UNITS]: ${data.values[0].name}`);
  }
};

// Restore previously saved settings and send to the device
function restoreSettings() {
  let tokenData, unitsData;
  try {
    tokenData = JSON.parse(settingsStorage.getItem("oauth"));
    unitsData = JSON.parse(settingsStorage.getItem("units")).values[0].name;
  } catch (e) {
    console.log("OAuth/units data not found.");
  }
  
  if (unitsData) {
    UNITS = unitsData;
  } else {
    console.log("No units data found. Defaulting to fl oz.");
  }
  
  if (tokenData) {
    TOKEN = tokenData.access_token;
    REFRESH = tokenData.refresh_token;
    fetchWaterData();
  } else {
    console.log("No auth data found.");
  }
}

// Message socket opens
messaging.peerSocket.onopen = () => {
  restoreSettings();
};

messaging.peerSocket.onmessage = evt => {
  if(!TOKEN) restoreSettings();
  
  // The message for when someone taps the screen to refresh.
  if(typeof evt.data == "string") {
    restoreSettings();
    return;
  }
  
  // Submit new water log
  let todayDate = getTodayDate();
  
  refreshTokens()
  .then(() => { 
    return fetch(`https://api.fitbit.com/1/user/-/foods/log/water.json?amount=${evt.data.newWater}&date=${todayDate}&unit=${UNITS}`, {
      method: "POST",
      headers: {
        'Accept-Language': UNITS,
        "Accept": "application/json",
        "Authorization": `Bearer ${TOKEN}`
      }
    });
  }).then(function (res) {
    return res.json()
  }).then(function (data) {
    // Handle API errors
    if(data.errors && data.errors.length > 0) {
      throw data.errors[0].message;
    }
    restoreSettings();
  }).catch(err => {
    console.log('[FETCH POST NEW LOG]: ' + err);
    refreshTokens()
      .then(() => { messaging.peerSocket.onmessage(evt) })
      .catch((e) => { console.log(`[FETCH REFRESH TOKEN]: ${e}`); });
  });
};

// Refreshes the auth and refresh tokens
function refreshTokens() {
  return fetch(`https://api.fitbit.com/oauth2/token?grant_type=refresh_token&refresh_token=${REFRESH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": secrets.companion.basicAuth
    }
  }).then(function(res) {
    return res.json();
  }).then(function(data) {
    settingsStorage.setItem("oauth", JSON.stringify(data));
    return Promise.resolve(true);
  })
}

// Helper functions
function getTodayDate() {
  let date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}