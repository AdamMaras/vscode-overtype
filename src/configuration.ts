import * as vscode from "vscode";

export const configuration = loadConfiguration();

function stringToCursorStyle(config: vscode.WorkspaceConfiguration, style: string, def: vscode.TextEditorCursorStyle) {
    switch (config.get<string>(style)) {
        case "line": return vscode.TextEditorCursorStyle.Line;
        case "line-thin": return vscode.TextEditorCursorStyle.LineThin;
        case "block": return vscode.TextEditorCursorStyle.Block;
        case "block-outline": return vscode.TextEditorCursorStyle.BlockOutline;
        case "underline": return vscode.TextEditorCursorStyle.Underline;
        case "underline-thin": return vscode.TextEditorCursorStyle.UnderlineThin;
        default: return def;
    }
}

function loadConfiguration() {
    const overtypeConfiguration = vscode.workspace.getConfiguration("overtype");
    const editorConfiguration = vscode.workspace.getConfiguration("editor");

    return {
        abbreviatedStatus: overtypeConfiguration.get<boolean>("abbreviatedStatus"),
        showInStatusBar: overtypeConfiguration.get<boolean>("showInStatusBar"),
        paste: overtypeConfiguration.get<boolean>("paste"),
        perEditor: overtypeConfiguration.get<boolean>("perEditor") ? true : false,

        // tslint:disable-next-line:object-literal-sort-keys
        defaultCursorStyle: (() => {
            return stringToCursorStyle(editorConfiguration, "cursorStyle",
            vscode.TextEditorCursorStyle.Block);
        })(),

        // Get the user defined cursor style for overtype mode
        secondaryCursorStyle: (() => {
            return stringToCursorStyle(overtypeConfiguration, "secondaryCursorStyle",
             vscode.TextEditorCursorStyle.Line);
        })(),
    };
}

export function reloadConfiguration() {
    const newConfiguration = loadConfiguration();

    // bail out if nothing changed
    if (configuration.showInStatusBar === newConfiguration.showInStatusBar &&
        configuration.abbreviatedStatus === newConfiguration.abbreviatedStatus &&
        configuration.paste === newConfiguration.paste &&
        configuration.perEditor === newConfiguration.perEditor &&
        configuration.defaultCursorStyle === newConfiguration.defaultCursorStyle &&
        configuration.secondaryCursorStyle === newConfiguration.secondaryCursorStyle) {
        return false;
    }

    configuration.showInStatusBar = newConfiguration.showInStatusBar;
    configuration.abbreviatedStatus = newConfiguration.abbreviatedStatus;
    configuration.paste = newConfiguration.paste;
    configuration.perEditor = newConfiguration.perEditor;
    configuration.defaultCursorStyle = newConfiguration.defaultCursorStyle;
    configuration.secondaryCursorStyle = newConfiguration.secondaryCursorStyle;

    return true;
}
