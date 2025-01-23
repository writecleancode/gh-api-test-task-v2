<script setup lang="ts">
import SearchForm from '@/components/molecules/SearchForm.vue';
import SearchSettings from '@/components/molecules/SearchSettings.vue';

import { getMatchingRepositories, getMatchingUsers } from '@/hooks/useSearch';
import { provide, ref, watch } from 'vue';

const {
	resultsPerPageValue,
	searchTarget,
	currentPage,
	currentResultsCategory,
	setLoadingTrue,
	resetCurrentResultsCategory,
	handleSearchResults,
	searchResults,
	resetSearchParameters,
} = defineProps({
	resultsPerPageValue: {
		type: Number,
		required: true,
	},
	searchTarget: {
		type: String,
		required: true,
	},
	currentPage: {
		type: Number,
		required: true,
	},
	currentResultsCategory: {
		type: String,
		required: true,
	},
	setLoadingTrue: {
		type: Function,
		required: true,
	},
	resetCurrentResultsCategory: {
		type: Function,
		required: true,
	},
	handleSearchResults: {
		type: Function,
		required: true,
	},
	searchResults: {
		type: Object,
		required: true,
	},
	handleResultsPerPageValueChange: {
		type: Function,
		required: true,
	},
	resetSearchParameters: {
		type: Function,
		required: true,
	},
});

const searchInputValue = ref('');
const sortValue = ref('');
const orderValue = ref('');

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

	if (searchTarget === 'repositories') {
		const data = await getMatchingRepositories(searchInputValue.value, sortValue.value, orderValue.value, resultsPerPageValue, currentPage);
		handleSearchResults(data);
	} else {
		const data = await getMatchingUsers(searchInputValue.value, sortValue.value, orderValue.value, resultsPerPageValue.value, currentPage);
		handleSearchResults(data);
	}
};

provide('searchInputValue', searchInputValue);
provide('clearSearchInput', clearSearchInput);
provide('handleFormSubmit', handleFormSubmit);

provide('handleSearchTargetButtonClick', handleSearchTargetButtonClick);

watch([sortValue, orderValue, () => resultsPerPageValue, () => currentPage], () => {
	if (currentResultsCategory === searchTarget && (searchResults.repositories.length || searchResults.users.length)) {
		handleFormSubmit();
	}
});
</script>

<template>
	<SearchForm :handleFormSubmit />
	<SearchSettings
		:sortValue
		:setSortValue
		:handleOderCheckboxChange
		:resultsPerPageValue
		:handleResultsPerPageValueChange
		:orderValue
		:searchTarget />
</template>

<style lang="scss" scoped></style>
