import {getFiltersContainersTemplate, getGameMasterTemplate, getPlayersTemplate, getFilterBtnTemplate} from "./templates.js";
import {filters} from "./constants.js";


function disableAllFilters() {
	const activefilters = document.querySelectorAll('.js__filter.filter--active');
	const games = document.querySelectorAll('.events__item');
	activefilters.forEach(filter => filter.classList.remove('filter--active'));
	games.forEach(game => game.classList.remove('events__item--filtered'));
}

function disablePlayersFilters() {
	const gmFilter = document.querySelector('.js__filter-gm-field');
	const playerFilter = document.querySelector('.js__filter-player-field');
	gmFilter.value = '';
	playerFilter.value = '';
}


function activeFilter(field) {
	const filter = field.closest('.js__filter');
	filter.classList.add('filter--active');

}


function showGamesFrom(gm) {
	const games = document.querySelectorAll('.events__item');
	games.forEach(game => {
		if (game.querySelector('.event__gms-item-discord-id').innerText !== gm) {
			game.classList.add('events__item--filtered');
		} else {
			game.classList.remove('events__item--filtered');
		}
	});
}


function showGamesWith(player) {
	const games = document.querySelectorAll('.events__item');
	games.forEach(game => {
		const players = [...game.querySelectorAll('.event__attendee')].map(item => item.innerText);
		if (!players.includes(player)) {
			game.classList.add('events__item--filtered');
		} else {
			game.classList.remove('events__item--filtered');
		}
	});
}


function showAvailableGames() {
	const games = document.querySelectorAll('.events__item');
	games.forEach(game => {
		if (!game.querySelector('.event').classList.contains('event--available')) {
			game.classList.add('events__item--filtered');
		} else {
			game.classList.remove('events__item--filtered');
		}
	})
}


function showPreviousGames() {
	const games = document.querySelectorAll('.events__item');
	games.forEach(game => {
		if (!game.querySelector('.event').classList.contains('event--past')) {
			game.classList.add('events__item--filtered');
		} else {
			game.classList.remove('events__item--filtered');
		}
	})
}


function showFutureGames() {
	const games = document.querySelectorAll('.events__item');
	games.forEach(game => {
		if (!game.querySelector('.event').classList.contains('event--future')) {
			game.classList.add('events__item--filtered');
		} else {
			game.classList.remove('events__item--filtered');
		}
	})
}


function showTodayGames() {
	const games = document.querySelectorAll('.events__item');
	games.forEach(game => {
		if (!game.querySelector('.event').classList.contains('event--today')) {
			game.classList.add('events__item--filtered');
		} else {
			game.classList.remove('events__item--filtered');
		}
	})
}


function filterByGameMaster(event) {
	const field = event.currentTarget;

	disableAllFilters();
	if (field.value) {
		const playerFilter = document.querySelector('.js__filter-player-field');
		playerFilter.value = '';
		showGamesFrom(field.value);
		activeFilter(field);
	}
}


function filterByPlayers(event) {
	const field = event.currentTarget;

	disableAllFilters();
	if (field.value) {
		const gmFilter = document.querySelector('.js__filter-gm-field');
		gmFilter.value = '';
		showGamesWith(field.value);
		activeFilter(field);
	}
}


function toggleAvailableGamesFilter(event) {
	const field = event.currentTarget;
	const filter = field.closest('.js__filter');

	if (!filter.classList.contains('filter--active')) {
		disablePlayersFilters();
		disableAllFilters();
		activeFilter(field);
		showAvailableGames();
	} else {
		disableAllFilters();
	}
}


function toggleFutureGamesFilter(event) {
	const field = event.currentTarget;
	const filter = field.closest('.js__filter');

	if (!filter.classList.contains('filter--active')) {
		disablePlayersFilters();
		disableAllFilters();
		activeFilter(field);
		showFutureGames();
	} else {
		disableAllFilters();
	}
}


function toggleTodayGamesFilter(event) {
	const field = event.currentTarget;
	const filter = field.closest('.js__filter');

	if (!filter.classList.contains('filter--active')) {
		disablePlayersFilters();
		disableAllFilters();
		activeFilter(field);
		showTodayGames();
	} else {
		disableAllFilters();
	}
}

