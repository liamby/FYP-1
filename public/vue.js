/*
VUE.JS
This file contains the code for retrieving data from the backend 
and the reactively changing the HTML in index.html file.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, getDoc, getDocs, collection, orderBy, query } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDNQrLzFJ-HqR61MNUD5eC0ZJWSc9clZY4",
    authDomain: "fyp-actionsconsole.firebaseapp.com",
    projectId: "fyp-actionsconsole",
    storageBucket: "fyp-actionsconsole.appspot.com",
    messagingSenderId: "664121014324",
    appId: "1:664121014324:web:a7271150439fc0b90ff261"
};

const firebaseApp = initializeApp(firebaseConfig);
const firestore = getFirestore();

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

// Vue app
var app = new Vue({
    el: '#app',

    data: {

        display: 'false',

        // Colour data. 
        colours: {
            Excellent: "#4de68f", //green
            Good: "#3ef4e8", //turkoise
            Ok: "#d5deff", //lavender
            Bad: "#335fff", //purple
            Awfull: "#fb9637", //peach 
            Other: "#ff3377" //pink 
        },

        backgroundColours: {
            Excellent: "#34c471",//dark green 
            Good: "#09867C", //dark turkoise 
            Ok: "#001668",  //dark lavender
            Bad: "#30296F", //dark purple
            Awfull: "#df3670" // dark pink
        },

        // Session specific data..
        scene: "loading",
        activeIcon: 'moodJournal',
        calendarView: 'jsGridView',
        viewMode: 'light',
        today: new Date(),

        // User specific data.
        name: "",
        given_name: "",
        family_name: "",
        picture: "",
        email: "",

        // Day specific data.
        dayData: {
            mood: undefined,
            journalEntry: "You haven't added a journal entry for today yet",
            entities: [],
            date: undefined,
            day: undefined,
            month: undefined,
            dateNumber: undefined,
            suffix: undefined,
            year: undefined
        },

        // CalendarData
        calendarData: [],

    },
    methods: {

        // Sets user specific data to parameters.
        setUserDetails(userName, given_name, family_name, picture, email) {
            console.log("setUserDetails called with :" + userName + " " + given_name + " " + family_name + " " + picture + " " + email);
            this.name = userName;
            this.given_name = given_name;
            this.family_name = family_name;
            this.picture = picture;
            this.email = email;
        },

        addOrdinalSuffix(num) {
            let arr = num.toString().split('');
            let arrLastMember = arr[arr.length - 1];
            let arrSecondLastMember = arr[arr.length - 2];
            let suffix = 'th';

            console.log("arrLastMember: " + arrLastMember + "arrSecondLastMember: " + arrSecondLastMember);

            if (typeof arrSecondLastMember == 'undefined') {
                if (arrLastMember == 1) suffix = 'st';
                if (arrLastMember == 2) suffix = 'nd';
                if (arrLastMember == 3) suffix = 'rd';
            } else {
                if (arrLastMember == 1 && arrSecondLastMember.concat(arrLastMember) != "11") suffix = 'st';
                if (arrLastMember == 2 && arrSecondLastMember.concat(arrLastMember) != "12") suffix = 'nd';
                if (arrLastMember == 3 && arrSecondLastMember.concat(arrLastMember) != "13") suffix = 'rd';
            }

            return suffix;
        },

        // Takes in a date object and sets. 
        getDayData(date) {
            console.log("date" + date);
            // Set date data.
            this.dayData.date = date
            this.dayData.day = days[date.getDay()];
            this.dayData.month = months[date.getMonth()];
            this.dayData.dateNumber = date.getDate();
            console.log("this.dayData.date" + this.dayData.dateNumber);
            this.dayData.suffix = this.addOrdinalSuffix(this.dayData.dateNumber)
            this.dayData.year = date.getFullYear();

            // Create path to firestore.
            let dateString = (this.dayData.month + " " + this.dayData.dateNumber + ", " + this.dayData.year);
            let docRef = doc(firestore, this.email, dateString);

            // Set user generated data.
            this.dayData.mood = undefined;
            this.dayData.journalEntry = undefined;
            this.dayData.entities = undefined;

            onSnapshot(docRef, (doc) => {
                console.log(dateString + " data: ", JSON.stringify(doc.data(), null, 2));
                if (typeof doc.data() != 'undefined') {
                    if (typeof doc.data().mood != 'undefined') this.dayData.mood = doc.data().mood;
                    if (typeof doc.data().journalEntry != 'undefined') this.dayData.journalEntry = doc.data().journalEntry;
                    if (typeof doc.data().entities != 'undefined') this.dayData.entities = doc.data().entities;
                }
                console.log("Snapshot ended with: mood = ", this.dayData.mood,
                    " journalEntry = ", this.dayData.journalEntry,
                    " entities = ", this.dayData.entities);
                this.highlight();
            })
        },

        /*  Initialises calendar data object with previous entries. 
            Add each previous user entries to calendar array by sending date and 
            dayObj to getDayData and storing return value in calendarData array. */
        async getCalendarData() {
            console.log("getCalendarData called with: " + this.email);
            if (this.calendarData.length == 0) {
                const querySnapshot = await getDocs(query(collection(firestore, this.email), orderBy("todaysDate", "desc")));
                querySnapshot.forEach((data) => {
                    let date = new Date(data.id);

                    // Set date data.
                    let day = days[date.getDay()];
                    let month = months[date.getMonth()];
                    let dateNumber = date.getDate();
                    let year = date.getFullYear();

                    // Create path to firestore.
                    let dateString = (month + " " + dateNumber + ", " + year);
                    let docRef = doc(firestore, this.email, dateString);

                    // Retrieve and set user generated data.
                    let mood; let journalEntry; let entities;

                    getDoc(docRef).then(docSnap => {
                        if (docSnap.exists()) {
                            console.log("Document data:", docSnap.data());
                            if (typeof docSnap.data().mood != 'undefined') mood = docSnap.data().mood;
                            if (typeof docSnap.data().journalEntry != 'undefined') journalEntry = docSnap.data().journalEntry;
                            if (typeof docSnap.data().entities != 'undefined') entities = docSnap.data().entities;
                            let dayObj = {
                                mood: mood,
                                journalEntry: journalEntry,
                                entities: entities,
                                date: date,
                                day: day,
                                month: month,
                                dateNumber: dateNumber,
                                year: year
                            };
                            this.calendarData.push(dayObj);
                            console.log("calendarData: " + this.calendarData);
                        } else {
                            console.log("No such document!");
                        }
                    });
                });
            }
        },

        /*  Sets Vue app scene to parameter and if sceneParam 
            is moodJournal or calendar set data of page. */
        changeScene(sceneParam) {
            console.log("changeScene called with: " + sceneParam);
            if (sceneParam == "moodJournal") this.getDayData(new Date());
            if (sceneParam == "calendar") this.getCalendarData();
            this.scene = sceneParam;
            this.activeIcon = sceneParam;
            //this.updateCanvasState();
        },

        showCalendarDay(date){
            console.log("showCalendarDay called with: " + date);
            this.getDayData(date);
            this.scene = 'moodJournal';
        },

        // Toggle viewmode if parameter is different to current viewmode.
        changeMode(viewMode) {
            console.log("changing viewMode called with this.viewMode = " + this.viewMode + " new viewMode = " + viewMode);
            if (this.viewMode != viewMode) {
                console.log("changing viewMode");
                document.documentElement.classList.toggle('dark');
            }
        },

        // Sets calendarView to Parameter. 
        changeCalendarView(calendarView) {
            console.log("changeCalendarView called");
            this.calendarView = calendarView;
        },

        // Sends Key down instruction to animation Iframe. 
        sendKeyDownToFrame(key) {
            console.log("sendKeyDownToFrame ", key);
            const iframe = document.getElementById("myIframe");
            iframe.contentWindow.postMessage('keydown ' + key);
        },

        // Sends Key up instruction to animation IFrame. 
        sendKeyUpToFrame(key) {
            console.log("sendKeyUpToFrame ", key);
            const iframe = document.getElementById("myIframe");
            iframe.contentWindow.postMessage('keyup ' + key);
        },


        highlight() {
            let newText = this.dayData.journalEntry;
            for (let entity in this.dayData.entities) {
                let re = new RegExp(this.dayData.entities[entity].name, "g")
                newText = newText.replace(re, `<mark>${this.dayData.entities[entity].name}</mark>`);
            }
            let message = document.getElementById("message-line");
            message.innerHTML = newText;
        },
        
        loaded(){
            console.log("LOADED CALLED");
            //console.log(interactiveCanvas.triggerScene('LogMood'));
            console.log(interactiveCanvas.sendTextQuery('LogMood'));
            //document.getElementById("loader").style.display = "none";
        }

        // // start conversation
        // updateCanvasState() {
        //     interactiveCanvas.setCanvasState({
        //         display: this.display,
        //         scene: this.scene
        //     });
        // }

    },
    // ready() {
    //     this.loaded();
    // }

});


