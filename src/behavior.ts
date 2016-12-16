import * as vscode from "vscode";

export function overtypeBeforeType(editor: vscode.TextEditor, text: string) {
    // skip overtype behavior when enter is pressed
    if (text == "\r" || text == "\n" || text == "\r\n") {
        return;
    }

    editor.selections = editor.selections.map(selection => {
        const cursorPosition = selection.start;
        const lineEndPosition = editor.document.lineAt(cursorPosition).range.end;

        if (selection.isEmpty && cursorPosition.character !== lineEndPosition.character) {
            const replaceEnd = cursorPosition.with(cursorPosition.line, cursorPosition.character + 1);
            const replaceSelection = new vscode.Selection(cursorPosition, replaceEnd);

            return replaceSelection;
        } else {
            return selection;
        }
    });
}

export function overtypeBeforePaste(editor: vscode.TextEditor, text: string, pasteOnNewLine: boolean) {
    editor.selections = editor.selections.map(selection => {
        if (pasteOnNewLine) {
            // highlight and replace all the selected lines

            const startPosition = editor.document.lineAt(selection.start).rangeIncludingLineBreak.start;
            let endPosition = editor.document.lineAt(selection.end).rangeIncludingLineBreak.end;

            if (startPosition.isEqual(endPosition)) {
                endPosition = endPosition.translate(1);
            }

            return new vscode.Selection(startPosition, endPosition);
        } else {
            // highlight the paste length or the end of the line, whichever's smaller

            const selectionStartOffset = editor.document.offsetAt(selection.start);
            const selectionEndOffset = editor.document.offsetAt(selection.end);
            const selectionLength = selectionEndOffset - selectionStartOffset;

            const lineEndOffset = editor.document.offsetAt(editor.document.lineAt(selection.end).range.end);
            const lineEndLength = lineEndOffset - selectionStartOffset;

            const hasNewLine = text.indexOf("\r") != -1 || text.indexOf("\n") != -1;
            const newSelectionLength = Math.max(hasNewLine ? lineEndLength : Math.min(lineEndLength, text.length), selectionLength);
            const newSelectionEndPosition = editor.document.positionAt(selectionStartOffset + newSelectionLength);

            return new vscode.Selection(selection.start, newSelectionEndPosition);
        }
    });
}
