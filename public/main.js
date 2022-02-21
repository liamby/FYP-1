// /*
// MAIN.JS

// This file contains the code for passing data between the google astion
// (the conversation) and the front end. When the data object changes then 
// the onupdate function "clicks" the appropriate icon to change the pages 
// on display.
// */

// interactiveCanvas.ready({
//     onUpdate(data) {
//         if (data.length > 0) {
//             console.log(data);
//             console.log(app);
//             //Display the correct page
//             if (typeof data[0].scene != 'undefined') app.$children[0].changeScene(data[0].scene);

//             // //Display the correct viewMode
//             // if (typeof data[0].viewMode != 'undefined') app.changeMode();

//             // //Display the mood
//             // if (typeof data[0].mood != 'undefined') app.mood = data[0].mood;

//             // //Display the Journal Entry
//             // if (typeof data[0].journalEntry != 'undefined') app.journalEntry = data[0].journalEntry;

//             // // Set user details
//             // if (typeof data[0].name != 'undefined' && typeof data[0].given_name != 'undefined'
//             //     && typeof data[0].family_name != 'undefined' && typeof data[0].picture != 'undefined') {
//             //     app.setUserDetails(data[0].name);
//             // }

//             // //Display the Journal Entry
//             // if (typeof data[0].viewMode != 'undefined') app.viewMode = data[0].viewMode;
//         }
//     }
// });