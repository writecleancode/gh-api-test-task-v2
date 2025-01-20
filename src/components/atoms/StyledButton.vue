<script setup lang="ts">
const props = defineProps({
	isActive: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<button class="styled-button" :class="{ active: isActive }">
		<slot />
	</button>
</template>

<style lang="scss" scoped>
.styled-button {
	position: relative;
	padding: 0.5rem 1rem;
	border: 1px solid #333;
	border: 1px solid #c9bcb3;
	border-radius: 0;
	background-color: transparent;
	font-size: 1.4rem;
	font-weight: bold;
	-webkit-tap-highlight-color: transparent;

	&::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background-color: #e9e9e9;
		background-color: #c9bcb3;
		transform: scaleX(0);
		transition: transform 0.2s;
	}

	&.left {
		border-top-left-radius: 6px;
		border-bottom-left-radius: 6px;

		&::before {
			transform-origin: right;
		}
	}

	&.right {
		border-top-right-radius: 6px;
		border-bottom-right-radius: 6px;
		border-left: none;

		&::before {
			transform-origin: left;
		}
	}

	&.active {
		&::before {
			transform: scaleX(1);
		}
	}
}

@media (min-width: 640px) {
	.styled-button {
		box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.2);
	}
}
</style>
