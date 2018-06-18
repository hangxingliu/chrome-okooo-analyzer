//@ts-check

import { $ } from "./_dom_utils";

export function assertFailed(context, message) {
	console.error(`Okooo Analyzer: Assert Failed! (${context})`);
	console.error(`  message: ${message}`);
}

/** @param {HTMLElement|HTMLDocument} [page] */
export function getDateStringFromPage(page) {
	if (!page) page = document;

	const failed = assertFailed.bind(this, 'getDateStringFromPage');
	const $date = $('#ChangeDate', page);
	if (!$date)
		return failed(`#changeDate is missing!`);

	const attrTime = $date.getAttribute('data-time');
	if (!attrTime)
		return failed(`data-time is missing in #changeDate!`);

	const time = parseInt(attrTime, 10);
	if (isNaN(time))
		return failed(`'${attrTime}' is not a integer`);

	const TIMEZONE_OFFSET = 8; // China Standard Time (CST)
	const dateTimeString = new Date(new Date().getTime() + TIMEZONE_OFFSET * 3600 * 1000).toJSON();
	const result = dateTimeString.match(/^\d{4}-\d{2}-\d{2}/);
	if (!result)
		return failed(`oops~ "${dateTimeString}" is invalid!`);

	return result[0];
}
