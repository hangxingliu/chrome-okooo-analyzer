import { bulkUpdate, updateOne } from "../database/edit";
import { query, count, queryTypes } from "../database/query";

chrome.browserAction.onClicked.addListener(() =>
	chrome.tabs.create({ url: chrome.extension.getURL('/dist/page/index.html') }));

chrome.runtime.onConnect.addListener(port => {
	if (port.name != "okooo-db") {
		console.error(`unknown connection with name: ${port.name}`);
		return port.disconnect();
	}
	console.log('okooo-db connection established');

	port.onDisconnect.addListener(() => { console.log('okooo-db connection disconnected'); });
	port.onMessage.addListener(actionHandler.bind(this, port));
});
window['debugAction'] = (name, params) => actionHandler(null, { name, params, id: 0 });
console.log('okooo analyzer background started!');

function actionHandler(port, action) {
	//@ts-ignore
	let { name, params, id } = action;
	console.log(params)
	if (!Array.isArray(params))
		params = typeof params === 'undefined' ? [] : [params];

	console.log(`[${id}] connection message: ${name}(${displayParams(params)})`);
	let flow = null;
	switch (name) {
		case 'count': flow = count(...params); break;
		case 'bulk-update': flow = bulkUpdate(...params); break;
		case 'update': flow = updateOne(...params); break;
		case 'query': flow = query(...params); break;
		case 'all-types': flow = queryTypes(...params); break;
		default: console.warn(`unknown message name "${name}"`);
	}
	if (flow) flow.then(onResult).catch(onError);

	function onResult(result) {
		console.log(result);
		if (port)
			port.postMessage({ id, result });
	}
	function onError(error) {
		if (!error) return;
		const message = error.message || String(error);
		console.error(`[${id}] error: ${message}`);
		console.error(error.stack || error);
		if (port)
			port.postMessage({ id, error: message });
	}
}

/** @param {any[]} params */
function displayParams(params) {
	return params.map(p => {
		if (Array.isArray(p)) return `[array ${p.length}]`;
		return JSON.stringify(p);
	}).join(', ');
}
