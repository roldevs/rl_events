import {
	getEventsSectionTemplate,
	getNavTemplate,
	getProgressBarTemplate,
	getStatsTemplate,
	getShareSectionTemplate,
} from "./templates.js";
import {createFilters} from "./filters.js";
import {initModals} from "./modal.js";
import {anonData} from "./helpers.js";
import {initSharer} from "./share.js";

const gameData = document.querySelector('.js__game-data');
let gameDataContainer;
if (gameData) {
	gameDataContainer = gameData.querySelector('.js__game-data-main');
}


function createGames() {
	const eventsSectionTemplate = getEventsSectionTemplate(game_data);
	gameDataContainer.insertAdjacentHTML('beforeend', eventsSectionTemplate);
}


function createNavigation(navData) {
	const nav = Object.values(navData);
	const currentLocation = new URL(location.href);
	const currentMonth = currentLocation.searchParams.get('month_year') || nav[0];
	const navTemplate = getNavTemplate(nav, currentMonth);
	gameDataContainer.insertAdjacentHTML('beforeend', navTemplate);
	const months = gameData.querySelector('.js__nav-filter-select');
	months.addEventListener('change', event => {
		const field = event.currentTarget;
		currentLocation.searchParams.set('month_year', field.value);
		location.href = currentLocation.toString();
	});
}


function createProgressBar() {
	const progressContainer = gameData.querySelector('.js__game-data-progress');
	// const progressData = getProgressData(game_data);
	const progressBarTemplate = getProgressBarTemplate(game_data);
	progressContainer.insertAdjacentHTML('beforeend', progressBarTemplate);
}


function createStats() {
	const statsContainer = gameData.querySelector('.js__game-data-stats');
	statsContainer.innerHTML = getStatsTemplate(game_data);
}

function createSharer() {
	const shareSectionTemplate = getShareSectionTemplate(game_data);
	gameDataContainer.insertAdjacentHTML('beforeend', shareSectionTemplate);
	initModals();
	initSharer();
}

function createUI(ver) {
	console.log(`🎲🎲 Welcome to Game Data ${ver}`);
	createNavigation(game_data.month_years);
	createGames();
	createStats()
	createProgressBar();
	createFilters();
	createSharer();
	anonData(false);
}


export {
	createUI
}
