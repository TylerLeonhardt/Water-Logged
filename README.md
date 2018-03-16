# Water Logged

#### Winner of [Fitbit's #Made4Fitbit App Challenge](https://dev.fitbit.com/app-champ-2017/) - [1st Place in the Health and Wellness category](https://dev.fitbit.com/blog/2018-01-24-app-challenge-winners/)! 🥇🏆

Logging water has never been this easy - Log water to your Fitbit account at your wrist on your Fitbit Ionic or Versa!

Water Logged allows you to log your water consumption throughout the day. It also shows you your daily water goal along with how much you've had to drink so you can meet your goal and stay healthy.

Use the quick-log buttons to log a glass, water bottle, or two water bottles worth of water in one click - or specify an exact water value if you're counting carefully. You can specify your units in the settings page.

All the data is synced to Fitbit so you can easily access it on all your devices.

## Screenshots

#### Default view

![Default view](https://user-images.githubusercontent.com/2644648/35448636-afb11196-026f-11e8-8600-2dbd17ae1969.png)

#### Adding manually

![Adding manually](https://user-images.githubusercontent.com/2644648/35448646-b53be0d2-026f-11e8-8e34-a8cb7dfe89ff.png)

#### Background grows with progress

![Background grows with progress](https://user-images.githubusercontent.com/2644648/35448640-b2572250-026f-11e8-883b-a133c09605f4.png)

#### Goal complete!

![Goal complete!](https://user-images.githubusercontent.com/2644648/35448642-b3b35e48-026f-11e8-8dc7-0f2e6477d2a6.png)

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
