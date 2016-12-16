import * as vscode from "vscode";

import { configuration } from "./configuration";

let statusBarItem: vscode.StatusBarItem | null;

export function createStatusBarItem() {
    if (statusBarItem != null) return statusBarItem;

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    statusBarItem.show();

    updateStatusBarItem(null);

    return statusBarItem;
}

export function destroyStatusBarItem() {
    if (statusBarItem == null) return;

    statusBarItem.hide();
    statusBarItem = null;
}

export function updateStatusBarItem(overtype: boolean | null) {
    if (statusBarItem == null) return;

    if (overtype === null) {
        statusBarItem.text = "";
        statusBarItem.tooltip = "";

        statusBarItem.hide();
    } else if (overtype) {
        statusBarItem.text = configuration.abbreviatedStatus ? "OVR" : "Overtype";
        statusBarItem.tooltip = "Overtype Mode"

        statusBarItem.show();
    } else {
        statusBarItem.text = configuration.abbreviatedStatus ? "INS" : "Insert";
        statusBarItem.tooltip = "Insert Mode"

        statusBarItem.show();
    }
}
