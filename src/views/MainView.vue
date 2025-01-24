<script setup lang="ts">
import Header from '@/components/organisms/Header.vue';
import SearchPanel from '@/components/organisms/SearchPanel.vue';
import LoadingAnimation from '@/components/atoms/LoadingAnimation.vue';
import SearchResults from '@/components/organisms/SearchResults.vue';

import { useResultsProvider } from '@/providers/useResults';

const { isLoading } = useResultsProvider();
</script>

<template>
	<div class="app-wrapper">
		<Header />
		<main>
			<SearchPanel />
			<LoadingAnimation v-if="isLoading" />
			<SearchResults v-else />
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
