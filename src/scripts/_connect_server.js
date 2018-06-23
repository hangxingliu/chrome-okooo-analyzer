//@ts-check

/*
	Connect to database server (communicate with Chrome extension backend)

	连接 Chrome 插件数据后端
*/

import { logOnPage, LOG_ERROR } from "./_log_on_page";


/** @type {chrome.runtime.Port} */
let connection = null;
let requestServerId = 1;

/** @type {{[id: string]: {resolve: Function; reject: Function}}} */
const responseListener = {};

export function requestServer(name, ...params) {
	if (!connection)
		return logOnPage(`Chrome 插件连接为空! (${connection})`, LOG_ERROR),
			Promise.reject(new Error('connection is falsy!'));

	const id = requestServerId++;
	setTimeout(() => {
		console.log(`connection.postMessage({ id: ${id}, name: "${name}"})`);
		connection.postMessage({ id, name, params })
	}, 15);
	return new Promise((resolve, reject) => { responseListener[id] = { resolve, reject }; });
}

function onServerResponse(response) {
	if (!response || !response.id) return console.log(`Ignore invalid response: `, response);

	console.log(`onServerResponse({id: ${response.id}})`);
	console.log(response);
	if (response.id in responseListener) {
		const context = responseListener[response.id];
		delete responseListener[response.id];

		if (response.error) return context.reject(response.error);
		context.resolve(response.result);
	}
}

export function initServerConnection() {
	connection = chrome.runtime.connect({ name: "okooo-db" });
	connection.onMessage.addListener(onServerResponse);
	window['toServer'] = connection; // export for debug (方便调试)
}
