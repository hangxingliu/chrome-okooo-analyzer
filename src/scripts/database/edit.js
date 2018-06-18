//@ts-check
/// <reference path="../../../dev/types.d.ts" />

import { tbMatches } from "./core";


/**
 * @param {MatchInfo[]} matches
 */
export function bulkUpdate(matches) {
	matches.forEach(match => { match.details = match; });
	return tbMatches.bulkPut(matches);
}
