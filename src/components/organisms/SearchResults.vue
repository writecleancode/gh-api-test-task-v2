<script setup lang="ts">
import Pagination from '@/components/molecules/Pagination.vue';

const props = defineProps({
	hasUserStarted: {
		type: Boolean,
		required: true,
	},
	searchTarget: {
		type: String,
		required: true,
	},
	totalPages: {
		type: Number,
		required: true,
	},
	searchResults: {
		type: Object,
		required: true,
	},
});
</script>

<template>
	<div>
		<template v-if="searchResults.repositories.length && searchTarget === 'repositories'">
			<ul class="search-results-list">
				<p class="results-title">Repositories found:</p>
				<li v-for="searchResult in searchResults.repositories" :key="searchResult.id" class="search-result-wrapper">
					<a :href="searchResult.url" class="search-result-title">{{ searchResult.title }}</a>
					<div class="commmits-info-wrapper">
						<div v-if="searchResult.commits.length > 0">
							<p class="commit-info-text">Last commit:</p>
							<p class="commit-info-text commit-message">"{{ searchResult.commits[0].message }}"</p>
						</div>
						<p class="commit-info-text" v-else>There are no commits for this repository</p>
					</div>
					<div class="contributors-info-wrapper">
						<div v-if="searchResult.contributors.length > 0">
							<p class="contributors-info-text">Contributors:</p>
							<ul class="contributors-list">
								<li v-for="contributor in searchResult.contributors" class="contributors-list-item">
									<img :src="contributor.avatarUrl" alt="" class="contributor-avatar-img" />
									<a :href="contributor.profileUrl" class="contributors-info-text contributors-author">
										{{ contributor.login }}
									</a>
								</li>
							</ul>
						</div>
						<p class="contributors-info-text" v-else>There are no contributors for this repository</p>
					</div>
				</li>
			</ul>
		</template>
		<template v-else-if="searchResults.users.length && searchTarget === 'users'">
			<ul class="search-results-list">
				<p class="results-title">Users found:</p>
				<li v-for="searchResult in searchResults.users" :key="searchResult.id" class="search-result-wrapper">
					<div class="user-basic-data-wrapper">
						<div class="user-avatar-wrapper">
							<img class="user-avatar-img" :src="searchResult.avatarUrl" alt="" />
						</div>
						<RouterLink :to="`users/${searchResult.id}`">{{ searchResult.name }}</RouterLink>
					</div>
				</li>
			</ul>
		</template>
		<template v-else>
			<p v-if="hasUserStarted" class="no-matching-results-text">No matching {{ searchTarget }} found...</p>
		</template>
		<Pagination v-if="totalPages > 1" :totalPages />
	</div>
</template>

<style lang="scss" scoped>
.search-results-list {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	padding: 1.6rem 0;
	list-style: none;
}

.search-result-wrapper {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	padding: 0.8rem 1rem;
	border: 1px solid rgb(209, 217, 224);
	border-radius: 6px;
	overflow: auto;
}

.search-result-title {
	font-weight: 500;
}

.commits-info-wrapper,
.commit-info-text,
.contributors-info-text {
	font-size: 1.3rem;
}

.commit-message,
.contributors-author {
	font-style: italic;
	opacity: 0.75;
}

.contributors-list {
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	list-style: none;
}

.contributors-list-item {
	display: flex;
	gap: 0.6rem;

	&:first-child {
		margin-top: 0.2rem;
	}
}

.contributor-avatar-img {
	width: 20px;
	aspect-ratio: 1 / 1;
	border-radius: 50%;
	box-shadow: 0 0 0 1px #1f232826;
}

.user-avatar-wrapper {
	border-radius: 50%;
	box-shadow: 0 0 0 1px #1f232826;
	width: 30px;
	aspect-ratio: 1 / 1;
	overflow: hidden;
}

.user-avatar-img {
	width: 100%;
	object-fit: cover;
}

.user-basic-data-wrapper {
	display: flex;
	align-items: center;
	gap: 1.2rem;
}

.no-matching-results-text {
	margin-top: 12%;
	text-align: center;
}

@media (min-width: 1200px) {
	.search-results-list {
		gap: 1.2rem;
	}
}
</style>
