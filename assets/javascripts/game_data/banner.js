function showBanner(type) {
	const banner = document.querySelector('.js__banner');
	banner.classList.add(`banner--${type}`);
	banner.querySelector('.js__banner-item').textContent = type;
	banner.classList.add('banner--active');
	setTimeout(() => {
		banner.classList.remove('banner--active');
		banner.classList.remove(`banner--${type}`);
	}, 1000);
}

export {
	showBanner
};
