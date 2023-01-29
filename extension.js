const vscode = require("vscode");
const { fetchAffirmations } = require("./fetch-utils.js");

/**
 * @param {vscode.ExtensionContext} context
 */

/* CONSTANTS */
const onCommand = vscode.commands.registerCommand;
const MINUTE = 1000 * 60; // ms * s
const TIMER_INTERVAL_OPTIONS = ["10 min", "15 min", "30 min", "60 min"];
const ERROR_COMMAND = "error_affirmations.getAffirmation(error)";
const TDD_COMMAND = "error_affirmations.getAffirmation(TDD)";
const WTGO_COMMAND = "error_affirmations.getAffirmation(WTGO)";
const TIMER_ON_COMMAND = "error_affirmations.setTimerOn";
const TIMER_OFF_COMMAND = "error_affirmations.setTimerOff";
const CAT_IDS = {
    DAILY: 1,
    ERROR: 2,
    TDD: 3,
    WTGO: 4,
};

// Main logic (Runs when extension is loaded up)
async function activate(context) {
    /* STATE */
    const affirmations = await fetchAffirmations();
    let timer = null;
    let timerInterval = null;

    // Exit if we don't have any affirmations 😢
    if (!affirmations) return;

    // Display initial affirmation on page load
    displayRandAffirmationByCat(affirmations, CAT_IDS.DAILY);

    // Display affirmations by category, on command
    const errorCommand = onCommand(ERROR_COMMAND, () =>
        displayRandAffirmationByCat(affirmations, CAT_IDS.ERROR)
    );
    const tddCommand = onCommand(TDD_COMMAND, () =>
        displayRandAffirmationByCat(affirmations, CAT_IDS.TDD)
    );
    const willCommand = onCommand(WTGO_COMMAND, () =>
        displayRandAffirmationByCat(affirmations, CAT_IDS.WTGO)
    );

    // Display affirmations on a timer
    const setTimerOn = onCommand(TIMER_ON_COMMAND, async () => {
        // Get time interval from user
        const selectedInterval = await promptForTimeInterval();

        // Check if valid input
        if (!isValidTimeInterval(selectedInterval)) return;

        // Parse out number from input
        const parsedInterval = parseTimeInterval(selectedInterval);

        // Set as new timerInterval (to be reused as default timer setting)
        timerInterval = MINUTE * parsedInterval;

        // Clear any existing timer
        if (timer) clearInterval(timer);

        vscode.window.showInformationMessage(
            `Receiving Affirmations Every: ${parsedInterval} minutes 💕`
        );

        // Set timer and call affirmation on timerTick
        timer = setInterval(() => {
            displayRandAffirmationByCat(affirmations, CAT_IDS.DAILY);
        }, timerInterval);
    });
    const setTimerOff = onCommand(TIMER_OFF_COMMAND, () => {
        // Clear timer
        if (timer) clearInterval(timer);
    });

    context.subscriptions.push(errorCommand, tddCommand, willCommand, setTimerOn, setTimerOff);
}

// This method is called when extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate,
};

function displayRandAffirmationByCat(affirmations, catId) {
    const filteredAffirmations = filterAffirmations(affirmations, catId);
    const selectedAffirmation = getRandAffirmation(filteredAffirmations);
    displayAffirmation(selectedAffirmation);
}

function filterAffirmations(affirmations, catId) {
    // Select all affirmations with matching catId
    return affirmations.filter((row) => row.category_id == catId);
}

function getRandAffirmation(affirmations) {
    // Create random index within bounds of affirmations arr
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    // Return text of random affirmation
    return affirmations[randomIndex].text;
}

function displayAffirmation(affirmation) {
    vscode.window.showInformationMessage(affirmation);
}

async function promptForTimeInterval() {
    const quickPickOptions = {
        placeHolder: "Select a time interval:",
    };
    const selection = await vscode.window.showQuickPick(TIMER_INTERVAL_OPTIONS, quickPickOptions);

    return selection;
}

function isValidTimeInterval(selectedInterval) {
    // Validate input by ensuring it exists and matches one of the TIMER_INTERVAL_OPTIONS
    return selectedInterval || TIMER_INTERVAL_OPTIONS.includes(selectedInterval);
}

function parseTimeInterval(selectedInterval) {
    // Parse selectedTimeInterval string to get numbers
    // ex: '15 min' becomes '15'
    const subStr = selectedInterval.substring(0, selectedInterval.indexOf(" "));
    // Turn string into actual number
    return parseInt(subStr);
}
