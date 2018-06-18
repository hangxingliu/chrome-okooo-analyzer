//@ts-check

import { $ } from "./_dom_utils";

export function assertFailed(context, message) {
	console.error(`Okooo Analyzer: Assert Failed! (${context})`);
	console.error(`  message: ${message}`);
}

/** @param {HTMLElement} $touzhuGroupElement */
export function getDateStringFromElement($touzhuGroupElement) {
	const failed = assertFailed.bind(this, 'getDateStringFromElement');

	/** @type {HTMLElement} */
	//@ts-ignore
	const $parent = $touzhuGroupElement.parentNode;
	if ($parent.className.indexOf('cont') < 0)
		return failed(`"cont" is missing in className of parent element ("${$parent.className}")`);

	const $date = $('.riqi .time .float_l', $parent);
	if (!$date)
		return failed(`.riqi .time .float_l is missing`);

	const _text = $date.innerText.trim();
	const result = _text.match(/^\d{4}-\d{2}-\d{2}/);
	if (!result)
		return failed(`"${_text}" is invalid datetime in .float_l`);
	return result[0];

	// const attrTime = $date.getAttribute('data-time');
	// if (!attrTime)
	// 	return failed(`data-time is missing in .float_l`);

	// const time = parseInt(attrTime, 10);
	// if (isNaN(time))
	// 	return failed(`'${attrTime}' is not a integer`);

	// const TIMEZONE_OFFSET = 8; // China Standard Time (CST)
	// const dateTimeString = new Date(new Date().getTime() + TIMEZONE_OFFSET * 3600 * 1000).toJSON();
	// const result = dateTimeString.match(/^\d{4}-\d{2}-\d{2}/);
	// if (!result)
	// 	return failed(`oops~ "${dateTimeString}" is invalid!`);

	// return result[0];
}
