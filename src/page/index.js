//@ts-check
/// <reference path="./monaco.d.ts" />
import { tbMatches } from "../scripts/database/core";

window['onMonacoEditorLoaded'] = onMonacoEditorLoaded;
window['tbMatches'] = tbMatches;

function onMonacoEditorLoaded() {
	//eslint-disable-next-line
	const editor = monaco.editor.create($('#monacoEditor')[0], {
		value: '',
		language: 'javascript',
		automaticLayout: true
	});

	$('#btnRun').click(() => {
		const coreCode = editor.getValue();
		const func = new Function(coreCode);
		func();
		// console.log(coreCode)
	});
}
