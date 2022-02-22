/*
VUE.JS
This file contains the code for retrieving data from the backend 
and the reactively changing the HTML in index.html file.
*/

//Set up firebase and firestore app

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

//Vue app
var app = new Vue({
    el: '#app',

    data: {

        //Colour data. 
        Colours: {
            excellent: "#fee4cb",
            happy: "#e9e7fd",
            ok: "#ffd3e2",
            bad: "#c8f7dc",
            Awfull: "#d5deff",
            other: "#dbf6fd"
        },

        //session specific data
        scene: "moodJournal",
        activeIcon: 'moodJournal',
        calendarView: 'jsGridView',
        viewMode: 'light',
        today: new Date(),

        //user specific data
        name: "",
        given_name: "",
        family_name: "",
        picture: "",
        email: "",

        //day specific data
        mood: undefined,
        journalEntry: undefined,
        entities: undefined,
        day: undefined,
        month: undefined,
        date: undefined,
        year: undefined,
        calendarData: undefined
    },
    methods: {

        setUserDetails(userName, given_name, family_name, picture, email) {
            console.log("setUserDetails called with :" + userName + " " + given_name + " " + family_name + " " + picture + " " + email);
            this.name = userName;
            this.given_name = given_name;
            this.family_name = family_name;
            this.picture = picture;
            this.email = email;
        },

        getCalendarData() {
            console.log("getCalendarData called ");
        },

        //takes in a date object and sets  
        getDayData(date) {
            console.log("getDayData called with: " + date);
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const dateString = date.toLocaleDateString('en-us', options);

            //Set date data
            this.day = date.toLocaleTimeString('en-us', { weekday: 'long' }).slice(0, -10);
            this.month = date.toLocaleTimeString('en-us', { month: 'long' }).slice(0, -12);
            this.date = date.toLocaleTimeString('en-us', { day: 'numeric' }).slice(0, -12);
            this.year = date.toLocaleTimeString('en-us', { year: 'numeric' }).slice(0, -12);
            console.log(" day: " + this.day + " month: " + this.month + " date: " + this.date + " year: " + this.year)

            //Set user generated data
            const docRef = doc(firestore, this.email, dateString);
            const unsub = onSnapshot(docRef, (doc) => {
                console.log("Current data: ", doc.data());
                this.mood = doc.data().mood;
                this.journalEntry = doc.data().journalEntry;
                this.entities = doc.data().entities;
                console.log("Current data: ", this.entities);
            });

        },

        changeScene(sceneParam) {
            console.log("changeScene called with: " + sceneParam);
            if (sceneParam == "moodJournal") {
                this.getDayData(new Date());
            }
            this.scene = sceneParam;
            this.activeIcon = sceneParam;
        },

        changeMode(viewMode) {
            console.log("changing viewMode called with this.viewMode = " + this.viewMode + " new viewMode = " + viewMode);
            if (this.viewMode != viewMode) {
                console.log("changing viewMode");
                document.documentElement.classList.toggle('dark');
                document.querySelector('.mode-switch').classList.toggle('active');
            }
        },

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

        //Print state of data and vue app
        console.log("data = " + JSON.stringify(data, null, 2));
        console.log(app);

        //Check all indexes of data array passed in
        for (let i = 0; i < data.length; i++) {

            //Call appropriate functions 
            if (typeof (data[i].name) !== 'undefined' && typeof data[i].given_name != 'undefined'
                && typeof (data[i].family_name) !== 'undefined' && typeof data[i].picture != 'undefined' && typeof data[i].email != 'undefined')
                app.setUserDetails(data[i].name, data[i].given_name, data[i].family_name, data[i].picture, data[i].email);

            if (typeof (data[i].date) !== 'undefined') app.getDayData(data[i].date);

            if (typeof (data[i].scene) !== 'undefined') app.changeScene(data[i].scene);

            if (typeof (data[i].mood) !== 'undefined') app.mood = data[i].mood;

            if (typeof (data[i].journalEntry) !== 'undefined') app.journalEntry = data[i].journalEntry;

            if (typeof(data[i].viewMode) !== 'undefined') app.changeMode(data[i].viewMode);
            
        }

    }
});