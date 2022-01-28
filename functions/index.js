const {conversation} = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({debug: true});

app.handle('journal', (conv) => {
    conv.overwrite = false;
    conv.add('Hello world from fulfillment');
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
