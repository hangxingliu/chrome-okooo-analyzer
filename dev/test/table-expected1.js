//@ts-check
/// <reference path="../types.d.ts" />

(function () {
	/** @type {MatchInfo} */
	const expected = {
		matchId: '2018-06-19-2015',
		rawMid: '1000214',

		date: '2018-06-19',
		time: '20:00',

		unixTimestamp: Math.floor(new Date(2018, 6 - 1, 19, 20).getTime() / 1000),

		type: '世界杯',

		left: '哥伦比亚',
		rankLeft: 16,
		right: '日本',
		rankRight: 61,

		handicap: -1,

		odds: [1.54, 3.45, 5.25],
		oddsWithHandicap: [2.80, 3.20, 2.18],

		scoreOdds: {},
		goalOdds: {},
		halfOdds: {},

		isFinished: false,

		actualWin: 0,
		actualWinWithHandicap: 0,

		actualScores: [],
		actualHalf: [],
	};

	delete expected.actualScores;
	delete expected.actualHalf;
	window['__expected_table_result1'] = expected;
})();
