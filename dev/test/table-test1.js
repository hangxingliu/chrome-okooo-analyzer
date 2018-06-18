//@ts-check
/// <reference path="../types.d.ts" />

// ==========================================
//   _____         _
//  |_   _|__  ___| |_
//    | |/ _ \/ __| __|
//    | |  __/\__ \ |_
//    |_|\___||___/\__|
// ==========================================
(function test() {
	/** @type {HTMLDivElement} */
	let testEl = null;

	/** @type {MatchInfo} */
	const expected = window['__expected_table_result1'];
	const actualExport = '__actual_table_result1';

	/** @type {MatchInfo} */
	let result = null;

	describe('Analyze Table', () => {
		it('# fetch html', () => {
			return fetch('../example-table1.html')
				.then(res => {
					if (res.status != 200)
						throw new Error('Could not fetch ../example-table.html');
					return res.text();
				}).then(html => {
					const wrapper = document.createElement('div');
					wrapper.innerHTML = html.trim();
					//@ts-ignore
					testEl = wrapper.firstChild;
				})
		})

		it('# getMatchBasicInfoFrom', () => {
			const date = '2018-06-19';
			result = window['getMatchBasicInfoFrom'](date, testEl);
			if (!result) throw new Error(`Empty result`);

			window[actualExport] = result;
		});

		for (const key in expected) {
			(key => {
				it(`# ${key}`, () => {
					const actual = JSON.stringify(result[key]);
					const expect = JSON.stringify(expected[key]);
					if (actual !== expect)
						throw new Error(`${key} is wrong: \n Actual: ${actual}\n Expected: ${expect}`);
				});
			})(key);
		}

	});

})();
