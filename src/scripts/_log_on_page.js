//@ts-check

/** @type {HTMLDivElement} */
let logContainer = null;

const className = '__okooo_analyzer_log_container__';

export function initLogOnPage() {
	if (logContainer) return;

	logContainer = document.createElement('div');
	logContainer.setAttribute('class', className);
	logContainer.setAttribute('style', `position: absolute; right: 5px; top: 25px; z-index: 1024; text-align: right;`);
	document.body.appendChild(logContainer);

	const styleEl = document.createElement('style');
	styleEl.type = 'text/css';
	styleEl.appendChild(document.createTextNode(`
		.${className} { opacity: .5; }
		.${className}:hover { opacity: 1; }
	`));
	document.head.appendChild(styleEl);

	logOnPage('Okoo Analyzer initialized!', 888);
}

export const LOG_ERROR = 1;
export function logOnPage(content, isError = 0) {
	const consoleOut = `Okooo Analyzer: ${content}`;
	if (isError === LOG_ERROR) console.error(consoleOut);
	else console.log(consoleOut);

	if (!logContainer) return;

	const el = document.createElement('div');
	let bg = isError === LOG_ERROR ? '#cf1322' : '#006d75';
	if (isError === 888) bg = '#389e0d; font-weight: bold';

	el.setAttribute('style', `color: #fafafa; background: ${bg}; padding: 0 5px; margin: 0 0 2px 0;`);
	el.innerText = content;

	logContainer.appendChild(el);
}
