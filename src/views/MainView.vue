<script setup lang="ts">
import Header from '@/components/organisms/Header.vue';
import SearchPanel from '@/components/organisms/SearchPanel.vue';
import LoadingAnimation from '@/components/atoms/LoadingAnimation.vue';
import SearchResults from '@/components/organisms/SearchResults.vue';

import type { searchResultsDataType } from '@/types/types';
import { computed, provide, ref } from 'vue';

const initialSearchTarget = 'repositories';
const initialSearchResultsState = { repositories: [], users: [] };
const initialResultsPerPageValue = 20;

const isLoading = ref(false);
const resultsPerPageValue = ref(initialResultsPerPageValue);
const currentPage = ref(1);
const searchTarget = ref(initialSearchTarget);
const currentResultsCategory = ref('');
const resultsNumber = ref(0);
const totalPages = computed(() => Math.ceil(resultsNumber.value / resultsPerPageValue.value));
const searchResults = ref(initialSearchResultsState);

const setLoadingTrue = () => (isLoading.value = true);

const resetCurrentResultsCategory = () => (currentResultsCategory.value = '');

const handleResultsPerPageValueChange = (e: Event) => (resultsPerPageValue.value = Number((e.target as HTMLSelectElement).value));

const handlePaginationButtonClick = (e: Event) => (currentPage.value = Number((e.target as HTMLButtonElement).dataset.page));

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

provide('searchTarget', searchTarget);

provide('currentPage', currentPage);
provide('handlePaginationButtonClick', handlePaginationButtonClick);
</script>

<template>
	<div class="app-wrapper">
		<Header />
		<main>
			<SearchPanel
				:resultsPerPageValue
				:searchTarget
				:currentPage
				:currentResultsCategory
				:setLoadingTrue
				:resetCurrentResultsCategory
				:handleSearchResults
				:handleResultsPerPageValueChange
				:searchResults
				:resetSearchParameters />
			<LoadingAnimation v-if="isLoading" />
			<SearchResults v-else :searchTarget :currentResultsCategory :totalPages :searchResults />
		</main>
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
