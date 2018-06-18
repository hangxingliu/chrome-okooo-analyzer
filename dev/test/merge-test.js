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
	const expected = window['__merge_result'];
	let result = null;

	describe('Merge', () => {

		it('# mergeMatchInfo', () => {
			const originalInfo = window['__actual_table_result2'];
			const newInfo = window['__actual_result1'];

			result = window['mergeMatchInfo'](originalInfo, newInfo);
			if (!result) throw new Error(`Empty result`);
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
