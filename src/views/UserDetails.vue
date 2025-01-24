<script setup lang="ts">
import LoadingAnimation from '@/components/atoms/LoadingAnimation.vue';
import ArrowLeft from '@/assets/icons/ArrowLeft.vue';
import ArrowLeftSmall from '@/assets/icons/ArrowLeftSmall.vue';

import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { formatDate, getUser } from '@/hooks/useUser';
import UserProfile from '@/components/molecules/UserProfile.vue';

const route = useRoute();
const userId = Number(route.params.id);
const isLoading = ref(true);
const userData = ref<Record<string, any>>({});

onMounted(async () => {
	const user = await getUser(userId);
	userData.value = user;
	isLoading.value = false;
});
</script>

<template>
	<div class="user-details-wrapper">
		<RouterLink to="/" class="go-back-arrow-btn" aria-label="go back">
			<ArrowLeft />
		</RouterLink>
		<LoadingAnimation v-if="isLoading" />
		<template v-else>
			<div v-if="userData.repositoriesData.length > 0" class="user-data-wrapper">
				<UserProfile :userData />
				<ul class="user-repositories-list">
					<li v-for="repository in userData.repositoriesData" class="user-repositories-list-item">
						<a :href="repository.html_url">
							<span>{{ userData.login }}</span>
							<span class="text-bold">/{{ repository.name }}</span>
						</a>
						<div class="user-data-repository-box">
							<p>Created</p>
							<p>{{ formatDate(repository.created_at) }}</p>
						</div>
						<div class="user-data-repository-box" v-if="repository.language">
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
			</div>
			<div v-else class="no-repositories-info-wrapper">
				<UserProfile :userData />
				<p class="no-repositories-text">This user has no repositories yet</p>
				<img src="@/assets/img/nothing-to-see.gif" alt="" />
			</div>
		</template>
	</div>
</template>

<style lang="scss" scoped>
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
	padding: 1.6rem 0.8rem 0.8rem;
}

.user-data-wrapper {
	display: flex;
	flex-direction: column;
	padding: 0.8rem 0;
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

.no-repositories-info-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 1.6rem;
	margin-top: 4rem;
	margin-bottom: 2.4rem;
}

.no-repositories-text {
	text-align: center;
	font-weight: 500;
	color: #ff5858;
	color: #dd6060;
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
}

@media (min-width: 920px) {
	.user-details-wrapper {
		padding-left: 3.2rem;
		padding-right: 3.2rem;
	}
}

@media (min-width: 1400px) {
	.user-details-wrapper {
		padding-left: 0;
		padding-right: 0;
	}
}
</style>
