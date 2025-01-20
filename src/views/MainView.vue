<script setup lang="ts">
import Header from '@/components/organisms/Header.vue';
import SearchSettings from '@/components/molecules/SearchSettings.vue';
import LoadingAnimation from '@/components/atoms/LoadingAnimation.vue';
import SearchResults from '@/components/organisms/SearchResults.vue';

import { Octokit } from '@octokit/core';
import { computed, provide, ref, watch } from 'vue';

const API_TOKEN = import.meta.env.VITE_GH_TOKEN;
const initialSearchTarget = 'repositories';
const initialSearchResultsState = { repositories: [], users: [] };
const initialResultsPerPageValue = 20;

const octokit = new Octokit({ auth: API_TOKEN });
const requestHeaders = {
	// authorization: API_TOKEN,
	'X-GitHub-Api-Version': '2022-11-28',
};

const isLoading = ref(false);
const hasUserStarted = ref(false);
const searchInputValue = ref('');
const sortValue = ref('');
const orderValue = ref('');
const resultsPerPageValue = ref(initialResultsPerPageValue);
const searchTarget = ref(initialSearchTarget);
const resultsNumber = ref(0);
const totalPages = computed(() => {
	return Math.ceil(resultsNumber.value / resultsPerPageValue.value);
});
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
	hasUserStarted.value = false;
	sortValue.value = '';
	resultsNumber.value = 0;
	currentPage.value = 1;
	searchTarget.value = (e.target as HTMLButtonElement).dataset.searchTarget || initialSearchTarget;
};

const handlePaginationButtonClick = (e: Event) => (currentPage.value = Number((e.target as HTMLButtonElement).dataset.page));

const handleFormSubmit = () => {
	if (!searchInputValue.value) return;

	isLoading.value = true;
	if (searchTarget.value === 'repositories') {
		getMatchingRepositories(searchInputValue.value);
	} else {
		getMatchingUsers(searchInputValue.value);
	}
};

const handleSearchResults = (resultsType: string, resultsArr: Record<string, any>[]) => {
	searchResults.value = {
		...initialSearchResultsState,
		[resultsType]: resultsArr,
	};
	isLoading.value = false;
	hasUserStarted.value = true;
};

const getCommits = async (commitsUrl: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: commitsUrl,
			headers: requestHeaders,
		});

		const commitsDataArr = response.data.map((item: Record<string, any>) => ({
			message: item.commit.message,
			date: item.commit.author.date,
			author: item.commit.author.name,
		}));

		return commitsDataArr;
	} catch (error) {
		console.log(error);
	}
};

const getContributors = async (contributorsUrl: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: contributorsUrl,
			headers: requestHeaders,
		});

		const commitsDataArr = response.data.map((item: Record<string, any>) => ({
			login: item.login,
			avatarUrl: item.avatar_url,
			profileUrl: item.html_url,
		}));

		return commitsDataArr;
	} catch (error) {
		console.log(error);
	}
};

const getMatchingRepositories = async (searchPhrase: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: `/search/repositories?q=${searchPhrase}`,
			sort: sortValue.value,
			order: orderValue.value,
			per_page: resultsPerPageValue.value,
			page: currentPage.value,
			headers: {
				...requestHeaders,
				accept: 'application/vnd.github+json',
			},
		});

		const repositoryData = await Promise.all(
			response.data.items.map(async (resultItem: Record<string, any>) => {
				const commits = resultItem.size > 0 ? await getCommits(resultItem.commits_url) : [];
				const contributors = resultItem.size > 0 ? await getContributors(resultItem.contributors_url) : [];

				return {
					id: resultItem.id,
					title: resultItem.full_name,
					url: resultItem.html_url,
					commits,
					contributors,
				};
			})
		);

		handleSearchResults('repositories', repositoryData);
		resultsNumber.value = Number(response.data.total_count);
	} catch (error) {
		console.log(error);
	}
};

const getMatchingUsers = async (searchPhrase: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: `/search/users?q=${searchPhrase}`,
			sort: sortValue.value,
			order: orderValue.value,
			per_page: resultsPerPageValue.value,
			page: currentPage.value,
			headers: {
				...requestHeaders,
				accept: 'application/vnd.github+json',
			},
		});

		const results = response.data.items.map((resultItem: Record<string, any>) => ({
			id: resultItem.id,
			name: resultItem.login,
			profileUrl: resultItem.html_url,
			avatarUrl: resultItem.avatar_url,
		}));

		handleSearchResults('users', results);
	} catch (error) {
		console.log(error);
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
	handleFormSubmit();
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
		<SearchResults v-else :hasUserStarted :searchTarget :searchResults :totalPages />
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
