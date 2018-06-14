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

## Troubleshooting

If you're experiencing trouble using Water Logged, here are some common issues and how to fix them.

> NOTE: Screenshots are taken from an Android device. iOS might be slightly different.

### _I'm getting "Failed! Please restart app" on the watch!_

Unfortunately, when this happens, you're most likely experiencing a problem with Fitbit itself, and not Water Logged. Here are some steps that might fix the problem:

#### Manually sync your fitbit

Sometimes, a manual sync of your fitbit's step data can do the trick. To do this:

* Open the Fitbit app on your phone
* If your app doesn't start syncing immediately, you can pull the screen down to refresh or tap the watch icon and sync the watch this way:

<img src="https://user-images.githubusercontent.com/2644648/41394772-1a8c0022-6f60-11e8-84e7-a189707cfc1c.jpeg" alt="waterlogged" width="200px"/>

<img src="https://user-images.githubusercontent.com/2644648/41394774-1ac0b2cc-6f60-11e8-96a0-c9f21d6adbe1.jpeg" alt="waterlogged" width="200px"/>

* Once you're synced, try using Water Logged again from the watch

#### Re-login to Fitbit in the Water Logged settings

* Open the Fitbit app on your phone
* Go to your watch page:

<img src="https://user-images.githubusercontent.com/2644648/41394772-1a8c0022-6f60-11e8-84e7-a189707cfc1c.jpeg" alt="waterlogged" width="200px"/>

* Tap on Apps:

<img src="https://user-images.githubusercontent.com/2644648/41394775-1ad5aaba-6f60-11e8-89a5-4c53615caf58.jpeg" alt="waterlogged" width="200px"/>

* Find Water Logged on the list and tap the gear icon:

<img src="https://user-images.githubusercontent.com/2644648/41394777-1ae7c3bc-6f60-11e8-9ffa-a30625016a06.jpeg" alt="waterlogged" width="200px"/>

* Click on the Fitbit login button:

<img src="https://user-images.githubusercontent.com/2644648/41394778-1afb290c-6f60-11e8-8b78-6839efcb957b.jpeg" alt="waterlogged" width="200px"/>

* Then try and see if Water Logged works

#### Update your device

If those steps don't work, make sure the following items are up-to-date:

* The Fitbit app on the phone
* Your watch's operating system (the Fitbit app will tell you if you do!)
* Your phone's operating system (Android or iOS)

I had a report recently that an old version of iOS was causing issues with Fitbit watches so this step could be very important!

> If none of these fixed the problem, bug me on Twitter: [@TylerLeonhardt](https://twitter.com/TylerLeonhardt).

### _My data isn't showing up in the Fitbit Dashboard!_

Do you see this?

<img src="https://user-images.githubusercontent.com/2644648/41395391-6462f6a4-6f62-11e8-8c1c-27620665770d.jpeg" alt="waterlogged" width="200px"/>

Have no fear! If your data shows up in Water Logged on your watch, your data is safe. This is an issue with the Fitbit app, itself.

To fix this, simply kill the app and reopen it. If that doesn't work, restart your phone and that should fix the problem.

### I don't see my problem here!

Bug me about it on Twitter: [@TylerLeonhardt](https://twitter.com/TylerLeonhardt).

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
