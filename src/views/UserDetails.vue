<script setup lang="ts">
import LoadingAnimation from '@/components/atoms/LoadingAnimation.vue';
import ArrowLeft from '@/assets/icons/ArrowLeft.vue';

import { Octokit } from '@octokit/core';
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import ArrowLeftSmall from '@/assets/icons/ArrowLeftSmall.vue';

const API_TOKEN = import.meta.env.VITE_GH_TOKEN;
const route = useRoute();
const userId = Number(route.params.id);
const isLoading = ref(true);
const userData = ref<Record<string, any>>({});

const octokit = new Octokit({
	auth: API_TOKEN,
});
const requestHeaders = {
	// authorization: API_TOKEN,
	'X-GitHub-Api-Version': '2022-11-28',
};

const formatDate = (givenDate: string) => new Date(givenDate).toLocaleDateString('PL-pl');

const getRepositoriesData = async (reposUrl: string) => {
	try {
		const response = await octokit.request({
			method: 'GET',
			url: reposUrl,
			sort: 'updated',
			headers: requestHeaders,
		});

		const repositoriesArr = response.data;
		return repositoriesArr;
	} catch (error) {
		console.log(error);
	}
};

onMounted(async () => {
	try {
		const response = await octokit.request('GET /user/{account_id}', {
			account_id: userId,
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
			},
		});

		const repositories = await getRepositoriesData(response.data.repos_url);

		const user = response.data;
		userData.value = {
			...user,
			repositoriesData: repositories,
		};

		isLoading.value = false;
		formatDate(user.created_at);
	} catch (error) {
		console.log(error);
	}
});
</script>

<template>
	<div class="user-details-wrapper">
		<RouterLink to="/" class="go-back-arrow-btn" aria-label="go back">
			<ArrowLeft />
		</RouterLink>
		<LoadingAnimation v-if="isLoading" />
		<div v-else class="user-data-wrapper">
			<div class="user-profile-wrapper">
				<div class="user-basic-data-box">
					<img :src="userData.avatar_url" class="user-data-img" alt="" />
					<a :href="userData.html_url" class="text-semibold">{{ userData.login }}</a>
					<a :href="userData.html_url">{{ userData.name }}</a>
				</div>
				<div class="user-data-box">
					<p>Joined</p>
					<p>{{ formatDate(userData.created_at) }}</p>
				</div>
				<div class="user-data-box">
					<p>Repositories</p>
					<p>{{ userData.public_repos }}</p>
				</div>
				<div class="user-data-box">
					<p>Followers</p>
					<p>{{ userData.followers }}</p>
				</div>
				<div v-if="userData.collaborators" class="user-data-box">
					<p>Collaborators</p>
					<p>{{ userData.collaborators }}</p>
				</div>
				<div v-if="userData.location" class="user-data-box">
					<p>Location</p>
					<p>{{ userData.location }}</p>
				</div>
				<div v-if="userData.blog" class="user-data-box">
					<p>Website</p>
					<a :href="userData.blog">{{ userData.blog }}</a>
				</div>
			</div>
			<ul v-if="userData.repositoriesData.length" class="user-repositories-list">
				<li v-for="repository in userData.repositoriesData" class="user-repositories-list-item">
					<a :href="repository.html_url">
						<span>{{ userData.login }}</span>
						<span class="text-bold">/{{ repository.name }}</span>
					</a>
					<div class="user-data-repository-box">
						<p>Created</p>
						<p>{{ formatDate(repository.created_at) }}</p>
					</div>
					<div class="user-data-repository-box">
						<p>Main language</p>
						<p>{{ repository.language }}</p>
					</div>
				</li>
				<li class="user-repositories-list-item go-back-item">
					<RouterLink to="/" class="go-back-item-box">
						<ArrowLeftSmall />
						MAIN PAGE
					</RouterLink>
				</li>
			</ul>
			<p v-else>This user has no repositories yet</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.text-semibold {
	font-weight: 600;
}

.text-bold {
	font-weight: 700;
}

.go-back-arrow-btn {
	position: fixed;
	z-index: 3;
	top: 1.2rem;
	left: 1.2rem;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	background-color: #c9bcb3;
	box-shadow: 0 0 6px rgba(0, 0, 0, 0.27);
}

.user-details-wrapper {
	padding: 0.8rem;
}

.user-data-wrapper {
	display: flex;
	flex-direction: column;
	padding: 0.8rem 0;
}

.user-basic-data-box {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.user-data-img {
	margin-bottom: 1.2rem;
	border-radius: 50%;
	max-width: 80px;
	aspect-ratio: 1 / 1;
	box-shadow: 0 0 0 1px #1f232826;
}

.user-data-box {
	display: flex;
	flex-direction: column-reverse;
	align-items: center;
	margin-top: 2rem;

	p:first-child {
		font-size: 1.2rem;
		opacity: 0.85;
	}
}

.user-repositories-list {
	display: flex;
	flex-direction: column;
	gap: 0.8rem;
	margin-top: 2.4rem;
	list-style: none;
}

.user-repositories-list-item {
	display: flex;
	flex-direction: column;
	gap: 0.6rem;
	padding: 0.8rem 1rem;
	border: 1px solid rgb(209, 217, 224);
	border-radius: 6px;
	overflow: auto;
}

.go-back-item {
	background-color: #c9bcb3;
	color: #fff;
	text-align: center;
	font-weight: bold;
}

.go-back-item-box {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 0.6rem;

	svg {
		scale: 1.3;
	}
}

.user-data-repository-box {
	display: flex;
	flex-direction: column;

	p:first-child {
		font-size: 1.4rem;
		opacity: 0.85;
	}

	p:last-child {
		font-style: italic;
	}
}

@media (min-width: 780px) {
	.user-details-wrapper {
		padding-top: 0;
	}

	.user-data-wrapper {
		position: relative;
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 3.2rem;
		margin-left: auto;
		margin-right: auto;
		padding-top: 0;
		max-width: 1440px;
	}

	.user-profile-wrapper {
		position: sticky;
		top: 0;
		left: 0;
		padding: 3.2rem;
		max-height: max-content;
	}
}
</style>
