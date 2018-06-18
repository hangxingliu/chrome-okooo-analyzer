//@ts-check
/// <reference path="../types.d.ts" />

// ==========================================
//   _____         _
//  |_   _|__  ___| |_
//    | |/ _ \/ __| __|
//    | |  __/\__ \ |_
//    |_|\___||___/\__|
// ==========================================
(function test2() {
	/** @type {HTMLDivElement} */
	let testEl = null;

	/** @type {MatchInfo} */
	const expected = window['__expected_table_result2'];
	const actualExport = '__actual_table_result2';

	/** @type {MatchInfo} */
	let result = null;

	describe('Analyze Table 2', () => {
		it('# fetch html', () => {
			return fetch('../example-table2.html')
				.then(res => {
					if (res.status != 200)
						throw new Error('Could not fetch ../example-table2.html');
					return res.text();
				}).then(html => {
					const wrapper = document.createElement('div');
					wrapper.innerHTML = html.trim();
					//@ts-ignore
					testEl = wrapper.firstChild;
				})
		})

		it('# getMatchBasicInfoFrom', () => {
			const date = '2018-06-18';
			result = window['getMatchBasicInfoFrom'](date, testEl);
			if (!result) throw new Error(`Empty result`);
		});

		for (const key in expected) {
			(key => {
				it(`# ${key}`, () => {
					const actual = JSON.stringify(result[key]);
					const expect = JSON.stringify(expected[key]);
					if (actual !== expect)
						throw new Error(`${key} is wrong: \n Actual: ${actual}\n Expected: ${expect}`);

					window[actualExport] = result;
				});
			})(key);
		}

	});

})();