/* Code for passing data between the google action (the conversation) 
and the front end. When the data object changes then the onUpdate 
function gets called and changes the display depending on the data object.*/
await interactiveCanvas.ready({

    /* When the contents of the data array passed to interactive canvas changes 
    (new data is being sent to the front end). Call the appropriate functions in the vue app. */
    onUpdate(data) {

        // Print state of data and vue app
        console.log("data = " + JSON.stringify(data, null, 2));
        console.log(app);

        // Check all indexes of data array passed in
        for (let i = 0; i < data.length; i++) {

            // Call appropriate functions 
            if (typeof (data[i].name) !== 'undefined'
                && typeof data[i].given_name != 'undefined'
                && typeof (data[i].family_name) !== 'undefined'
                && typeof data[i].picture != 'undefined'
                && typeof data[i].email != 'undefined')
                app.setUserDetails(data[i].name, data[i].given_name, data[i].family_name, data[i].picture, data[i].email);

            if (typeof (data[i].scene) !== 'undefined') app.changeScene(data[i].scene);

            if (typeof (data[i].mood) !== 'undefined') app.mood = data[i].mood;

            if (typeof (data[i].journalEntry) !== 'undefined') app.journalEntry = data[i].journalEntry;

            if (typeof (data[i].viewMode) !== 'undefined') app.changeMode(data[i].viewMode);

        }

    },

    //START, END, ERROR
    onTtsMark(markName) {
        const iframe = document.getElementById("myIframe");
        if (markName == 'START') {
            console.log("START");
            app.sendKeyUpToFrame('l');
            app.sendKeyDownToFrame('s');
        }
        if (markName == 'END') {
            console.log("END");
            app.sendKeyUpToFrame('s');
            app.sendKeyDownToFrame('l');
        }
        if (markName == 'ERROR') {
            console.log("ERROR");
        }
    },

    //LISTENING IDLE PROCESSING
    // onInputStatusChanged(inputStatus) {
    //     const iframe = document.getElementById("myIframe");
    //     console.log(inputStatus);
    //     if (inputStatus == 'LISTENING') {
    //         app.sendKeyDownToFrame('l');
    //     }
    //     if (inputStatus == 'IDLE') {
    //         app.sendKeyUpToFrame('l');
    //     }
    //     if (inputStatus == 'PROCESSING') {
    //     }
    // }

})

app.loaded();;