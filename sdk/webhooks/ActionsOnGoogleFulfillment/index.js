const {conversation} = require('@assistant/conversation');
const functions = require('firebase-functions');

const app = conversation({debug: true});

app.handle('journal', (conv) => {
    console.log('This is the log');
    conv.overwrite = false;
    conv.scene.next.name = 'actions.scene.END_CONVERSATION';
    conv.add('Hello world from fulfillment');
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
