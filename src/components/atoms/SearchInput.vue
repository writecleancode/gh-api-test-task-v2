<script setup lang="ts">
import Xicon from '@/assets/icons/Xicon.vue';
import SearchIcon from '@/assets/icons/SearchIcon.vue';

import type { clearSearchInput, handleFormSubmit } from '@/types/types';
import { inject, ref } from 'vue';
import { useResultsContext } from '@/providers/useResults';

const { searchTarget } = useResultsContext();

const searchInputValue = inject('searchInputValue');
const clearSearchInput = inject<clearSearchInput>('clearSearchInput', () => '');
const handleFormSubmit = inject<handleFormSubmit>('handleFormSubmit', () => {});
const searchInputRef = ref<HTMLInputElement | null>(null);

const handleClearSearchInputButtonClick = () => {
	clearSearchInput();
	searchInputRef.value?.focus();
};
</script>

<template>
	<div class="search-input-wrapper">
		<input
			type="text"
			name="search"
			id="search"
			class="search-input"
			v-model="searchInputValue"
			ref="searchInputRef"
			:aria-label="`search ${searchTarget}`" />
		<button
			type="button"
			v-if="searchInputValue"
			class="clear-search-input-button"
			aria-label="clear search input"
			@click="handleClearSearchInputButtonClick">
			<Xicon />
		</button>
		<button class="search-button" type="submit" title="Search!" aria-label="search">
			<SearchIcon />
		</button>
	</div>
</template>

<style lang="scss" scoped>
.search-input-wrapper {
	position: relative;
	display: flex;
	border: 2px solid #c9bcb3;
	border-radius: 6px;
	background-color: #c9bcb3;
	overflow: hidden;
	box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
}

.search-input {
	flex-grow: 1;
	padding: 0.6rem 0.8rem;
	border: none;
	z-index: 1;

	&:focus {
		outline-offset: -1px;
	}
}

.clear-search-input-button {
	position: absolute;
	top: 50%;
	right: 3.6rem;
	translate: -50% -50%;
	z-index: 1;
	display: flex;
	justify-content: center;
	align-items: center;
	border: none;
	background-color: transparent;
}

.search-button {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0.6rem 1.2rem;
	border: none;
	background-color: transparent;

	&:focus-visible {
		outline-offset: -1px;
	}
}

@media (min-width: 640px) {
	.search-input-wrapper {
		flex-grow: 1;
	}
}

@media (min-width: 640px) {
	.search-input-wrapper {
		flex-grow: 3;
	}
}
</style>
