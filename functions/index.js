const {conversation} = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({debug: true});

app.handle('journal', (conv) => {
    conv.overwrite = false;
    conv.add('Hello world from functions');
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
