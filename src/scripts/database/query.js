//@ts-check
/// <reference path="../../../dev/types.d.ts" />

import { tbMatches } from "./core";

/**
 * @param {{type?: string;}} [where]
 */
export function count(where) {
	console.log(where)
	const from = where && Object.keys(where).length > 0
		? tbMatches.where(where)
		: tbMatches;
	return from.count();
}

/**
 * @param {{type?: string;offset?: number;limit?: number}} [where]
 */
export function query(where) {
	if (!where) where = {};

	const whereClause = {};
	if ('type' in where) whereClause.type = where.type;

	let from = Object.keys(whereClause).length > 0
		? tbMatches.where(whereClause)
		: tbMatches;

	//@ts-ignore
	from = from.orderBy('unixTimestamp');

	return from.offset(where.offset || 0).limit(where.limit || 20).toArray();
}

export function queryTypes() {
	return tbMatches.orderBy('type').uniqueKeys();
}
