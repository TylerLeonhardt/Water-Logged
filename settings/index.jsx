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

registerSettingsPage(mySettings);