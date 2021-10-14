const ROOT = document.querySelector(":root");
const TIMER_ITEM = document.getElementById("timer");
const MINUTES_TEXT = document.getElementById("minutes");
const SECONDS_TEXT = document.getElementById("seconds");
const TIME_TYPE = document.getElementById("time-type-text");
const LOCAL_TIME = document.getElementById("localTime");
const REMAINING_SESSIONS = document.getElementById("sessions-left-text");

// elements from settings menu
const SETTINGS_MENU = document.getElementById("settings-menu");
const SETTINGS_CANCEL = document.getElementById("settings-cancel");
const SETTINGS_RESET_BTN = document.getElementById("settings-reset");
const SETTINGS_SAVE = document.getElementById("settings-save");
const WORK_TIME_BOX = document.getElementById("work-time");
const BREAK_TIME_BOX = document.getElementById("break-time");
const LONG_BREAK_TIME_BOX = document.getElementById("long-break-time");
const SOUND_TOGGLE_BOX = document.getElementById("sound-toggle");
const AUTO_WORK_TOGGLE_BOX = document.getElementById("auto-work-toggle");
const AUTO_BREAK_TOGGLE_BOX = document.getElementById("auto-break-toggle");
const COLOR_PICKER1 = document.getElementById("primary-color-picker");
const COLOR_PICKER2 = document.getElementById("muted-color-picker");
const COLOR_PICKER3 = document.getElementById("secondary-color-picker");
const COLOR_PICKER4 = document.getElementById("background-color-picker");
const COLOR_PICKER_BG1 = document.getElementById("primary-color-picker-bg");
const COLOR_PICKER_BG2 = document.getElementById("muted-color-picker-bg");
const COLOR_PICKER_BG3 = document.getElementById("secondary-color-picker-bg");
const COLOR_PICKER_BG4 = document.getElementById("background-color-picker-bg");

// control buttons
const SETTINGS_BUTTON = document.getElementById("settings-btn");
const ADD_TIME_BUTTON = document.getElementById("add-one-min-btn");
const SKIP_BUTTON = document.getElementById("skip-btn");
const START_TIMER = document.getElementById("pause-play-btn");
const RESET_BUTTON = document.getElementById("reset-btn");

// session finish messages
const WORK_END_MESSAGE = document.getElementById("workEnd");
const BREAK_END_MESSAGE = document.getElementById("breakEnd");

var timing = false;
var breakRunning = false;
var remainingSessions = "4";

// settings variables
var breakTime = 5; // default 5
var workTime = 25; // default 25
var longBreakTime = 15;
var soundToggle = "true";
var autoWork = "false";
var autoBreak = "false";
var primaryColor = "#b999a3";
var mutedColor = "#746571";
var secondaryColor = "#a589a0";
var backgroundColor = "#252335";

// hide no JS error
document.getElementById("no-js-error").style.display = "none";

// Initialization

// Load stored settings value from local storage
// check if local storage has data stored
if (localStorage.length) {
  // load settings to variables
  breakTime = localStorage.getItem("breakTime");
  longBreakTime = localStorage.getItem("longBreakTime");
  workTime = localStorage.getItem("workTime");
  soundToggle = localStorage.getItem("soundToggle");
  autoWork = localStorage.getItem("autoWork");
  autoBreak = localStorage.getItem("autoBreak");
  primaryColor = localStorage.getItem("primaryColor");
  mutedColor = localStorage.getItem("mutedColor");
  secondaryColor = localStorage.getItem("secondaryColor");
  backgroundColor = localStorage.getItem("backgroundColor");
  remainingSessions = localStorage.getItem("remainingSessions");
} else {
  // if no data is stored in local storage then it is the first time user visited the site
  // or the user cleared his browser chache
  // showTutorial()
  // save default settings
  saveSettings();
  localStorage.setItem("remainingSessions", remainingSessions);
}

// Set to stored time
function updateTime(min, sec) {
  MINUTES_TEXT.innerText = min;
  SECONDS_TEXT.innerText = sec;
}

updateTime(workTime, "0");

updateTheme();

// Keep the text in dual digit always
function makeDualDigit() {
  if (SECONDS_TEXT.innerText.length == 1) {
    SECONDS_TEXT.innerText = 0 + SECONDS_TEXT.innerText;
  }
  if (MINUTES_TEXT.innerText.length == 1) {
    MINUTES_TEXT.innerText = 0 + MINUTES_TEXT.innerText;
  }
}
makeDualDigit();

REMAINING_SESSIONS.innerHTML = `SESSIONS: ${remainingSessions}`;

