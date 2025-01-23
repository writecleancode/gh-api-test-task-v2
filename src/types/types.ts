export type clearSearchInput = () => string;

export type searchResultsDataType = {
	results: Record<string, any>[];
	resultsCategory: string;
	resultsTotal: number;
};

export type handleFormSubmit = () => void;

export type handlePaginationButtonClick = (e: Event) => number;

export type handleSearchTargetButtonClick = (e: Event) => void;
