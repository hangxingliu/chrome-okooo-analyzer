//@ts-check
/// <reference path="../types.d.ts" />

(function () {
	/** @type {MatchInfo} */
	const expected = {
		matchId: '2018-06-18-1013',
		rawMid: '1000224',

		date: '2018-06-18',
		time: '23:00',

		unixTimestamp: Math.floor(new Date(2018, 6 - 1, 18, 23).getTime() / 1000),

		type: '世界杯',

		left: '比利时',
		rankLeft: 3,
		right: '巴拿马',
		rankRight: 55,

		handicap: -2,

		odds: [1.13, 6.6, 10.7],
		oddsWithHandicap: [2.28, 4.16, 2.22],

		scoreOdds: {},
		goalOdds: {},
		halfOdds: {},

		isFinished: true,

		actualWin: 1,
		actualWinWithHandicap: 1,

		actualScores: [3, 0],
		actualHalf: [],
	};

	delete expected.actualHalf;
	window['__expected_table_result2'] = expected;
})();
