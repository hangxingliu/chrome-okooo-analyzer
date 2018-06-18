
// =================================================
//                 _   _               _
//  _ __ ___   ___| |_| |__   ___   __| |___
// | '_ ` _ \ / _ \ __| '_ \ / _ \ / _` / __|
// | | | | | |  __/ |_| | | | (_) | (_| \__ \
// |_| |_| |_|\___|\__|_| |_|\___/ \__,_|___/


/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement}
 */
export function $(selector, parent = document) {
	return parent.querySelector(selector);
}

/**
 * @param {string} selector
 * @param {any} parent
 * @returns {HTMLElement[]}
 */
export function $$(selector, parent = document) {
	return Array.prototype.slice.call(parent.querySelectorAll(selector));
}

