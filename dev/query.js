//@ts-check
/// <reference path="./types.d.ts" />

const debugDB = null;

debugDB.tbMatches.where({ type: '世界杯' })
	.toArray(
		/** @param {MatchInfo[]} its*/
		its => {
			console.log(
				its.sort((a, b) => a.unixTimestamp - b.unixTimestamp).
					filter(it => Object.keys(it.scoreOdds).length == 0)
					.map(it => `${it.date} > ${it.left} : ${it.right}`).join('\n')
			);
		});


debugDB.tbMatches.where({ type: '世界杯' })
	.toArray(
		/** @param {MatchInfo[]} its*/
		its => {
			console.log(
				its.sort((a, b) => a.unixTimestamp - b.unixTimestamp)
					.map(it => {
						const goals = it.actualScores[0] + it.actualScores[1];
						const goalKey = goals > 6 ? '总>6球' : `总${goals}球`;
						return [
							`${it.date} >`,
							` ${it.actualScores[0]} : ${it.actualScores[1]} `,
							` [${goals}] [${it.goalOdds[goalKey]}]`,
							` (${it.left} : ${it.right})`
						].join('')
					}).join('\n')
			);
		});
