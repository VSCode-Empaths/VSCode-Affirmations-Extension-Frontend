// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const { fetchAffirmations, fetchCategories } = require("./fetch-utils.js");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "VSCCode-Error-Affirmations" is now active!'
  );

  // TODO FETCH ALL Affirmations by category.id (1 - Daily)
  const affirmations = await fetchAffirmations();
  const dailyAffirmations = affirmations.filter((row) => row.category_id == 1);
  const randomNumber = Math.floor(Math.random() * dailyAffirmations.length);
  vscode.window.showInformationMessage(dailyAffirmations[randomNumber].text);
  console.log(dailyAffirmations[randomNumber]);

  // TODO get length of Affirmations
  // TODO get random num within length of affirmations
  // TODO get affirmation by index of random num

  // const randomNumber = Math.floor(Math.random() * 10);
  // const affirmations = await fetchAffirmations();
  // vscode.window.showInformationMessage(affirmations[randomNumber].text);

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = await vscode.commands.registerCommand(
    "helloworld.helloWorld",
    async function () {
      // The code you place here will be executed every time your command is executed
      const affirmations = await fetchAffirmations();

      const randomNumber = Math.floor(Math.random() * 10);

      // Display a message box to the user
      vscode.window.showInformationMessage(affirmations[randomNumber].text);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
