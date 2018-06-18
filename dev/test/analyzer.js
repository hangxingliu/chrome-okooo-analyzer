//@ts-check
/// <reference path="../types.d.ts" />

/**
 * @param {string} dateStr
 * @param {HTMLDivElement} tableRow
 * @returns {MatchInfo}
 */
function getMatchBasicInfoFrom(dateStr, tableRow) {
	const getElement = (s, p = null, n = '') => {
		/** @type {HTMLElement} */
		const el = (p || tableRow).querySelector(s);
		if (!el) throw new Error(`selector "${s}"${(n ? `(${n})` : '')} is missing!`);
		return el;
	}
	const getText = (s, p = null, n = '') => {
		const el = getElement(s, p, n);
		const v = (el.innerText || '').trim();
		if (!v) throw new Error(`innerText of "${s}"${(n ? `(${n})` : '')} is empty!`);
		return v;
	};
	const getAttr = (s, attr, p = null, n = '') => {
		const el = getElement(s, p, n);
		const v = (el.getAttribute(attr) || '').trim();
		if (!v) throw new Error(`${attr} of "${s}"${(n ? `(${n})` : '')} is empty!`);
		return v;
	};

	/** @type {MatchInfo} */
	//@ts-ignore
	const result = {};

	const clzName = tableRow.getAttribute('class');
	if (clzName.indexOf('touzhu_1') < 0)
		throw new Error(`className 'touzhu_1' is missing in "${clzName}"`);

	// ================
	// 比赛 Id
	let matchId = (tableRow.getAttribute('data-morder') || '').trim();
	let rawMid = (tableRow.getAttribute('data-mid') || '').trim();
	if (!matchId) throw new Error(`data-morder is empty in touzhu_1!`);
	if (!rawMid) throw new Error(`data-mid is empty in touzhu_1!`);
	if (!matchId.match(/\d{4,}/)) throw new Error(`"${matchId}"(data-morder) is invalid in touzhu_1!`);
	result.matchId = `${dateStr}-${matchId}`;
	result.rawMid = rawMid;

	// ================
	// 时间相关
	const titleTime = getAttr('.shijian', 'title');
	if (titleTime.indexOf(dateStr) < 0) {
		console.warn(`date string "${dateStr}" is missing in the title "${titleTime}"!`);
		const maybeMatcher = titleTime.match(/\d{4}-\d{2}-\d{2}/);
		if (!maybeMatcher)
			throw new Error(`datetime info is missing in football match datetime title title "${titleTime}"`);
		// 刷新准确时间
		dateStr = maybeMatcher[0];
	}
	const mtime = getAttr('.shijian', 'mtime');
	const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
	const mtimeMatch = mtime.match(/(\d{2}):(\d{2})/);
	if (!mtimeMatch) throw new Error(`mtime "${mtime}" is invalid!`);
	result.date = dateStr;
	result.time = mtime;
	result.unixTimestamp = Math.floor(new Date(
		parseInt(dateMatch[1], 10), parseInt(dateMatch[2], 10) - 1, parseInt(dateMatch[3], 10),
		parseInt(mtimeMatch[1], 10), parseInt(mtimeMatch[2], 10)
	).getTime() / 1000);

	// ================
	// 比赛类型
	const matchType = getText('.saiming');
	if (!matchType) throw new Error(`empty match type "${matchType}" in element .saiming`);
	result.type = matchType;

	// ================
	// 比赛双方
	const shenpf = getElement('.shenpf');
	const leftName = getText('.zhu .zhum', shenpf);
	const leftOdds = getText('.zhu .peilv', shenpf);
	const leftRank = getText('.zhu .paim p:nth-child(1)', shenpf); //如果使用 .zhu .paim .p2 可能导致有些条目无法匹配
	const leftRankMatch = leftRank.match(/\[(\d+)\]/);
	if (!leftRankMatch) throw new Error(`"${leftRank}" is invalid rank for ${leftName}`);
	if (isNaN(parseFloat(leftOdds))) throw new Error(`"${leftOdds}" is invalid odds for ${leftName}`);
	result.left = leftName;
	result.rankLeft = parseInt(leftRankMatch[1], 10);

	const rightName = getText('.fu .zhum', shenpf);
	const rightOdds = getText('.fu .peilv', shenpf);
	const rightRank = getText('.fu .paim p:nth-child(1)', shenpf); //如果使用 .zhu .paim .p2 可能导致有些条目无法匹配
	const rightRankMatch = rightRank.match(/\[(\d+)\]/);
	if (!rightRankMatch) throw new Error(`"${rightRank}" is invalid rank for ${rightName}`);
	if (isNaN(parseFloat(rightOdds))) throw new Error(`"${rightOdds}" is invalid odds for ${rightName}`);
	result.right = rightName;
	result.rankRight = parseInt(rightRankMatch[1], 10);

	const sameOdds = getText('.ping .peilv', shenpf);
	if (isNaN(parseFloat(sameOdds))) throw new Error(`"${sameOdds}" is invalid odds`);
	result.odds = [leftOdds, sameOdds, rightOdds].map(v => parseFloat(v));


	// ================
	// 让球胜负平
	const isClosed = tableRow.querySelector('.rangno .zi');
	if (isClosed) {
		result.handicap = 999;
		result.oddsWithHandicap = [0, 0, 0];
		result.remark = (result.remark || '') + isClosed.innerHTML + ' ';
	} else {
		const rqSPF = getElement('.rangqiuspf');
		const rq = getText('.zhu .rangqiu, .zhu .rangqiuzhen');
		if (isNaN(parseFloat(rq))) throw new Error(`"${rq}" is invalid handicap`);
		result.handicap = parseFloat(rq);

		const rqLeftOdds = getText('.zhu .peilv', rqSPF);
		if (isNaN(parseFloat(rqLeftOdds))) throw new Error(`"${leftOdds}" is invalid odds for ${leftName}`);

		const rqRightOdds = getText('.fu .peilv', rqSPF);
		if (isNaN(parseFloat(rqRightOdds))) throw new Error(`"${rightOdds}" is invalid odds for ${rightName}`);

		const rqSameOdds = getText('.ping .peilv', rqSPF);
		if (isNaN(parseFloat(rqSameOdds))) throw new Error(`"${sameOdds}" is invalid odds`);
		result.oddsWithHandicap = [rqLeftOdds, rqSameOdds, rqRightOdds].map(v => parseFloat(v));
	}

	// =================
	// 是否已经结束 (是否标有结果)
	const $resultScore = getElement('.more .more_bg .p1');
	const resultScore = ($resultScore.innerText || '').trim();
	result.isFinished = !!resultScore;
	if (resultScore) {
		const scoreMatched = resultScore.match(/(\d+):(\d+)/);
		if (!scoreMatched) throw new Error(`"${resultScore}" is invalid scores!`);
		const sa = parseInt(scoreMatched[1], 10);
		const sb = parseInt(scoreMatched[2], 10);
		if (isNaN(sa) || isNaN(sb))
			throw new Error(`"${resultScore}" is invalid scores (isNaN)!`);
		result.actualScores = [sa, sb];
		result.actualWin = (sa > sb) ? 1 : (sa == sb ? 2 : 3);

		const rqa = sa + result.handicap;
		result.actualWinWithHandicap = (rqa > sb) ? 1 : (rqa == sb ? 2 : 3);
	} else {
		result.actualScores = [];
		result.actualWin = 0;
		result.actualWinWithHandicap = 0;
	}


	// =================
	// 其他数据
	result.scoreOdds = {};
	result.goalOdds = {};
	result.halfOdds = {};

	return result;
}