function startTimer(ColorChange = true) {
  timing = !timing;
  // change icon for pause play button
  if (timing) {
    START_TIMER.innerHTML = `<i class="fas fa-pause"></i>`;
    if (ColorChange) {
      console.log("color change");
      TIMER_ITEM.style.color = "var(--primary-color)";
    }
    loop();
  } else {
    START_TIMER.innerHTML = `<i class="fas fa-play"></i>`;
    if (ColorChange) {
      console.log("color change");
      TIMER_ITEM.style.color = "var(--paused-color)";
    }
  }
}

// Timer start and pause on click
TIMER_ITEM.onclick = () => {
  startTimer();
  hideBreakEndMessage();
  hideWorkEndMessage();
};

START_TIMER.onclick = () => {
  startTimer();
  hideBreakEndMessage();
  hideWorkEndMessage();
};

// Timer loop
function loop() {
  setTimeout(() => {
    if (timing) {
      if (SECONDS_TEXT.innerText != 0) {
        SECONDS_TEXT.innerText--;
        // Keep the text in dual digit always
        makeDualDigit();
      } else {
        SECONDS_TEXT.innerText = 59;
        if (MINUTES_TEXT.innerText != 0) {
          MINUTES_TEXT.innerText--;
          // Keep the text in dual digit always
          makeDualDigit();
        } else {
          // start break
          if (!breakRunning) {
            // pause if not auto break
            if (!JSON.parse(autoBreak)) {
              WORK_END_MESSAGE.style.display = "block";
              setTimeout(() => {
                WORK_END_MESSAGE.style.opacity = 1;
              }, 100);
              startTimer(false);
              SECONDS_TEXT.innerText = 0;
            }
            MINUTES_TEXT.innerText = breakTime;
            manageSessions();
            breakRunning = true;
            TIME_TYPE.innerText = "BREAK TIME";
            makeDualDigit();
          } else {
            // pause if not auto work
            if (!JSON.parse(autoWork)) {
              BREAK_END_MESSAGE.style.display = "block";
              setTimeout(() => {
                BREAK_END_MESSAGE.style.opacity = 1;
              }, 100);
              startTimer(false);
              SECONDS_TEXT.innerText = 0;
            }
            MINUTES_TEXT.innerText = workTime;
            breakRunning = false;
            TIME_TYPE.innerText = "WORK TIME";
            makeDualDigit();
          }
        }
      }
      loop(); // call it self to loop
    }
  }, 1000); // run every 1000ms or 1s
}

function manageSessions() {
  remainingSessions = String(parseInt(remainingSessions) - 1);
  if (remainingSessions < 1) {
    remainingSessions = 4;
    MINUTES_TEXT.innerHTML = longBreakTime;
  }
  REMAINING_SESSIONS.innerHTML = `SESSIONS: ${remainingSessions}`;
  localStorage.setItem("remainingSessions", remainingSessions);
}

// save settings variables to local storage
function saveSettings() {
  localStorage.setItem("breakTime", breakTime);
  localStorage.setItem("longBreakTime", longBreakTime);
  localStorage.setItem("workTime", workTime);
  localStorage.setItem("soundToggle", soundToggle);
  localStorage.setItem("autoWork", autoWork);
  localStorage.setItem("autoBreak", autoBreak);
  localStorage.setItem("primaryColor", primaryColor);
  localStorage.setItem("mutedColor", mutedColor);
  localStorage.setItem("secondaryColor", secondaryColor);
  localStorage.setItem("backgroundColor", backgroundColor);
}

// update settings values with saved values
function updateSettingsValues() {
  WORK_TIME_BOX.value = workTime;
  BREAK_TIME_BOX.value = breakTime;
  LONG_BREAK_TIME_BOX.value = longBreakTime;
  // the booleans are stored in string because of local storage so we have to cast them to bool
  SOUND_TOGGLE_BOX.checked = JSON.parse(soundToggle);
  AUTO_WORK_TOGGLE_BOX.checked = JSON.parse(autoWork);
  AUTO_BREAK_TOGGLE_BOX.checked = JSON.parse(autoBreak);
  COLOR_PICKER1.value = COLOR_PICKER_BG1.style.background = primaryColor;
  COLOR_PICKER2.value = COLOR_PICKER_BG2.style.background = mutedColor;
  COLOR_PICKER3.value = COLOR_PICKER_BG3.style.background = secondaryColor;
  COLOR_PICKER4.value = COLOR_PICKER_BG4.style.background = backgroundColor;
}

// show settings menu
SETTINGS_BUTTON.onclick = () => {
  // update settings values with saved values
  updateSettingsValues();
  SETTINGS_MENU.style.display = "flex";
  setTimeout(() => {
    SETTINGS_MENU.style.opacity = "1";
  }, 1);
};

// hide settings menu
SETTINGS_CANCEL.onclick = () => {
  SETTINGS_MENU.style.opacity = "0";
  setTimeout(() => {
    SETTINGS_MENU.style.display = "none";
  }, 400);
};

