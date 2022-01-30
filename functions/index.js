const functions = require('firebase-functions');
const { initializeApp } = require ('@firebase/app');
const { getStorage, ref, uploadString } = require('@firebase/storage');
const {conversation} = require('@assistant/conversation');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNQrLzFJ-HqR61MNUD5eC0ZJWSc9clZY4",
    authDomain: "fyp-actionsconsole.firebaseapp.com",
    projectId: "fyp-actionsconsole",
    storageBucket: "fyp-actionsconsole.appspot.com",
    messagingSenderId: "664121014324",
    appId: "1:664121014324:web:a7271150439fc0b90ff261"
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

const app = conversation({
  // REPLACE THE PLACEHOLDER WITH THE CLIENT_ID OF YOUR ACTIONS PROJECT
  clientId: "664121014324-k6i8kctuj0qrgkr79d0na1t0klbj6ltm.apps.googleusercontent.com",
  debug: true
});

// Invoked on successful completion of account linking flow, check if we need to
// create a Firebase user.
app.handle('linkAccount', async conv => {
  let payload = conv.headers.authorization;
  if (payload) {
  // Get UID for Firebase auth user using the email of the user
    const email = payload.email;
    if (!conv.user.params.uid && email) {
      try {
        conv.user.params.uid = (await auth.getUserByEmail(email)).uid;
      } catch (e) {
        if (e.code !== 'auth/user-not-found') {
          throw e;
        }
        // If the user is not found, create a new Firebase auth user
        // using the email obtained from Google Assistant
        conv.user.params.uid = (await auth.createUser({email})).uid;
      }
    }
  }
});

app.handle('saveMood', (conv) => {
    conv.overwrite = false;
    let email = conv.user.params.tokenPayload.email;
    let date = conv.user.lastSeenTime;
    let mood = conv.session.params.chosenMood;

    let filePath = email + "/" + date + "/" + mood;
    const storageRef = ref(storage, filePath);
    uploadString(storageRef, mood);
    
    conv.add('Okay, your mood has been logged as ' + mood);
});

app.handle('saveJournalAndClassifyContent', (conv) => {
    conv.overwrite = false;
    let email = conv.user.params.tokenPayload.email;
    let date = conv.user.lastSeenTime;
    let journalEntry = conv.session.params.input;
    let mood = conv.session.params.chosenMood;


    let filePath = email + "/" + date + "/" + mood;
    const storageRef = ref(storage, filePath);
    uploadString(storageRef, journalEntry);
    
    conv.add('Okay, your journal entry has been recorded ');

});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
