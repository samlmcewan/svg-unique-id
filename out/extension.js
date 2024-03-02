"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
function activate(context) {
    const assignUniqueIdsCommand = vscode.commands.registerCommand('svgUniqueIds.assignUniqueIds', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor || editor.document.languageId !== 'html') {
            return; // Only run in HTML files
        }
        const document = editor.document;
        const text = document.getText();
        let uniqueIdCounter = 0;
        // Function to generate unique IDs
        function generateUniqueID() {
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
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
