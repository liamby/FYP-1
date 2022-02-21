/*
VUE.JS

This file contains the code for retrieving data from the backend 
and the reactively changing the HTML in index.html file.
*/

import { doc, onSnapshot, getFirestore } from "https://www.gstatic.com/firebasejs/9.1.1/firebase-firestore.js";

var app = new Vue({
    el: '#app',

    data: {
        scene: "moodJournal",
        activeIcon: 'moodJournal',
        calendarView: 'jsGridView',
        viewMode: 'light',

        name: "",
        given_name: "",
        family_name: "",
        picture: "",

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

        setUserDetails(userName, given_name, family_name, picture) {
            console.log("setUserDetails called with :" + userName + " " + given_name + " " + family_name + " " + picture);
            this.name = userName;
            this.given_name = given_name;
            this.family_name = family_name;
            this.picture = picture;
        },

        getCalendarData() {
            console.log("getCalendarData called ");
        },

        getDayData(date) {
            console.log("getDayData called with: " + date);
            const userStorage = doc(firestore, this.email + '/' + this.date);
            let dateObj = new Date(date);
            this.day = dateObj.toLocaleTimeString('en-us', { weekday: 'long' });
            this.month = dateObj.toLocaleTimeString('en-us', { month: 'long' });
            this.date = dateObj.toLocaleTimeString('en-us', { day: 'numeric' });
            this.year = dateObj.toLocaleTimeString('en-us', { year: 'numeric' });

            const unsub = onSnapshot(doc(userStorage), (doc) => {
                console.log("Current data: ", doc.data());
                this.mood = doc.mood;
                this.journalEntry = doc.journalEntry;
                this.entities = doc.entities;
            });

        },

        changeScene(sceneParam) {
            console.log("changeScene called with: " + sceneParam);
            this.scene = sceneParam;
            this.activeIcon = sceneParam;
        },

        changeMode(viewMode) {
            if (this.viewMode != viewMode) {
                console.log("changing viewMode");
                document.documentElement.classList.toggle('dark');
                document.querySelector('.mode-switch').classList.toggle('active');
                //Todo Save User view mode for next time. 
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

        if (data.length > 0) {

            //Print state of data and vue app
            console.log("data = " + JSON.stringify(data, null, 2));
            console.log("app = " + app);

            //Call appropriate functions 
            if (typeof data[0].name != 'undefined' && typeof data[0].given_name != 'undefined'
                && typeof data[0].family_name != 'undefined' && typeof data[0].picture != 'undefined')
                app.setUserDetails(data[0].name, data[0].given_name, data[0].family_name, data[0].picture);

            if (typeof data[0].date != 'undefined') app.getDayData(data[0].date);

            if (typeof data[0].viewMode != 'undefined') app.changeMode(data[0].viewMode);

            if (typeof data[0].scene != 'undefined') app.changeScene(data[0].scene);

            if (typeof data[0].mood != 'undefined') app.mood = data[0].mood;

            if (typeof data[0].journalEntry != 'undefined') app.journalEntry = data[0].journalEntry;
        }
    }
});