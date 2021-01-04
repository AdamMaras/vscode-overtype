import * as vscode from "vscode";

import { overtypeBeforePaste, overtypeBeforeType } from "./behavior";
import { configuration, reloadConfiguration } from "./configuration";
import { getMode, resetModes, toggleMode } from "./mode";
import { createStatusBarItem, destroyStatusBarItem, updateStatusBarItem } from "./statusBarItem";

// initialization //////////////////////////////////////////////////////////////

export function activate(context: vscode.ExtensionContext) {
    const statusBarItem = createStatusBarItem();
    activeTextEditorChanged();

    context.subscriptions.push(
        vscode.commands.registerCommand("overtype.toggle", toggleCommand),

        vscode.commands.registerCommand("type", typeCommand),
        vscode.commands.registerCommand("paste", pasteCommand),

        vscode.window.onDidChangeActiveTextEditor(activeTextEditorChanged),

        vscode.workspace.onDidChangeConfiguration(onDidChangeConfiguration),

        statusBarItem,
    );
}

export function deactivate() {
    destroyStatusBarItem();
}

// command handlers ////////////////////////////////////////////////////////////

function activeTextEditorChanged(textEditor?: vscode.TextEditor) {
    if (textEditor === undefined) {
        textEditor = vscode.window.activeTextEditor;
    }

    if (textEditor == null) {
        updateStatusBarItem(null);
    } else {
        const mode = getMode(textEditor);
        updateStatusBarItem(mode);

        // if in overtype mode, set the cursor to secondary style; otherwise, reset to default
        textEditor.options.cursorStyle = mode
            ? configuration.secondaryCursorStyle
            : configuration.defaultCursorStyle;
    }
}

function toggleCommand() {
    const textEditor = vscode.window.activeTextEditor;
    if (textEditor == null) {
        return;
    }

    toggleMode(textEditor);
    activeTextEditorChanged(textEditor);
}

function onDidChangeConfiguration() {
    const previousPerEditor = configuration.perEditor;
    const previousShowInStatusBar = configuration.showInStatusBar;

    const updated = reloadConfiguration();
    if (!updated) { return; }

    // post create / destroy when changed
    if (configuration.showInStatusBar !== previousShowInStatusBar) {
        if (configuration.showInStatusBar) {
            createStatusBarItem();
        } else {
            destroyStatusBarItem();
        }
    }

    // update state if the per-editor/global configuration option changes
    if (configuration.perEditor !== previousPerEditor) {

        const textEditor = vscode.window.activeTextEditor;
        const mode = textEditor != null ? getMode(textEditor) : null;
        resetModes(mode, configuration.perEditor);
    }

    activeTextEditorChanged();
}

function shouldPerformOvertype() {
    if (!vscode.window.activeTextEditor) { return false; }

    const editor = vscode.window.activeTextEditor;
    const mode = getMode(editor);

    return mode;
}

function typeCommand(args: { text: string }) {
    if (shouldPerformOvertype()) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            overtypeBeforeType(editor, args.text);
        }
    }

    return vscode.commands.executeCommand("default:type", args);
}

function pasteCommand(args: { text: string, pasteOnNewLine: boolean }) {
    if (configuration.paste && shouldPerformOvertype()) {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            overtypeBeforePaste(editor, args.text, args.pasteOnNewLine);
        }
    }

    return vscode.commands.executeCommand("default:paste", args);
}
