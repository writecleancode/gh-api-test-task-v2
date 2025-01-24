<script setup lang="ts">
import SearchForm from '@/components/molecules/SearchForm.vue';
import SearchSettings from '@/components/molecules/SearchSettings.vue';

import { getMatchingRepositories, getMatchingUsers } from '@/hooks/useSearch';
import { useResultsContext } from '@/providers/useResults';
import { provide, ref, watch } from 'vue';

const searchInputValue = ref('');
const sortValue = ref('');
const orderValue = ref('');
const {
	resultsPerPageValue,
	currentPage,
	searchTarget,
	currentResultsCategory,
	searchResults,
	setLoadingTrue,
	resetCurrentResultsCategory,
	resetSearchParameters,
	handleSearchResults,
} = useResultsContext();

const clearSearchInput = () => (searchInputValue.value = '');

const setSortValue = (e: Event) => (sortValue.value = (e.target as HTMLSelectElement).value);

const handleOderCheckboxChange = (e: Event) => {
	if ((e.target as HTMLInputElement).checked) {
		orderValue.value = 'asc';
	} else {
		orderValue.value = '';
	}
};

const handleSearchTargetButtonClick = (e: Event) => {
	sortValue.value = '';
	resetSearchParameters(e);
};

const handleFormSubmit = async () => {
	if (!searchInputValue.value) return;

	setLoadingTrue();
	resetCurrentResultsCategory();

	if (searchTarget.value === 'repositories') {
		const data = await getMatchingRepositories(
			searchInputValue.value,
			sortValue.value,
			orderValue.value,
			resultsPerPageValue.value,
			currentPage.value
		);
		handleSearchResults(data);
	} else {
		const data = await getMatchingUsers(
			searchInputValue.value,
			sortValue.value,
			orderValue.value,
			resultsPerPageValue.value,
			currentPage.value
		);
		handleSearchResults(data);
	}
};

provide('searchInputValue', searchInputValue);
provide('clearSearchInput', clearSearchInput);
provide('handleFormSubmit', handleFormSubmit);

provide('handleSearchTargetButtonClick', handleSearchTargetButtonClick);

watch([sortValue, orderValue, resultsPerPageValue, currentPage], () => {
	if (
		currentResultsCategory.value === searchTarget.value &&
		(searchResults.value.repositories.length || searchResults.value.users.length)
	) {
		handleFormSubmit();
	}
});
</script>

<template>
	<SearchForm :handleFormSubmit />
	<SearchSettings :sortValue :setSortValue :handleOderCheckboxChange :orderValue />
</template>

<style lang="scss" scoped></style>
