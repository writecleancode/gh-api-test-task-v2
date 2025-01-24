<script setup lang="ts">
import { formatDate } from '@/hooks/useUsers';

defineProps({
	userData: {
		type: Object,
		required: true,
	},
});
</script>

<template>
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
</template>

<style lang="scss" scoped>
.text-semibold {
	font-weight: 600;
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

@media (min-width: 780px) {
	.user-profile-wrapper {
		position: sticky;
		top: 0;
		left: 0;
		padding: 3.2rem;
		max-height: max-content;
	}
}
</style>
