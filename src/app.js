document.addEventListener('alpine:init', () => {
	Alpine.data('index', () => ({
		productCounter: 10
	}))
});