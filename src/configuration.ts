import * as vscode from 'vscode';

export const configuration = loadConfiguration();

function loadConfiguration() {
    const overtypeConfiguration = vscode.workspace.getConfiguration("overtype");
    const editorConfiguration = vscode.workspace.getConfiguration("editor");

    return {
        abbreviatedStatus: overtypeConfiguration.get<boolean>("abbreviatedStatus"),
        paste: overtypeConfiguration.get<boolean>("paste"),
        perEditor: overtypeConfiguration.get<boolean>("perEditor"),

        defaultCursorStyle: (() => {
            switch (editorConfiguration.get<string>("cursorStyle")) {
                case "line": return vscode.TextEditorCursorStyle.Line;
                case "block": return vscode.TextEditorCursorStyle.Block;
                case "underline": return vscode.TextEditorCursorStyle.Underline;
                default: return vscode.TextEditorCursorStyle.Line;
            }
        })()
    };
}

export function reloadConfiguration() {
    const newConfiguration = loadConfiguration();

    // bail out if nothing changed
    if (configuration.abbreviatedStatus === newConfiguration.abbreviatedStatus &&
        configuration.paste === newConfiguration.paste &&
        configuration.perEditor === newConfiguration.perEditor &&
        configuration.defaultCursorStyle === newConfiguration.defaultCursorStyle) {
        return false;
    }

    configuration.abbreviatedStatus = newConfiguration.abbreviatedStatus;
    configuration.paste = newConfiguration.paste;
    configuration.perEditor = newConfiguration.perEditor;
    configuration.defaultCursorStyle = newConfiguration.defaultCursorStyle;

    return true;
}
