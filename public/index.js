/*
INDEX.JS

This file contains the code for the buttons on the GUI of the app. 
When a button is presses an event listener is called and the
pages are displayed appropriately.
*/

// Initialise Variables
/*
var TodaysMoodJournal = document.querySelector('#TodaysMoodJournal');
var Stats = document.querySelector('#Stats');
var Calendar = document.querySelector('#Calendar');
var Settings = document.querySelector('#Settings');
var MoodJournal = document.querySelector('#MoodJournal');

var TodaysMoodJournalIcon = document.querySelector('#TodaysMoodJournalIcon');
var StatsIcon = document.querySelector('#StatsIcon');
var CalendarIcon = document.querySelector('#CalendarIcon');
var SettingsIcon = document.querySelector('#SettingsIcon');

var projectsList = document.querySelector('#CalendarDays');
var modeSwitch = document.querySelector('.mode-switch');
var listView = document.querySelector('.list-view');
var gridView = document.querySelector('.grid-view');

// Event Listeners for Buttons
modeSwitch.addEventListener('click', function () {
  document.documentElement.classList.toggle('dark');
  modeSwitch.classList.toggle('active');
});

listView.addEventListener('click', function () {
  gridView.classList.remove('active');
  listView.classList.add('active');
  projectsList.classList.remove('jsGridView');
  projectsList.classList.add('jsListView');
});

gridView.addEventListener('click', function () {
  gridView.classList.add('active');
  listView.classList.remove('active');
  projectsList.classList.remove('jsListView');
  projectsList.classList.add('jsGridView');
});

// Event Listeners for Sidebar
TodaysMoodJournalIcon.addEventListener('click', function () {
  TodaysMoodJournal.style.display = 'block';
  Stats.style.display = 'none';
  Calendar.style.display = 'none';
  Settings.style.display = 'none';
  MoodJournal.style.display = 'none';
  TodaysMoodJournalIcon.classList.add('active');
  StatsIcon.classList.remove('active');
  CalendarIcon.classList.remove('active');
  SettingsIcon.classList.remove('active');
});

StatsIcon.addEventListener('click', function () {
  TodaysMoodJournal.style.display = 'none';
  Stats.style.display = 'block';
  Calendar.style.display = 'none';
  Settings.style.display = 'none';
  MoodJournal.style.display = 'none';
  TodaysMoodJournalIcon.classList.remove('active');
  StatsIcon.classList.add('active');
  CalendarIcon.classList.remove('active');
  SettingsIcon.classList.remove('active');
});

CalendarIcon.addEventListener('click', function () {
  TodaysMoodJournal.style.display = 'none';
  Stats.style.display = 'none';
  Calendar.style.display = 'block';
  Settings.style.display = 'none';
  MoodJournal.style.display = 'none';
  TodaysMoodJournalIcon.classList.remove('active');
  StatsIcon.classList.remove('active');
  CalendarIcon.classList.add('active');
  SettingsIcon.classList.remove('active');
});

SettingsIcon.addEventListener('click', function () {
  TodaysMoodJournal.style.display = 'none';
  Stats.style.display = 'none';
  Calendar.style.display = 'none';
  Settings.style.display = 'block';
  MoodJournal.style.display = 'none';
  TodaysMoodJournalIcon.classList.remove('active');
  StatsIcon.classList.remove('active');
  CalendarIcon.classList.remove('active');
  SettingsIcon.classList.add('active');
});
*/