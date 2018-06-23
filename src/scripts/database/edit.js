//@ts-check
/// <reference path="../../../dev/types.d.ts" />

import { tbMatches } from "./core";
import { mergeMatchInfo } from "../_data_builder";

/**
 * @param {MatchInfo} match
 */
export function updateOne(match) {
	const { matchId } = match;
	const log = {
		updatedFinished: false,
		addOddsMap: false,
	};

	if (!matchId) return Promise.reject(new Error(`matchId is empty! (${matchId})`));

	return tbMatches.where({ matchId }).toArray(
		/** @param {MatchInfo[]} items */
		items => {
			let updateItem = match;
			if (items.length > 0) {
				const oldItem = items[0];
				if (match.isFinished != oldItem.isFinished)
					log.updatedFinished = true;
				if (isEmptyObject(oldItem.halfOdds) && !isEmptyObject(match.halfOdds))
					log.addOddsMap = true;

				updateItem = mergeMatchInfo(oldItem, match);
			}
			// console.log(items[0], match, updateItem);
			return tbMatches.put(updateItem);
		}).then(() => {
			return tbMatches.where({ matchId }).toArray();
		}).then(items => {
			return { item: items[0], log };
		});
}

/**
 * @param {MatchInfo[]} matches
 */
export function bulkUpdate(matches) {
	/** @type {{[matchId: string]: MatchInfo}} */
	const matchesMap = {};
	for (const match of matches)
		matchesMap[match.matchId] = match;

	const matchIds = Object.keys(matchesMap);
	const count = {
		all: matchIds.length,
		existed: 0
	};
	const log = {
		updatedFinished: [],
	};

	return tbMatches.where('matchId').anyOf(matchIds).toArray(
		/** @param {MatchInfo[]} items */
		items => {
			count.existed = items.length;
			items.forEach(oldItem => {
				const { matchId } = oldItem;
				const newItem = matchesMap[matchId];
				if (oldItem.isFinished != newItem.isFinished)
					log.updatedFinished.push(matchId);
				matchesMap[matchId] = mergeMatchInfo(oldItem, newItem);
			})
			return tbMatches.bulkPut(matchIds.map(id => matchesMap[id]));
		}).then(() => { return { log, count }; });
}

function isEmptyObject(obj) {
	return !obj || Object.keys(obj).length == 0;
}
