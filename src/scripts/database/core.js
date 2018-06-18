//@ts-check
import Dexie from 'dexie';

const db = new Dexie('okooo-analyzer-db');

db.version(1).stores({
	matches: 'matchId,type,date,time,unixTimestamp,left,right,isFinished,details',
});

const tbMatches = db.table('matches');


// ==============================
// Export:
// @ts-ignore
window.debugDB = { db, tbMatches };
export { db, tbMatches };
