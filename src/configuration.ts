import * as vscode from "vscode";

export const configuration = loadConfiguration();

function loadConfiguration() {
    const overtypeConfiguration = vscode.workspace.getConfiguration("overtype");
    const editorConfiguration = vscode.workspace.getConfiguration("editor");

    return {
        abbreviatedStatus: overtypeConfiguration.get<boolean>("abbreviatedStatus"),
        paste: overtypeConfiguration.get<boolean>("paste"),
        perEditor: overtypeConfiguration.get<boolean>("perEditor"),

        // tslint:disable-next-line:object-literal-sort-keys
        defaultCursorStyle: (() => {
            switch (editorConfiguration.get<string>("cursorStyle")) {
                case "line": return vscode.TextEditorCursorStyle.Line;
                case "line-thin": return vscode.TextEditorCursorStyle.LineThin;
                case "block": return vscode.TextEditorCursorStyle.Block;
                case "block-outline": return vscode.TextEditorCursorStyle.BlockOutline;
                case "underline": return vscode.TextEditorCursorStyle.Underline;
                case "underline-thin": return vscode.TextEditorCursorStyle.UnderlineThin;
                default: return vscode.TextEditorCursorStyle.Line;
            }
        })(),
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
