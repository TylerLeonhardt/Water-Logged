import secrets from "../secrets.json";

function mySettings(props) {
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
      <Select
        label={`Units`}
        settingsKey="units"
        options={[
          {name:"fl oz"},
          {name:"ml"}
        ]}
      />
      <Text bold align="center">{getUnits(props) === "ml" ? "Increments: +/-100 ml, Quick add buttons: 250, 500, 750 ml" : "Increments: +/-1 fl oz, Quick add buttons: 8, 16, 32 fl oz"}</Text>
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

registerSettingsPage(mySettings);