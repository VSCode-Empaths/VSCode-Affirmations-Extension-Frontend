const vscode = require("vscode");
const { fetchAffirmations } = require("./fetch-utils.js");

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
    // Constants
    // const AFFIRMATION_INTERVAL = 1000 * 60 * 15; // ms * s * m
    const AFFIRMATION_INTERVAL = 1000; // ms * s * m
    let CAT_IDS = {
        DAILY: 1,
        ERROR: 2,
        TDD: 3,
        WTGO: 4,
    };
    // State Variables
    const affirmations = await fetchAffirmations();
    let timer = null;

    // Display affirmation on page load
    displayRandAffirmationByCat(affirmations, CAT_IDS.DAILY);

    // Display affirmations on command
    let errorCommand = vscode.commands.registerCommand(
        "error_affirmations.getAffirmation(error)",
        () => displayRandAffirmationByCat(affirmations, CAT_IDS.DAILY)
    );
    let tddCommand = vscode.commands.registerCommand("error_affirmations.getAffirmation(TDD)", () =>
        displayRandAffirmationByCat(affirmations, CAT_IDS.TDD)
    );
    let willCommand = vscode.commands.registerCommand(
        "error_affirmations.getAffirmation(WTGO)",
        () => displayRandAffirmationByCat(affirmations, CAT_IDS.WTGO)
    );
    let setTimerOn = vscode.commands.registerCommand("error_affirmations.setTimerOn", () => {
        // Set timer and call affirmation on timerTick
        timer = setInterval(
            displayRandAffirmationByCat,
            AFFIRMATION_INTERVAL,
            affirmations,
            CAT_IDS.DAILY
        );
    });
    let setTimerOff = vscode.commands.registerCommand("error_affirmations.setTimerOff", () => {
        // Clear timer
        clearInterval(timer);
    });

    context.subscriptions.push(errorCommand, tddCommand, willCommand, setTimerOn, setTimerOff);
}

// This method is called when your extension is deactivated
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
