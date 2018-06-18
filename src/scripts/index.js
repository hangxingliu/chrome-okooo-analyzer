//@ts-check
import { $$, $ } from "./_dom_utils";
import { getDateStringFromPage } from "./_from_page";
import { logOnPage, initLogOnPage } from "./_log_on_page";

document.addEventListener('DOMContentLoaded', () => {
	initLogOnPage();
	main();
});

function main() { 
	const $content = $('#content');
	if (!$content) return;

	const dateString = getDateStringFromPage();
	const $items = $$('.touzhu_1', $content);
	logOnPage(`Date:       ${dateString}`);
	logOnPage(`Item count: ${$items.length}`);

	for (const $item of $items) { 
		const $prefix = $('.liansai', $item);
		const $btn = createGetDataButton();
		$item.insertBefore($btn, $prefix);
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