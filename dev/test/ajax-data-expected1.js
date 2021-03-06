//@ts-check
/// <reference path="../types.d.ts" />

(function () {
	/** @type {MatchInfo} */
	// @ts-ignore
	const expected = {
		scoreOdds: {
			'1-0': 5.80,
			'2-0': 4.50, '2-1': 8.50,
			'3-0': 5.35, '3-1': 10.50, '3-2': 39,
			'4-0': 8.75, '4-1': 16, '4-2': 60,
			'5-0': 15, '5-1': 32, '5-2': 80,
			'胜其他': 15,

			'0-0': 14.50, '1-1': 12, '2-2': 36, '3-3': 200,
			'平其他': 300,

			'0-1': 24,
			'0-2': 65, '1-2': 39,
			'0-3': 200, '1-3': 175, '2-3': 150,
			'0-4': 350, '1-4': 400, '2-4': 350,
			'0-5': 400, '1-5': 400, '2-5': 400,
			'负其他': 350
		},
		goalOdds: {
			'总0球': 14.50,
			'总1球': 5.40,
			'总2球': 3.55,
			'总3球': 3.30,
			'总4球': 4.55,
			'总5球': 7.50,
			'总6球': 14,
			'总>6球': 20,
		},
		halfOdds: {
			'胜/胜': 1.40,
			'胜/平': 24,
			'胜/负': 60,
			'平/胜': 3.55,
			'平/平': 9.50,
			'平/负': 26,
			'负/胜': 26,
			'负/平': 24,
			'负/负': 28,
		},
		actualHalf: [2, 1],
		isFinished: true,
	};

	window['__expected_result1'] = expected;
})();







