/*
VUE.JS
This file contains the code for retrieving data from the backend 
and the reactively changing the HTML in index.html file.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, onSnapshot, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

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

// Vue app
var app = new Vue({
    el: '#app',

    data: {

        // Colour data. 
        colours: {
            excellent: "#fee4cb",
            happy: "#e9e7fd",
            ok: "#ffd3e2",
            bad: "#c8f7dc",
            awfull: "#d5deff",
            other: "#dbf6fd"
        },
        backgroundColours: {
            happy: "#4F3FF0",
            other: "#096c86",
            ok: "#df3670",
            bad: "#34c471",
            awfull: "#4067f9"
        },

        // Session specific data..
        scene: "moodJournal",
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
            journalEntry: undefined,
            entities: undefined,
            day: undefined,
            month: undefined,
            date: undefined,
            year: undefined
        },
        calendarData: []

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

        // Takes in a date object and sets. 
        async getDayData(date) {

            // Set date data.
            let day = date.toLocaleTimeString('en-us', { weekday: 'long' })
            day = day.slice(0, day.length - 12);
            let month = date.toLocaleTimeString('en-us', { month: 'long' });
            month = month.slice(0, month.length - 13);
            let dateNumber = date.toLocaleTimeString('en-us', { day: 'numeric' });
            dateNumber = dateNumber.slice(0, dateNumber.length - 13);
            let year = date.toLocaleTimeString('en-us', { year: 'numeric' });
            year = year.slice(0, year.length - 13);

            // Create path to firestore.
            let dateString = (month + " " + dateNumber + ", " + year);
            let docRef = doc(firestore, this.email, dateString);

            // Set user generated data.
            let mood = 'brello'; let journalEntry = 'fren'; let entities = 'blahh';
            await onSnapshot(docRef, (doc) => {
                console.log(dateString + " data: ", JSON.stringify(doc.data(), null, 2));
                if (typeof doc.data() != 'undefined') {
                    if (typeof doc.data().mood != 'undefined') mood = doc.data().mood;
                    if (typeof doc.data().journalEntry != 'undefined') journalEntry = doc.data().journalEntry;
                    if (typeof doc.data().entities != 'undefined') entities = doc.data().entities;
                }
                console.log("Snapshot ended with: mood = ", mood, " journalEntry = ", journalEntry, "entities = ", entities);
            })

            let dayObj = {
                mood: mood,
                journalEntry: journalEntry,
                entities: entities,
                day: day,
                month: month,
                date: date,
                year: year
            };

            console.log(JSON.stringify(dayObj, null, 2));
            return dayObj;

        },

        /*  Initialises calendar data object with previous entries. 
            Add each previous user entries to calendar array by sending date and 
            dayObj to getDayData and storing return value in calendarData array. */
        async getCalendarData() {
            console.log("getCalendarData called with: " + this.email);
            if (this.calendarData.length == 0) {
                const querySnapshot = await getDocs(collection(firestore, this.email));
                querySnapshot.forEach((data) => {
                    let date = new Date(data.id);

                    // Set date data.
                    let day = date.toLocaleTimeString('en-us', { weekday: 'long' })
                    day = day.slice(0, day.length - 12);
                    let month = date.toLocaleTimeString('en-us', { month: 'long' });
                    month = month.slice(0, month.length - 13);
                    let dateNumber = date.toLocaleTimeString('en-us', { day: 'numeric' });
                    dateNumber = dateNumber.slice(0, dateNumber.length - 13);
                    let year = date.toLocaleTimeString('en-us', { year: 'numeric' });
                    year = year.slice(0, year.length - 13);

                    // Create path to firestore.
                    let dateString = (month + " " + dateNumber + ", " + year);
                    let docRef = doc(firestore, this.email, dateString);
                    
                    // Set user generated data.
                    let mood; let journalEntry; let entities;

                    getDoc(docRef).then(docSnap => {
                        if (docSnap.exists()) {
                            console.log("Document data:", docSnap.data());
                            if (typeof docSnap.data().mood != 'undefined') mood = docSnap.data().mood;
                            if (typeof docSnap.data().journalEntry != 'undefined') journalEntry = docSnap.data().journalEntry;
                            if (typeof docSnap.data().entities != 'undefined') entities = docSnap.data().entities;
                            console.log("Snapshot ended with: mood = ", mood, " journalEntry = ", journalEntry, "entities = ", entities);
                            let dayObj = {
                                mood: mood,
                                journalEntry: journalEntry,
                                entities: entities,
                                day: day,
                                month: month,
                                date: date,
                                year: year
                            };
                            console.log("dayObj: " + JSON.stringify(dayObj, null, 2));
                            this.calendarData.push(dayObj);
                        } else {
                            console.log("No such document!");
                        }
                    });

                    console.log("doc: " + data);
                    console.log("calendarData: " + JSON.stringify(this.calendarData, null, 2));
                });
            }
        },

        /*  Sets Vue app scene to parameter and if sceneParam 
            is moodJournal or calendar set data of page. */
        changeScene(sceneParam) {
            console.log("changeScene called with: " + sceneParam);
            if (sceneParam == "moodJournal") this.dayObj = this.getDayData(new Date());
            if (sceneParam == "calendar") this.getCalendarData();
            this.scene = sceneParam;
            this.activeIcon = sceneParam;
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
        }

    }

});


/* Code for passing data between the google action (the conversation) 
and the front end. When the data object changes then the onUpdate 
function gets called and changes the display depending on the data object.*/
interactiveCanvas.ready({

    /* When the contents of the data array passed to interactive canvas changes 
    (new data is being sent to the front end). Call the appropriate functions in the vue app. */
    onUpdate(data) {

        // Print state of data and vue app
        console.log("data = " + JSON.stringify(data, null, 2));
        console.log(app);

        // Check all indexes of data array passed in
        for (let i = 0; i < data.length; i++) {

            // Call appropriate functions 
            if (typeof (data[i].name) !== 'undefined' && typeof data[i].given_name != 'undefined'
                && typeof (data[i].family_name) !== 'undefined' && typeof data[i].picture != 'undefined' && typeof data[i].email != 'undefined')
                app.setUserDetails(data[i].name, data[i].given_name, data[i].family_name, data[i].picture, data[i].email);

            if (typeof (data[i].scene) !== 'undefined') app.changeScene(data[i].scene);

            if (typeof (data[i].mood) !== 'undefined') app.mood = data[i].mood;

            if (typeof (data[i].journalEntry) !== 'undefined') app.journalEntry = data[i].journalEntry;

            if (typeof (data[i].viewMode) !== 'undefined') app.changeMode(data[i].viewMode);

        }

    }
});