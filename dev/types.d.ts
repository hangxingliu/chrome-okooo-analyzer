type OddsMap = { [name: string]: number; };

type MatchInfo = {
	/**
	 * example: 2018-06-18-1012
	 * format: ${yyyy}-${mm}-${dd}-${data-morder}
	 */
	matchId: string;

	/** example: 1000214 (可用于查询分析数据之类的) */
	rawMid: string;

	/** example: 2018-06-18 */
	date: string;

	/** example: 20:00 */
	time: string;

	unixTimestamp: number;

	/** example: 世界杯 */
	type: string;

	left: string;
	rankLeft: number;

	right: string;
	rankRight: number;

	/** 让球 */
	handicap: number;

	/** 赔率 [胜, 平, 负] */
	odds: number[];

	/** 让球赔率 [胜, 平, 负] */
	oddsWithHandicap: number[];

	/** 比分赔率 */
	scoreOdds: OddsMap;
	/** 总进球赔率 */
	goalOdds: OddsMap;
	/** 半全场赔率 */
	halfOdds: OddsMap;

	isFinished: boolean;

	/** 0: 未知 | 1: 胜 | 2: 平 | 3: 负 */
	actualWin: 0 | 1 | 2 | 3;

	/** 0: 未知 | 1: 胜 | 2: 平 | 3: 负 */
	actualWinWithHandicap: 0 | 1 | 2 | 3;

	/** example: [1,2] => 1:2 */
	actualScores: number[];

	/** example: [1,2] => 胜/平 */
	actualHalf: number[];

	/** example: 暂停销售 ... */
	remark?: string;

	details?: any;
};
