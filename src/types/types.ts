export type clearSearchInput = () => string;

export type searchResultsDataType = {
	results: Record<string, any>[];
	results_category: string;
	results_total: number;
};

export type handleFormSubmit = () => void;

export type handleInputChangeType = (e: Event) => string;

export type handlePaginationButtonClick = (e: Event) => number;

export type handleSearchTargetButtonClick = (e: Event) => void;