/**
 * @param {HTMLDivElement} ajaxResultDom
 */
function getMatchAdvancedInfoFrom(ajaxResultDom) {
	const _matchResultMap = { '胜': 1, '平': 2, '负': 3};
	const getElement = (s, p = null, n = '') => {
		/** @type {HTMLElement} */
		const el = (p || ajaxResultDom).querySelector(s);
		if (!el) throw new Error(`selector "${s}"${(n ? `(${n})` : '')} is missing!`);
		return el;
	}
	const getElements = (s, p = null, n = '') => {
		/** @type {HTMLElement[]} */
		const els = Array.prototype.slice.call((p || ajaxResultDom).querySelectorAll(s));
		if (els.length == 0) throw new Error(`selector "${s}"${(n ? `(${n})` : '')} is missing!`);
		return els;
	}
	const getText = (s, p = null, n = '') => {
		const el = getElement(s, p, n);
		const v = (el.innerText || '').trim();
		if (!v) throw new Error(`innerText of "${s}"${(n ? `(${n})` : '')} is empty!`);
		return v;
	};

	const scoreOdds = {};
	const $scoreItems = getElements('.mrfg .ping.weiks');
	for (const $item of $scoreItems) {
		const scores = getText('.pingd .peilv', $item, '比分');
		const odds = getText('.pingd .peilv_1', $item, '买比分的赔率');
		scoreOdds[scores] = parseFloat(odds);
	}

	const goalOdds = {};
	// nth-child(2): 父元素的第二个儿子
	const $goalItems = getElements('.jnm:nth-child(2) .ping.weiks');
	for (const $item of $goalItems) {
		const goals = getText('.pingd .peilv', $item, '进球');
		const odds = getText('.pingd .peilv_1', $item, '买进球的赔率');
		goalOdds[goals] = parseFloat(odds);
	}

	let isFinished = false;
	let actualHalf = [0, 0];
	const halfOdds = {};
	// nth-child(2): 父元素的第三个儿子
	const $halfItems = getElements('.jnm:nth-child(3) .ping.weiks');
	for (const $item of $halfItems) {
		const half = getText('.pingd .peilv', $item, '半全场');
		const odds = getText('.pingd .peilv_1', $item, '买半全场的赔率');
		halfOdds[half] = parseFloat(odds);

		if ($item.className.indexOf('saiguo_color') >= 0) {
			isFinished = true;
			actualHalf = half.split('/')
				.map(it => it.trim())
				.filter(it => it)
				.slice(0, 2)
				.map(it => _matchResultMap[it] || 0);
		}
	}

	return { scoreOdds, goalOdds, halfOdds, actualHalf, isFinished };
}


