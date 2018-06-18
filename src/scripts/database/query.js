//@ts-check
/// <reference path="../../../dev/types.d.ts" />

import { tbMatches } from "./core";


/**
 * @param {{type?: string}} [where]
 */
export function query(where = {}) {
	const whereClause = {};
	if ('type' in where) whereClause.type = where.type;

	return tbMatches.where(whereClause)
		.reverse().sortBy('unixTimestamp')
		.then(item => {
			console.log(item);
			return item;
		})
}
