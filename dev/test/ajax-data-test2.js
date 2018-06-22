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

	const expected = window['__expected_result2'];
	const resultExport = '__actual_result2';
	let result = null;

	describe('Analyze 2', () => {
		it('# fetch html', () => {
			return fetch('../example-2.html')
				.then(res => {
					if (res.status != 200)
						throw new Error('Could not fetch ../example.html');
					return res.text();
				}).then(html => {
					const wrapper = document.createElement('div');
					wrapper.innerHTML = html.trim();
					//@ts-ignore
					testEl = wrapper.firstChild;
				})
		})

		it('# getMatchAdvancedInfoFrom', () => {
			result = window['getMatchAdvancedInfoFrom'](testEl);
			if (!result) throw new Error(`Empty result`);

			console.log(result);
			window[resultExport] = result;
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