// save settings
SETTINGS_SAVE.onclick = () => {
  // hide settings menu
  SETTINGS_MENU.style.opacity = "0";
  setTimeout(() => {
    SETTINGS_MENU.style.display = "none";
  }, 400);

  // save
  // set variables
  workTime = WORK_TIME_BOX.value;
  breakTime = BREAK_TIME_BOX.value;
  soundToggle = SOUND_TOGGLE_BOX.checked;
  autoBreak = AUTO_BREAK_TOGGLE_BOX.checked;
  autoWork = AUTO_WORK_TOGGLE_BOX.checked;
  primaryColor = COLOR_PICKER1.value;
  mutedColor = COLOR_PICKER2.value;
  secondaryColor = COLOR_PICKER3.value;
  backgroundColor = COLOR_PICKER4.value;

  // save settings to local storage
  saveSettings();

  // update the colors
  updateTheme();
  // update time
  if (breakRunning) {
    updateTime(breakTime, "0");
    makeDualDigit();
  } else {
    updateTime(workTime, "0");
    makeDualDigit();
  }
};

// change colors
function updateTheme() {
  ROOT.style.setProperty("--primary-color", primaryColor);
  ROOT.style.setProperty("--paused-color", mutedColor);
  ROOT.style.setProperty("--secondary-color", secondaryColor);
  ROOT.style.setProperty("--bg-color", backgroundColor);
}

// set color-picker-bg color to picked color
COLOR_PICKER1.oninput = () => {
  COLOR_PICKER_BG1.style.background = COLOR_PICKER1.value;
};
COLOR_PICKER2.oninput = () => {
  COLOR_PICKER_BG2.style.background = COLOR_PICKER2.value;
};
COLOR_PICKER3.oninput = () => {
  COLOR_PICKER_BG3.style.background = COLOR_PICKER3.value;
};
COLOR_PICKER4.oninput = () => {
  COLOR_PICKER_BG4.style.background = COLOR_PICKER4.value;
};

// add one minute to the timer
ADD_TIME_BUTTON.onclick = () => {
  MINUTES_TEXT.innerHTML = parseInt(MINUTES_TEXT.innerHTML) + 1;
  makeDualDigit();
};

// skip current session
SKIP_BUTTON.onclick = () => {
  hideBreakEndMessage();
  hideWorkEndMessage();
  // setting to 0 min 0 sec will end the current session
  MINUTES_TEXT.innerHTML = "00";
  SECONDS_TEXT.innerHTML = "00";
  // start the timer if it is paused
  if (!timing) {
    startTimer();
  }
};

RESET_BUTTON.onclick = () => {
  timing = false;

  hideWorkEndMessage();
  hideBreakEndMessage();

  remainingSessions = 5; // manageSessions() deducts one so 5-1 = 4
  manageSessions();
  TIMER_ITEM.style.color = "var(--primary-color)";
  START_TIMER.innerHTML = `<i class="fas fa-play"></i>`;
  updateTime(workTime, "0");
  breakRunning = false;
  TIME_TYPE.innerText = "WORK TIME";
  makeDualDigit();
};

function updateLocalTime() {
  var time = new Date().toLocaleTimeString();
  LOCAL_TIME.innerHTML = time;
  setTimeout(updateLocalTime, 1000);
}

updateLocalTime();

SETTINGS_RESET_BTN.onclick = () => {
  // hide settings menu
  SETTINGS_MENU.style.opacity = "0";
  setTimeout(() => {
    SETTINGS_MENU.style.display = "none";
  }, 400);

  // set local storage values to default
  localStorage.setItem("breakTime", 5);
  localStorage.setItem("longBreakTime", 15);
  localStorage.setItem("workTime", 25);
  localStorage.setItem("soundToggle", "true");
  localStorage.setItem("autoWork", "false");
  localStorage.setItem("autoBreak", "false");
  localStorage.setItem("primaryColor", "#b999a3");
  localStorage.setItem("mutedColor", "#746571");
  localStorage.setItem("secondaryColor", "#a589a0");
  localStorage.setItem("backgroundColor", "#252335");

  // refresh the page
  window.location.reload();
};

// hide messages on click

function hideWorkEndMessage() {
  WORK_END_MESSAGE.style.opacity = 0;
  setTimeout(() => {
    WORK_END_MESSAGE.style.display = "none";
  }, 300);
}

function hideBreakEndMessage() {
  BREAK_END_MESSAGE.style.opacity = 0;
  setTimeout(() => {
    BREAK_END_MESSAGE.style.display = "none";
  }, 300);
}

WORK_END_MESSAGE.onclick = () => {
  hideWorkEndMessage();
};
BREAK_END_MESSAGE.onclick = () => {
  hideBreakEndMessage();
};
