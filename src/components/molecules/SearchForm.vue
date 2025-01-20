<script setup lang="ts">
import SearchInput from '@/components/atoms/SearchInput.vue';
import StyledButton from '@/components/atoms/StyledButton.vue';

import type { handleFormSubmit, handleSearchTargetButtonClick } from '@/types/types';
import { inject } from 'vue';

const handleFormSubmit = inject<handleFormSubmit>('handleFormSubmit', () => {});
const searchTarget = inject('searchTarget');
const handleSearchTargetButtonClick = inject<handleSearchTargetButtonClick>('handleSearchTargetButtonClick');
</script>

<template>
	<form @submit.prevent="handleFormSubmit" class="search-form">
		<SearchInput :handleFormSubmit />
		<div class="search-target-buttons-wrapper">
			<StyledButton
				class="left"
				data-search-target="repositories"
				:isActive="searchTarget === 'repositories'"
				@click="handleSearchTargetButtonClick"
				type="button"
				:aria-label="`set respositories as search target (current search target is: ${searchTarget})`">
				Repositories
			</StyledButton>
			<StyledButton
				class="right"
				data-search-target="users"
				:isActive="searchTarget === 'users'"
				@click="handleSearchTargetButtonClick"
				type="button"
				:aria-label="`set respositories as search target (current search target is: ${searchTarget})`">
				Users
			</StyledButton>
		</div>
	</form>
</template>

<style lang="scss" scoped>
.search-form {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
}

.search-target-buttons-wrapper {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
}

@media (min-width: 640px) {
	.search-form {
		flex-direction: row;
		gap: 1.6rem;
	}
}

@media (min-width: 880px) {
	.search-target-buttons-wrapper {
		flex-grow: 1;
	}
}
</style>
