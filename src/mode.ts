import * as vscode from "vscode";

import { configuration } from "./configuration";

const defaultMode = false;

const state = {
    global: defaultMode,
    perEditor: new WeakMap<vscode.TextEditor, boolean>(),
};

export function getMode(textEditor: vscode.TextEditor) {
    if (!configuration.perEditor) {
        return state.global;
    }

    if (!state.perEditor.has(textEditor)) {
        state.perEditor.set(textEditor, defaultMode);
    }

    return <boolean> state.perEditor.get(textEditor);
}

export function toggleMode(textEditor: vscode.TextEditor) {
    let overtype = !getMode(textEditor);

    if (!configuration.perEditor) {
        state.global = overtype;
    } else {
        state.perEditor.set(textEditor, overtype);
    }

    return overtype;
}

export function resetModes(mode: boolean | null, perEditor: boolean) {
    if (mode === null) { mode = defaultMode; }

    if (perEditor) {
        // when switching from global to per-editor, reset the global mode to default
        // and (currently impossible) set all editors to the provided mode

        // future: this should enumerate all open editors and set their mode explicitly
        // tracking: https://github.com/Microsoft/vscode/issues/15178

        state.global = defaultMode;
        state.perEditor = state.perEditor = new WeakMap<vscode.TextEditor, boolean>();
    } else {
        // when switching from per-editor to global, set the global mode to the
        // provided mode and reset all per-editor modes

        state.global = mode;
        state.perEditor = state.perEditor = new WeakMap<vscode.TextEditor, boolean>();
    }
}
