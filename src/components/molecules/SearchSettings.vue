<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
	sortValue: {
		type: String,
		required: true,
	},
	setSortValue: {
		type: Function as PropType<(e: Event) => string>,
		required: true,
	},
	handleOderCheckboxChange: {
		type: Function as PropType<(e: Event) => void>,
		required: true,
	},
	handleResultsPerPageValueChange: {
		type: Function as PropType<(e: Event) => number>,
		required: true,
	},
	resultsPerPageValue: {
		type: Number,
		required: true,
	},
	orderValue: {
		type: String,
		required: true,
	},
	searchTarget: {
		type: String,
		required: true,
	},
});
</script>

<template>
	<div class="settings-wrapper">
		<div class="sort-setting-wrapper">
			<p>Sort by:</p>
			<select v-if="searchTarget === 'repositories'" name="sort" id="sort" @change="setSortValue">
				<option value="">best match</option>
				<option value="stars">stars</option>
				<option value="forks">forks</option>
				<option value="help-wanted-issues">help wanted issues</option>
				<option value="updated">updated</option>
			</select>
			<select v-else-if="searchTarget === 'users'" name="sort" id="sort" @change="setSortValue">
				<option value="">best match</option>
				<option value="followers">followers</option>
				<option value="repositories">repositories</option>
				<option value="joined">joined</option>
			</select>
		</div>
		<div class="order-settings-wrapper">
			<input
				type="checkbox"
				name="order"
				id="order"
				:disabled="!sortValue"
				@input="handleOderCheckboxChange"
				:checked="orderValue !== ''" />
			<label for="order">reverse order</label>
		</div>
		<div class="results-per-page-settings-wrapper">
			<p>Results per page:</p>
			<select name="results-per-page" id="results-per-page" :value="resultsPerPageValue" @change="handleResultsPerPageValueChange">
				<option value="5">5</option>
				<option value="10">10</option>
				<option value="15">15</option>
				<option value="20" selected>20</option>
				<option value="25">25</option>
				<option value="30">30</option>
			</select>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.settings-wrapper {
	display: flex;
	flex-wrap: wrap;
	gap: 0.6rem;
	padding: 0.8rem 0;
}

.sort-setting-wrapper {
	display: flex;
	align-items: center;
	gap: 0.4rem;
	font-size: 1.3rem;

	select {
		padding: 0.2rem;
		border-radius: 4px;
		font-family: inherit;
	}
}

.order-settings-wrapper {
	display: flex;
	gap: 0.6rem;
	align-items: center;
	font-size: 1.3rem;
}

.results-per-page-settings-wrapper {
	display: flex;
	gap: 0.6rem;
	align-items: center;
	margin-left: auto;
	font-size: 1.3rem;

	select {
		padding: 0.2rem;
		border-radius: 4px;
		font-family: inherit;
	}
}

@media (min-width: 330px) {
	.settings-wrapper {
		gap: 1.6rem;
	}
}
</style>
