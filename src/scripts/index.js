//@ts-check
/// <reference path="../../dev/types.d.ts" />

import { $$, $ } from "./_dom_utils";
import { getDateStringFromElement } from "./_get_date_str";
import { logOnPage, initLogOnPage, LOG_ERROR } from "./_log_on_page";
import { getMatchBasicInfoFrom, getMatchAdvancedInfoFrom } from "./_data_builder";
import { initServerConnection, requestServer } from "./_connect_server";

document.addEventListener('DOMContentLoaded', () => {
	initLogOnPage();
	initServerConnection();
	main();
});


//                       _
//   _ __ ___     __ _  (_)  _ __
//  | '_ ` _ \   / _` | | | | '_ \
//  | | | | | | | (_| | | | | | | |
//  |_| |_| |_|  \__,_| |_| |_| |_|
function main() {
	const adv = $('.adv_ok.adv_ok_left');
	if (adv) adv.parentElement.removeChild(adv); // 移除广告

	const $content = $('#content');
	if (!$content) return;

	// const dateString = getDateStringFromPage();

	/** @type {{date: string; el: HTMLDivElement; isEnd: boolean}[]} */
	const items = [];
	/** @type {string[]} */
	const dateArray = [];

	const $groups = $$('.touzhu', $content);
	logOnPage(`日期分组数量: ${$groups.length}`);

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
	logOnPage(`日期范围: ${dateArray.length == 1 ? dateArray[0] : (`${dateArray[0]}~${dateArray[dateArray.length - 1]}`)}`);
	logOnPage(`页面上比赛条目数量: ${items.length} (已经结束: ${items.filter(it => it.isEnd).length})`);

	const dataArray = [];
	for (const { el, date } of items) {
		try {
			const basicInfo = getMatchBasicInfoFrom(date, el);
			dataArray.push(basicInfo);

			// 注入获取详细信息的菜单
			const $prefix = $('.liansai', el);
			const $btn = createGetDataButton(date, basicInfo);
			el.insertBefore($btn, $prefix);

		} catch (ex) {
			const context = el.innerText.replace('收集数据', '').replace(/\s/g, '').slice(0, 20);
			logOnPage(`错误: ${ex.message || String(ex)}\ngetMatchBasicInfoFrom { ${context} }`, LOG_ERROR);
		}
	}
	if (!dataArray.length) return logOnPage('无有效比赛信息!', LOG_ERROR);

	requestServer('bulk-update', dataArray).then(result => {
		const logError = desc => { logOnPage(`数据库刷新反馈数据异常!${desc}`, LOG_ERROR); console.error(result); }
		const { count, log } = result;
		if (!count || !log) return logError(`缺少 count 或 log`);

		const { all, existed } = count;
		const { updatedFinished } = log;
		if (typeof all != 'number' || typeof existed != 'number') return logError(`all 或 existed 不是数字`);
		if (!Array.isArray(updatedFinished)) return logError(`updatedFinished 不是数组`);

		logOnPage(`数据库刷新成功! 刷新数量: ${existed}; 新增数量: ${(all - existed)}`);
		if (updatedFinished.length)
			logOnPage(`其中 ${updatedFinished.length} 场比赛已结束!`);
	}).catch(error => {
		logOnPage(`数据库刷新反馈数据失败! ${error.message || error}`, LOG_ERROR);
		console.error(error);
	});
}

// =======================
// =======================
// =======================

/**
 * @param {string} date
 * @param {MatchInfo} match
 */
function createGetDataButton(date, match) {
	const $wrapper = document.createElement('div');
	$wrapper.setAttribute('style', [
		`position: absolute; left: -63px; width: 60px;`,
		`border: 1px solid #d9f7be;background-color: #f6ffed;`
	].join(''));

	const $btn = document.createElement('a');
	$btn.innerText = '收集数据';
	$btn.setAttribute('style', `cursor: pointer;color: #1890ff;`);

	let lastClick = 0;
	$btn.addEventListener('click', event => {
		event.preventDefault();
		const now = Date.now();
		if (now < lastClick + 500) return;
		lastClick = now;

		const _id = match.matchId.split('-').pop();
		console.log(`拉取详细数据ing... { date: ${date}, id: ${_id} }`);
		fetchDetails(date, _id)
			.then(el => setTimeout(afterFetchedDetails, 15, match.matchId, el))
			.catch(error => {
				logOnPage(`收集详细数据失败! ${error.message || error}`, LOG_ERROR);
				console.error(error);
			});
	});

	$wrapper.appendChild($btn);
	return $wrapper;
}

/**
 * @param {string} LotteryNo
 * @param {string} MatchOrder
 * @return {Promise<HTMLDivElement>}
 */
function fetchDetails(LotteryNo, MatchOrder) {
	const uri = `/jingcai/?action=more&LotteryNo=${LotteryNo}&MatchOrder=${MatchOrder}`;
	return fetch(uri, { method: 'GET' }).then(response => {
		if (response.status != 200)
			return Promise.reject(new Error(`status code is ${response.status}`));
		return response.text();
	}).then(html => {
		console.log(`fetched details HTML for {${LotteryNo}, ${MatchOrder}}`);

		const div = document.createElement('div');
		div.innerHTML = html;
		return div;
	});
}

function afterFetchedDetails(matchId, el) {
	let details;
	try {
		details = getMatchAdvancedInfoFrom(el);
		// console.log(details);
	} catch (ex) {
		logOnPage(`生成比赛详细数据失败! ${ex.message || ex}`, LOG_ERROR);
		return console.error(ex);
	}

	requestServer('update', Object.assign({}, details, { matchId })).then(result => {
		const logError = desc => { logOnPage(`数据库刷新反馈数据异常!${desc}`, LOG_ERROR); console.error(result); }
		const { item, log } = result;
		if (!item || !log) return logError(`缺少 log 或 item`);

		const { updatedFinished, addOddsMap } = log;

		const _handicap = item.handicap;
		const handicap = typeof _handicap === 'number' ? `${_handicap < 0 ? '' : '+'}${_handicap}` : '';
		const append = `${printActualHalf(item.actualHalf)} ${(addOddsMap ? "+详细赔率" : "")} ${(updatedFinished ? "+比赛结果" : "")}`;
		logOnPage(`数据库刷新成功! (${item.left || ""}${handicap} : ${item.right || ""}) ${append}`);
	}).catch(error => {
		logOnPage(`数据库刷新反馈数据失败! ${error.message || error}`, LOG_ERROR);
		console.error(error);
	});
}

function printActualHalf(actualHalf) {
	if (!Array.isArray(actualHalf)) return '';
	if (!(actualHalf[0] > 0)) return '';
	return actualHalf.map(it => it == 1 ? '胜' : (it == 2 ? '平' : '负')).join('=>');
}
