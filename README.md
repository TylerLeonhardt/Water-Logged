# Water Logged

Logging water has never been this easy - Log water to your fitbit account at your wrist on your Fitbit Ionic!

Water Logged allows you to log your water consumption throughout the day. It also shows you your daily water goal along with how much you've had to drink so you can meet your goal and stay healthy.

Use the quick-log buttons to log a glass, water bottle, or two water bottles worth of water in one click - or specify an exact water value if you're counting carefully.

All the data is synced to fitbit so you can easily access it on all your devices.

## Building from source

To build from source you must upload all the files to [Fitbit Studio](https://studio.fitbit.com).

You'll also need to create a `secrets.json` file an fill it with your keys. The skeleton looks like this:

```json
{
  "settings":{
    "clientId":"<your value>",
    "clientSecret":"<your value>"
  },
  "companion":{
    "basicAuth":"Basic <your value>"
  }
}
```

The `clientId` and `clientSecret` you get from fitbit by [creating an app here](https://dev.fitbit.com/apps/new/).

`basicAuth` is the base64 encoded string of: `clientId:clientSecret`. Don't forget the colon in the middle!