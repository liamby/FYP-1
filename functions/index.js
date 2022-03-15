const functions = require('firebase-functions');
const { initializeApp } = require('@firebase/app');
const { doc, setDoc, getFirestore } = require('@firebase/firestore');
const { conversation, Canvas } = require('@assistant/conversation');
const language = require('@google-cloud/language');

const firebaseConfig = {
  apiKey: "AIzaSyDNQrLzFJ-HqR61MNUD5eC0ZJWSc9clZY4",
  authDomain: "fyp-actionsconsole.firebaseapp.com",
  projectId: "fyp-actionsconsole",
  storageBucket: "fyp-actionsconsole.appspot.com",
  messagingSenderId: "664121014324",
  appId: "1:664121014324:web:a7271150439fc0b90ff261"
};

const app = conversation({
  clientId: "664121014324-k6i8kctuj0qrgkr79d0na1t0klbj6ltm.apps.googleusercontent.com",
  debug: true
});

const client = new language.LanguageServiceClient();
const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore();

// app.handle('wait', async conv => {
//   setTimeout(() => {conv.scene.next.name = "logMood";}, 5000);
// });


/* Invoked on successful completion of account linking flow, 
   Check if we need to create a Firebase user.  */
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
        // If user is not found, create a new Firebase auth user
        // Using the email obtained from Google Assistant. 
        conv.user.params.uid = (await auth.createUser({ email })).uid;
      }
    }
  }
});


//Sends viewmode to canvas or asks for prefernce then sends viewmode to canvas.  
app.handle('getViewMode', async conv => {

  //If viewMode has been set go to mood logging. 
  if(conv.user.params.viewMode == "light" || conv.user.params.viewMode == "dark"){
    console.log('*** viewMode == light || dark *** ');
    conv.add(new Canvas({
      data: {
        viewMode: conv.user.params.viewMode,
        scene: 'moodJournal'
      },
    }));
    conv.scene.next.name = "LogMood";

  //If viewmode hasn't been set, ask the user.
  }else if(typeof conv.user.params.viewMode == 'undefined'){
    console.log('*** viewMode == undefined *** ');
    conv.add("Before we get started, what colour scheme would you like to choose?");
    conv.scene.next.name = "chooseViewMode";
    
  //If viewmode is invalid throw error
  }else if(conv.user.params.viewMode != "light" && conv.user.params.viewMode != "dark"){
    console.log('*** viewMode ERROR set to undefined');
    conv.user.params.viewMode = undefined;
  }  
});


//Sets user parameter viewmode (permanent) as the session paramenter viewmode (temporaray) 
app.handle('saveViewMode', async conv => {
  console.log('saveViewMode called');
  conv.overwrite = false;
  conv.user.params.viewMode = conv.session.params.viewMode;
  conv.add("Great choice " + conv.user.params.tokenPayload.given_name + "! Your homepage has been customized. " +  
            "Here you can log and browse your moods and their related factors. There will be more information " + 
            "on display here after a few days of talking to me.");
  conv.add(new Canvas({
    data: {
      viewMode: conv.user.params.viewMode,
    },
  }));
  conv.scene.next.name = "LogMood";
});


//Saves users Mood
app.handle('saveMood', async conv => {
  conv.overwrite = false;

  let email = conv.user.params.tokenPayload.email;
  let mood = conv.session.params.chosenMood; 

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  let todaysDate = new Date();
  const todaysDateString = todaysDate.toLocaleDateString('en-us', options);

  const userStorage = doc(firestore, email + '/' + todaysDateString);

  await setDoc(userStorage, { mood: mood, todaysDate: todaysDate }, { merge: true })
    .then(() => {
      console.log('mood has been written to the database');
      conv.add('Okay, your mood has been logged as ' + mood);
    })
    .catch((error) => { console.log('I got an error! ${error}'); });

});


//Saves Journal Entry and Classifies Content
app.handle('saveJournalAndClassifyContent', async conv => {
  conv.overwrite = false;
  let email = conv.user.params.tokenPayload.email;
  let journalEntry = conv.session.params.journalEntry;

  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  let todaysDate = new Date();
  const todaysDateString = todaysDate.toLocaleDateString('en-us', options);

  // Initialise path to storage
  const userStorage = doc(firestore, email + '/' + todaysDateString);

  //Set value of journalEntry
  await setDoc(userStorage, { journalEntry: journalEntry, todaysDate: todaysDate  }, { merge: true })
    .then(() => {
      console.log('journalEntry has been written to the database');
      conv.add('Okay, your journal entry has been recorded ');
    })
    .catch((error) => { console.log('I got an error! ${error}'); });

  // Prepares a document, representing the provided text
  const document = {
    content: journalEntry,
    type: 'PLAIN_TEXT',
  };

  // Detects entities in the document
  const [result] = await client.analyzeEntities({ document });
  const entities = result.entities;

  await setDoc(userStorage, { entities: entities }, { merge: true })
    .then(() => { console.log('This value has been written to the database'); })
    .catch((error) => { console.log('I got an error! ${error}'); });
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
