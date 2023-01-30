document.addEventListener('alpine:init', () => {
	Alpine.store('header', {
		//cartItems: Alpine.$persist(0),
		cartItemsObject: Alpine.$persist({}),
		watchingItems: Alpine.$persist([]),
		get watchlistItems() {
			return this.watchingItems.length;
		},
		get cartItems() {
			return Object.values(this.cartItemsObject).reduce(
				(acc, next) => {return acc + parseInt(next.quantity)}, 0
			);
		},
	});

	Alpine.data('toast', () => ({
		visible: false,
		delay: 5000,
		percent: 0,
		interval: null,
		timeout: null,
		message: null,
		close() {
			this.visible = false;
			clearInterval(this.interval);
		},
		show(message) {
			this.visible = true;
			this.message = message;

			if (this.interval) {
				clearInterval(this.interval);
				this.interval = null;
			}

			if (this.timeout) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(() => {
				this.visible = false;
				this.timeout = null;
			}, this.delay);
			const startDate = Date.now();
			const futureDate = Date.now() + this.delay;
			this.interval = setInterval(() => {
				const date = Date.now();
				this.percent = (date - startDate) * 100 / (futureDate - startDate);
				if (this.percent >= 100) {
					clearInterval(this.interval);
					this.interval = null;
				}
			}, 30)
		},
	}));

	Alpine.data('productItem', (product) => ({
		id: product.id,
		product: product,
		quantity: 1,
		get watchlistItems() {
			return this.$store.header.watchlistItems;
		},
		addToCart(id, quantity = 1) {
			this.$store.header.cartItemsObject[id] = this.$store.header.cartItemsObject[id] || {...product, quantity: 0};
			this.$store.header.cartItemsObject[id].quantity += parseInt(quantity);
			this.$dispatch('notify', {
				message: 'The item was added into the Cart'
			});
			// this.$store.toast.show('The item was added into the cart');
		},
		addToWatchlist() {
			if (this.isInWatchlist()) {
				this.$store.header.watchingItems.splice(
					this.$store.header.watchingItems.findIndex((p) => p.id === product.id),
					1
				);
				this.$dispatch('notify', {
					message: 'The item was removed into the watchlist'
				});
				// this.$store.toast.show('The item was removed into the watchlist');
			} else {
				this.$store.header.watchingItems.push(product);
				this.$dispatch('notify', {
					message: 'The item was added into the watchlist'
				});
				// this.$store.toast.show('The item was added into the watchlist');
			}
			console.log(this.$store.header.watchingItems)
		},
		isInWatchlist() {
			return this.$store.header.watchingItems.find((p) => {return p.id === product.id});
		},
		removeItemFromCart(){
			delete this.$store.header.cartItemsObject[this.id];
			this.$dispatch('notify', {
				message: 'The item was removed from the Cart'
			});
		},
		removeFromWatchlist(){
			this.$store.header.watchingItems.splice(
				this.$store.header.watchingItems.findIndex((p) => p.id === this.id),
				1
			);
		}
	}));
});