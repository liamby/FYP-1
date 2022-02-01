const functions = require('firebase-functions');
const { initializeApp } = require ('@firebase/app');
const { getStorage, ref, uploadString } = require('@firebase/storage');
const {conversation} = require('@assistant/conversation');
const language = require('@google-cloud/language');

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDNQrLzFJ-HqR61MNUD5eC0ZJWSc9clZY4",
    authDomain: "fyp-actionsconsole.firebaseapp.com",
    projectId: "fyp-actionsconsole",
    storageBucket: "fyp-actionsconsole.appspot.com",
    messagingSenderId: "664121014324",
    appId: "1:664121014324:web:a7271150439fc0b90ff261"
};

const client = new language.LanguageServiceClient();
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
    let date = conv.user.lastSeenTime.substr(0, 10);
    let mood = conv.session.params.chosenMood;

    let filePath = email + "/" + date + "/mood";
    const storageRef = ref(storage, filePath);
    uploadString(storageRef, mood);
    
    conv.add('Okay, your mood has been logged as ' + mood);
});

app.handle('saveJournalAndClassifyContent', async conv => {
    conv.overwrite = false;
    let email = conv.user.params.tokenPayload.email;
    let date = conv.user.lastSeenTime.substr(0, 10);
    let journalEntry = conv.session.params.input;
    let mood = conv.session.params.chosenMood;

    let journalEntryFilePath = email + "/" + date + "/journalEntry";
    let storageRef = ref(storage, journalEntryFilePath);
    uploadString(storageRef, journalEntry);
    conv.add('Okay, your journal entry has been recorded ');

    // // Prepare path to storage
    // contentFilePath = email + "/" + date + "/contentClassified";
    // storageRef = ref(storage, contentFilePath);

    // Prepares a document, representing the provided text
    const document = {
        content: journalEntry,
        type: 'PLAIN_TEXT',
    };

    // // Classifies text in the document
    // console.log("*********** Classify Content *************");
    // const [classification] = await client.classifyText({document});
    // let categoryString = "";
    // classification.categories.forEach(category => {
    //     console.log(category.name);
    //     categoryString = categoryString + `Name: ${category.name}, Confidence: ${category.confidence}`;
    // });
    
    // Prepare path to storage
    contentFilePath = email + "/" + date + "/entities";
    storageRef = ref(storage, contentFilePath);
    
    // Detects entities in the document
    const [result] = await client.analyzeEntities({document});
    const entities = result.entities;

    console.log('Entities:');
    let entitiesString = "";
    entities.forEach(entity => {
        console.log(entity);
        entitiesString = entitiesString + ` - Name: ${entity.name}, - Type: ${entity.type}, Salience: ${entity.salience}`;
        if (entity.metadata && entity.metadata.wikipedia_url) {
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);
            entitiesString = entitiesString + ` - Wikipedia URL: ${entity.metadata.wikipedia_url}`;
        }
    });

    uploadString(storageRef, entitiesString);

});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
