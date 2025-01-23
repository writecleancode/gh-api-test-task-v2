<template>
	<header class="header">
		<img class="app-logo" src="@/assets/img/cat.png" alt="aplication logo" />
		<!-- <a href="https://www.flaticon.com/free-icons/cat" title="cat icons">Cat icons created by Icon Desai - Flaticon</a> -->
		<p class="app-title">RepoScout - Github API test task</p>
	</header>
</template>

<style lang="scss" scoped>
.header {
	display: flex;
	justify-content: center;
	align-items: center;
	margin-top: 0.2rem;
}

.app-logo {
	max-width: 20px;
}

.app-title {
	padding: 0.6rem;
	font-weight: 500;
	font-size: 1.7rem;
	text-align: center;
}

@media (min-width: 1200px) {
	.app-logo {
		max-width: 24px;
		translate: 0 -1px;
	}

	.app-title {
		padding: 0.8rem;
		font-size: 1.9rem;
	}
}
</style>
