//@ts-check
import { $$, $ } from "./_dom_utils";
import { getDateStringFromElement } from "./_get_date_str";
import { logOnPage, initLogOnPage, LOG_ERROR } from "./_log_on_page";
import { getMatchBasicInfoFrom } from "./_data_builder";

document.addEventListener('DOMContentLoaded', () => {
	initLogOnPage();
	main();
});

function main() {
	const $content = $('#content');
	if (!$content) return;

	// const dateString = getDateStringFromPage();

	/** @type {{date: string; el: HTMLDivElement; isEnd: boolean}[]} */
	const items = [];
	/** @type {string[]} */
	const dateArray = [];

	const $groups = $$('.touzhu', $content);
	logOnPage(`date group: ${$groups.length}`);

	for (const $group of $groups) {
		const date = getDateStringFromElement($group);
		if (!date) return;
		dateArray.push(date);

		const $items = $$('.touzhu_1', $group);
		$items.forEach($it => {
			const isEnd = $it.getAttribute('data-end') == "1";
			//@ts-ignore
			items.push({ date, isEnd, el: $it });
		});
	}
	logOnPage(`date: ${dateArray.length == 1 ? dateArray[0] : (`${dateArray[0]}~${dateArray[dateArray.length - 1]}`)}`);
	logOnPage(`items: ${items.length} (end: ${items.filter(it => it.isEnd).length})`);

	// 注入获取详细信息的菜单
	for (const { el } of items) {
		const $prefix = $('.liansai', el);
		const $btn = createGetDataButton();
		el.insertBefore($btn, $prefix);
	}

	for (const { el, date } of items) {
		try {
			const basicInfo = getMatchBasicInfoFrom(date, el);
			console.log(basicInfo);

		} catch (ex) {
			const context = el.innerText.replace('收集数据', '').replace(/\s/g, '').slice(0, 20);
			logOnPage(`Error: ${ex.message || String(ex)}`, LOG_ERROR);
			logOnPage(`Error details: getMatchBasicInfoFrom { ${context} }`, LOG_ERROR);
		}
	}

}

function createGetDataButton() {
	const $wrapper = document.createElement('div');
	$wrapper.setAttribute('style', [
		`position: absolute; left: -63px; width: 60px;`,
		`border: 1px solid #d9f7be;background-color: #f6ffed;`
	].join(''));

	const $btn = document.createElement('a');
	$btn.innerText = '收集数据';
	$btn.setAttribute('style', `cursor: pointer;color: #1890ff;`);

	$wrapper.appendChild($btn);
	return $wrapper;
}