function togglePreviousGamesFilter(event) {
	const field = event.currentTarget;
	const filter = field.closest('.js__filter');

	if (!filter.classList.contains('filter--active')) {
		disablePlayersFilters();
		disableAllFilters();
		activeFilter(field);
		showPreviousGames();
	} else {
		disableAllFilters();
	}
}


function addGameMasterFilter() {
	const gameMasterTemplate = getGameMasterTemplate();
	const playerFilters = document.querySelector('.js__filter-players');
	playerFilters.insertAdjacentHTML('beforeend', gameMasterTemplate);
	const field = playerFilters.querySelector('.js__filter-gm-field');
	field.addEventListener('change', filterByGameMaster);
}


function addPlayersFilter() {
	const gameMasterTemplate = getPlayersTemplate();
	const playerFilters = document.querySelector('.js__filter-players');
	playerFilters.insertAdjacentHTML('beforeend', gameMasterTemplate);
	const field = playerFilters.querySelector('.js__filter-player-field');
	field.addEventListener('change', filterByPlayers);
}


function addAvailableGamesFilter() {
	const mod = 'available';
	const availableGames = document.querySelectorAll('.event--available').length;
	const availableGameBtnTemplate = getFilterBtnTemplate(mod)
		.replace('[*TEXT*]', filters.AVAILABLE + ': <b>' + availableGames + '</b>');
	const eventsFilters = document.querySelector('.js__filter-events');
	eventsFilters.insertAdjacentHTML('beforeend', availableGameBtnTemplate);
	const field = document.querySelector(`.js__filter-${mod}-field`);
	field.addEventListener('click', toggleAvailableGamesFilter);
}


function addPreviousGamesFilter() {
	const mod = 'past-games';
	const previousGameBtnTemplate = getFilterBtnTemplate(mod)
		.replace('[*TEXT*]', filters.PREVIOUS);
	const eventsFilters = document.querySelector('.js__filter-events');
	eventsFilters.insertAdjacentHTML('beforeend', previousGameBtnTemplate);
	const field = document.querySelector(`.js__filter-${mod}-field`);
	field.addEventListener('click', togglePreviousGamesFilter);
}


function addFutureGamesFilter() {
	const mod = 'future';
	const futureGames = document.querySelectorAll('.event--future').length;
	const futureGameBtnTemplate = getFilterBtnTemplate(mod)
		.replace('[*TEXT*]', filters.FUTURE + ': <b>' + futureGames + '</b>');
	const eventsFilters = document.querySelector('.js__filter-events');
	eventsFilters.insertAdjacentHTML('beforeend', futureGameBtnTemplate);
	const field = document.querySelector(`.js__filter-${mod}-field`);
	field.addEventListener('click', toggleFutureGamesFilter);
}




function activeInitialFilter(mod) {
	document.querySelector(`.js__filter-${mod}-field`).click()
}


function addTodayGamesFilter() {
	const mod = 'today';
	const todayGames = document.querySelectorAll('.event--today').length;
	const todayGameBtnTemplate = getFilterBtnTemplate(mod)
		.replace('[*TEXT*]', filters.TODAY + ': <b>' + todayGames + '</b>');
	const eventsFilters = document.querySelector('.js__filter-events');
	eventsFilters.insertAdjacentHTML('beforeend', todayGameBtnTemplate);
	const field = document.querySelector(`.js__filter-${mod}-field`);
	field.addEventListener('click', toggleTodayGamesFilter);
}


function createFilters() {
	const filtersPanel = document.querySelector('.js__filters-panel');
	const filtersContainer = getFiltersContainersTemplate();
	filtersPanel.insertAdjacentHTML('beforeend', filtersContainer);
	addGameMasterFilter();
	addPlayersFilter();
	addAvailableGamesFilter();
	addPreviousGamesFilter();
	addFutureGamesFilter();
	addTodayGamesFilter();
	//activeInitialFilter('future');
}


export {
	createFilters,
};
