import {
	getEventsSectionTemplate,
	getNavTemplate,
	getProgressBarTemplate,
	getStatsTemplate,
	getShareSectionTemplate,
} from "./templates.js";
import {getProgressData, getStats} from "./data.js";
import {createFilters} from "./filters.js";
import {initModals} from "./modal.js";
import {anonData} from "./helpers.js";
import {initSharer} from "./share.js";

const gameData = document.querySelector('.js__game-data');
const gameDataContainer = gameData.querySelector('.js__game-data-main')


function createGames() {
	const eventsSectionTemplate = getEventsSectionTemplate(game_data);
	gameDataContainer.insertAdjacentHTML('beforeend', eventsSectionTemplate);
}


function createNavigation() {
	const nav = [...document.querySelectorAll('.js__game-data-default-nav-link')]
		.map(item => {
			return {
				link: item.href, label: item.innerText
			}
		});
	const navTemplate = getNavTemplate(nav);
	gameDataContainer.insertAdjacentHTML('beforeend', navTemplate);
	const months = gameData.querySelector('.js__nav-filter-select');
	months.addEventListener('change', event => {
		const field = event.currentTarget;
		location.href = `/wp-admin/admin.php?page=rl_events%2Fsrc%2Fgame_data%2Findex.php&month_year=${field.value}`;
	});
}


function createProgressBar() {
	const progressContainer = gameData.querySelector('.js__game-data-progress');
	const progressData = getProgressData(game_data);
	const progressBarTemplate = getProgressBarTemplate(progressData);
	progressContainer.insertAdjacentHTML('beforeend', progressBarTemplate);
}


function createStats() {
	const statsContainer = gameData.querySelector('.js__game-data-stats');
	const stats = getStats(game_data);
	statsContainer.innerHTML = getStatsTemplate(stats);
}

function createSharer() {
	const shareSectionTemplate = getShareSectionTemplate(game_data);
	gameDataContainer.insertAdjacentHTML('beforeend', shareSectionTemplate);
	initModals();
	initSharer();
}

function createUI(ver) {
	console.log(`🎲🎲 Welcome to Game Data ${ver}`);
	createNavigation();
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
