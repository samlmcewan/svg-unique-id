import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const assignUniqueIdsCommand = vscode.commands.registerCommand('svgUniqueIds.assignUniqueIds', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'html') {
      return; // Only run in HTML files
    }

    const document = editor.document;
    const text = document.getText();
    
    let uniqueIdCounter = 0;

    // Function to generate unique IDs
    function generateUniqueID(): string {
     // Combine counter, timestamp, and random characters for increased uniqueness
  const prefix = `svg-id-${uniqueIdCounter++}-${Date.now().toString(36)}`;
  let randomString = '';
  for (let i = 0; i < 5; i++) {
    randomString += Math.random().toString(36).substring(2); // Use random part of base 36 conversion
  }
  return prefix + randomString;
    }

    // Use a regular expression to find SVG elements
    const svgRegex = /<svg(\s+[^>]*?)>/g;
    const matches = text.match(svgRegex);

    if (!matches) {
      vscode.window.showInformationMessage('No SVG elements found');
      return;
    }

    const updatedText = text.replace(svgRegex, (match, attributes) => {
      const id = generateUniqueID();
      return `<svg id="${id}" ${attributes}>`; // Add unique ID to opening tag
    });

    // Update the document with unique IDs
    editor.edit(editBuilder => {
      editBuilder.replace(new vscode.Range(document.positionAt(0), document.positionAt(text.length)), updatedText);
    });

    vscode.window.showInformationMessage('Unique IDs assigned to SVG elements and their children');
  });

  context.subscriptions.push(assignUniqueIdsCommand);
}

export function deactivate() {}