require.config({
	paths: {
		'vs': '../../libs/monaco-0.13.1/min/vs'
	}
});
require(['vs/editor/editor.main'], function () {
	if ('onMonacoEditorLoaded' in window)
		window['onMonacoEditorLoaded']();
});
