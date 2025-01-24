import type { searchResultsDataType } from '@/types/types';
import { createProvider } from '@/uilts/createProvider';
import { computed, ref, watch } from 'vue';

const initialSearchTarget = 'repositories';
const initialSearchResultsState = { repositories: [], users: [] };
const initialResultsPerPageValue = 20;

const useResults = () => {
	const isLoading = ref(false);
	const resultsPerPageValue = ref(initialResultsPerPageValue);
	const currentPage = ref(1);
	const searchTarget = ref(initialSearchTarget);
	const currentResultsCategory = ref('');
	const resultsNumber = ref(0);
	const totalPages = computed(() => Math.ceil(resultsNumber.value / resultsPerPageValue.value));
	const searchResults = ref<{ repositories: Record<string, any>[]; users: Record<string, any>[] }>(initialSearchResultsState);

	const setLoadingTrue = () => (isLoading.value = true);

	const resetCurrentResultsCategory = () => (currentResultsCategory.value = '');

	const handleResultsPerPageValueChange = (e: Event) => (resultsPerPageValue.value = Number((e.target as HTMLSelectElement).value));

	const setCurrentPage = (newPage: string | number) => (currentPage.value = Number(newPage));

	const resetSearchParameters = (e: Event) => {
		resultsNumber.value = 0;
		currentPage.value = 1;
		searchTarget.value = (e.target as HTMLButtonElement).dataset.searchTarget || initialSearchTarget;
	};

	const handleSearchResults = (data: searchResultsDataType) => {
		searchResults.value = {
			...initialSearchResultsState,
			[data.resultsCategory]: data.results,
		};
		resultsNumber.value = data.resultsTotal;
		currentResultsCategory.value = data.resultsCategory;

		isLoading.value = false;
	};

	return {
		isLoading,
		resultsPerPageValue,
		currentPage,
		searchTarget,
		currentResultsCategory,
		totalPages,
		searchResults,
		setLoadingTrue,
		resetCurrentResultsCategory,
		handleResultsPerPageValueChange,
		setCurrentPage,
		resetSearchParameters,
		handleSearchResults,
	};
};

export const [useResultsProvider, useResultsContext] = createProvider('useResults', useResults);