/**
 * @param {MatchInfo} _originalInfo
 * @param {MatchInfo} _newInfo
 * @returns {MatchInfo}
 */
function mergeMatchInfo(_originalInfo, _newInfo) {
	/** @type {(a: MatchInfo) => MatchInfo} */
	const clone = a => JSON.parse(JSON.stringify(a));

	const originalInfo = clone(_originalInfo);
	const newInfo = clone(_newInfo);

	// 删除从数据库中得到的 details;
	delete originalInfo.details;

	// 不合并排名
	delete newInfo.rankLeft;
	delete newInfo.rankRight;

	// 暂停销售之类的原因导致的
	if (newInfo.handicap > 100) {
		delete newInfo.handicap;
		delete newInfo.oddsWithHandicap;
	}

	const result = Object.assign({}, originalInfo, newInfo);
	if (!originalInfo.isFinished) {
		if (!newInfo.isFinished) {
			// 均没有结束
			result.actualWin = 0;
			result.actualWinWithHandicap = 0;
			result.actualScores = [0, 0];
			result.actualHalf = [0, 0];
		}
	} else if (!newInfo.isFinished) {
		throw new Error(`originalInfo.isFinished is true, but newInfo.isFinished is false !`);
	}

	return result;
}

// -----magic_number_4863902_means_end-----

window['mergeMatchInfo'] = mergeMatchInfo;
window['getMatchBasicInfoFrom'] = getMatchBasicInfoFrom;
window['getMatchAdvancedInfoFrom'] = getMatchAdvancedInfoFrom;
