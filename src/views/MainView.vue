<script setup lang="ts">
import Header from '@/components/organisms/Header.vue';
import SearchSettings from '@/components/molecules/SearchSettings.vue';
import LoadingAnimation from '@/components/atoms/LoadingAnimation.vue';
import SearchResults from '@/components/organisms/SearchResults.vue';

import type { searchResultsDataType } from '@/types/types';
import { computed, provide, ref, watch } from 'vue';
import { getMatchingRepositories, getMatchingUsers } from '@/hooks/useSearch';

const initialSearchTarget = 'repositories';
const initialSearchResultsState = { repositories: [], users: [] };
const initialResultsPerPageValue = 20;

const isLoading = ref(false);
const searchInputValue = ref('');
const sortValue = ref('');
const orderValue = ref('');
const resultsPerPageValue = ref(initialResultsPerPageValue);
const searchTarget = ref(initialSearchTarget);
const currentResultsCategory = ref('');
const resultsNumber = ref(0);
const totalPages = computed(() => Math.ceil(resultsNumber.value / resultsPerPageValue.value));
const currentPage = ref(1);
const searchResults = ref(initialSearchResultsState);

const handleInputChange = (e: Event) => (searchInputValue.value = (e.target as HTMLInputElement).value);

const clearSearchInput = () => (searchInputValue.value = '');

const setSortValue = (e: Event) => (sortValue.value = (e.target as HTMLSelectElement).value);

const handleOderCheckboxChange = (e: Event) => {
	if ((e.target as HTMLInputElement).checked) {
		orderValue.value = 'asc';
	} else {
		orderValue.value = '';
	}
};

const handleResultsPerPageValueChange = (e: Event) => (resultsPerPageValue.value = Number((e.target as HTMLSelectElement).value));

const handleSearchTargetButtonClick = (e: Event) => {
	sortValue.value = '';
	resultsNumber.value = 0;
	currentPage.value = 1;
	searchTarget.value = (e.target as HTMLButtonElement).dataset.searchTarget || initialSearchTarget;
};

const handlePaginationButtonClick = (e: Event) => (currentPage.value = Number((e.target as HTMLButtonElement).dataset.page));

const handleSearchResults = (data: searchResultsDataType) => {
	searchResults.value = {
		...initialSearchResultsState,
		[data.resultsCategory]: data.results,
	};
	resultsNumber.value = data.resultsTotal;
	currentResultsCategory.value = data.resultsCategory;

	isLoading.value = false;
};

const handleFormSubmit = async () => {
	if (!searchInputValue.value) return;

	isLoading.value = true;
	currentResultsCategory.value = '';

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
provide('handleInputChange', handleInputChange);
provide('clearSearchInput', clearSearchInput);
provide('handleFormSubmit', handleFormSubmit);

provide('searchTarget', searchTarget);
provide('handleSearchTargetButtonClick', handleSearchTargetButtonClick);

provide('currentPage', currentPage);
provide('handlePaginationButtonClick', handlePaginationButtonClick);

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
	<div class="app-wrapper">
		<Header :searchTarget :handleFormSubmit />
		<SearchSettings
			:sortValue
			:setSortValue
			:handleOderCheckboxChange
			:resultsPerPageValue
			:handleResultsPerPageValueChange
			:orderValue
			:searchTarget />
		<LoadingAnimation v-if="isLoading" />
		<SearchResults v-else :searchTarget :currentResultsCategory :totalPages :searchResults />
	</div>
</template>

<style scoped>
.app-wrapper {
	padding: 0 0.8rem 1.6rem;
}

@media (min-width: 380px) {
	.app-wrapper {
		padding-left: 1rem;
		padding-right: 1rem;
	}
}

@media (min-wdith: 460px) {
	.app-wrapper {
		padding-left: 1.2rem;
		padding-right: 1.2rem;
		padding-bottom: 2rem;
	}
}

@media (min-width: 640px) {
	.app-wrapper {
		padding-left: 1.6rem;
		padding-right: 1.6rem;
		padding-bottom: 2rem;
	}
}

@media (min-width: 1440px) {
	.app-wrapper {
		max-width: 1200px;
		margin-left: auto;
		margin-right: auto;
	}
}
</style>
