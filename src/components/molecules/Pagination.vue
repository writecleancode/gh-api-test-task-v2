<script setup lang="ts">
import type { handlePaginationButtonClick } from '@/types/types';
import { inject } from 'vue';

const props = defineProps({
	totalPages: {
		type: Number,
		required: true,
	},
});

const currentPage = inject<number>('currentPage', 1);
const handlePaginationButtonClick = inject<handlePaginationButtonClick>('handlePaginationButtonClick');
</script>

<template>
	<div class="pagination-wrapper">
		<template v-if="currentPage > 2">
			<button class="pagination-button" data-page="1" @click="handlePaginationButtonClick">1</button>
			<span v-if="currentPage > 3">...</span>
		</template>
		<button class="pagination-button" :data-page="currentPage - 1" v-if="currentPage > 1" @click="handlePaginationButtonClick">
			{{ currentPage - 1 }}
		</button>
		<button class="pagination-button current-page" :data-page="currentPage" @click="handlePaginationButtonClick">{{ currentPage }}</button>
		<button class="pagination-button" :data-page="currentPage + 1" v-if="currentPage < totalPages" @click="handlePaginationButtonClick">
			{{ currentPage + 1 }}
		</button>
		<template v-if="currentPage + 1 < totalPages">
			<span v-if="currentPage + 2 < totalPages">...</span>
			<button class="pagination-button" :data-page="totalPages" @click="handlePaginationButtonClick">{{ totalPages }}</button>
		</template>
	</div>
</template>

<style lang="scss" scoped>
.pagination-wrapper {
	display: flex;
	justify-content: center;
	gap: 0.8rem;
}

.pagination-button {
	border: 1px solid #919191;
	border-radius: 10px;
	min-width: 4ch;
	padding: 0.4rem 0.6rem;
	background-color: rgb(240, 240, 240);

	&.current-page {
		background-color: #92ffbc;
		background-color: #c9bcb3;
	}
}
</style>
