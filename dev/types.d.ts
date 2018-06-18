type OddsMap = { [name: string]: number; };

type MatchInfo = {
	/**
	 * example: 2018-06-18-1012
	 * format: ${yyyy}-${mm}-${dd}-${data-morder}
	 */
	uuid: string;

	/** example: 2018-06-18 */
	date: string;

	/** example: 20:00 */
	time: string;

	/** example: 世界杯 */
	type: string;

	left: string;
	rankLeft: number;

	right: string;
	rankRight; number;

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

	/** 未知 | 胜 | 平 | 负 */
	actualWin: 0 | 1 | 2 | 3;

	/** 未知 | 胜 | 平 | 负 */
	actualWinWithHandicap: 0 | 1 | 2 | 3;

	/** example: [1,2] => 1:2 */
	actualScores: number[];

	/** example: [1,2] => 胜/平 */
	actualHalf: number[];
};