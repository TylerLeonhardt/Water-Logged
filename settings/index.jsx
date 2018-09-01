import secrets from "../secrets.json";

function mySettings(props) {
  if(!getUnits(props)) {
    props.settingsStorage.setItem('units', JSON.stringify({
        values:[{
          name:"fl oz"
        }]
      }))                          
  }
  
  return (
    <Page>
      <Section
        title={<Text bold align="center">Log in with your fitbit account</Text>}>
        <Oauth
          settingsKey="oauth"
          title="Login"
          label="Fitbit"
          status="Login"
          authorizeUrl="https://www.fitbit.com/oauth2/authorize"
          requestTokenUrl="https://api.fitbit.com/oauth2/token"
          clientId={secrets.settings.clientId}
          clientSecret={secrets.settings.clientSecret}
          scope="nutrition"
          onAccessToken={async (data) => {
            console.log(data);
          }}
          />
      </Section>
      <Text bold align="center">{isAuthed(props) ? "Authenticated!" : "Not authenticated yet."}</Text>
      <Section
        title={<Text bold align="center">Configuration</Text>}>
        <Select
          label={`Units`}
          settingsKey="units"
          options={[
            {name:"fl oz"},
            {name:"ml"}
          ]}
          onSelection={(choice) => {
            switch(choice.values[0].name) {
              case "fl oz":
                props.settingsStorage.setItem('glass', wrapValueForBottles(8));
                props.settingsStorage.setItem('oneBottle', wrapValueForBottles(16));
                props.settingsStorage.setItem('twoBottles', wrapValueForBottles(32));
                break;
              case "ml":
                props.settingsStorage.setItem('glass', wrapValueForBottles(250));
                props.settingsStorage.setItem('oneBottle', wrapValueForBottles(500));
                props.settingsStorage.setItem('twoBottles', wrapValueForBottles(750));
                break;
            }
          }}
        />
          <TextInput
            label={`Glass (in ${getUnits(props)})`}
            type="number"
            settingsKey="glass"
            placeholder={ props.settingsStorage.getItem('glass') ? JSON.parse(props.settingsStorage.getItem('glass')).name : 8 }
            ></TextInput>
          <TextInput
            label={`One Bottle (in ${getUnits(props)})`}
            type="number"
            settingsKey="oneBottle"
            placeholder={ props.settingsStorage.getItem('oneBottle') ? JSON.parse(props.settingsStorage.getItem('oneBottle')).name : 16 }
            ></TextInput>
          <TextInput
            label={`Two Bottles (in ${getUnits(props)})`}
            type="number"
            settingsKey="twoBottles"
            placeholder={ props.settingsStorage.getItem('twoBottles') ? JSON.parse(props.settingsStorage.getItem('twoBottles')).name : 32 }
            ></TextInput>
      </Section>
      <Section
        title={<Text bold align="center">About</Text>}>
        <Text>
          Water Logged will always be free and <Link source="https://github.com/tylerl0706/water-logged">open source</Link>.
        </Text>
        <Text>
          For support, Tweet at me! <Link source="https://twitter.com/TylerLeonhardt">@TylerLeonhardt</Link>
        </Text>
        <Text>
          If you like Water Logged, maybe consider buying me a coffee..err.. water bottle? :)
        </Text>
          <Link source="https://paypal.me/TylerLeonhardt"><TextImageRow
            label="Donate via PayPal 💧"
            icon="http://img.talkandroid.com/uploads/2016/02/paypal-app-logo.png"
          /></Link>
      </Section>
    </Page>
  );
}

function isAuthed(props) {
  let data;
  try {
    data = props.settingsStorage.getItem('oauth')
  } catch (e) {}
  
  return data
}

function getUnits(props) {
  let data;
  try {
    data = JSON.parse(props.settingsStorage.getItem('units')).values[0].name
  } catch (e) {}
  
  return data
}

function wrapValueForBottles(value) {
  return JSON.stringify({
    name:value
  })
}

registerSettingsPage(mySettings);