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

const VERSION = 'v3.1.6';
const DEFAULT_MAX_PLAYERS = 4;
const MONTH_SELECTOR_LABEL = 'Elige el mes';
const event = {
	AVAILABLE_GAME_SLOT: 'Plaza libre',
	ATTENDEE_LIST: 'Van a jugar'
}
const CANCELLED_GAME_STR = 'Cancelado';
const EMPTY_ATTENDEE = `<li class="event__attendee event__attendee--empty">${event.AVAILABLE_GAME_SLOT}</li>`;
const gms = {
	SINGULAR: 'Narrador/a',
	PLURAL: 'Narradores/as'
};
const progress = {
	CLUB: 'Club',
	PLAYERS: 'Jugadores',
	DIVIDER: '/',
	SLOTS: 'plazas'
};
const MONTHS = {
	"01": "Enero",
	"02": "Febrero",
	"03": "Marzo",
	"04": "Abril",
	"05": "Mayo",
	"06": "Junio",
	"07": "Julio",
	"08": "Agosto",
	"09": "Septiembre",
	"10": "Octubre",
	"11": "Noviembre",
	"12": "Diciembre",
};
const warning_msg = {
	DISCORD_ID: 'El ID de Disord no es correcto',
	TIME: 'Esta partida se juega en horario diferente al habitual de 22:00 a 24:00/1:00'
};
const filters = {
	GM_LABEL: 'Narrador/a:',
	GM_DEFAULT: 'Todes',
	PLAYER_LABEL: 'Jugador/a:',
	PLAYER_DEFAULT: 'Todes',
	AVAILABLE: 'Partidas con plazas',
	PREVIOUS: 'Partidas pasadas',
	FUTURE: 'Siguientes partidas',
	TODAY: 'Partidas de hoy',
};
const stats = {
	GAMES: 'Partidas',
	PLAYERS: 'Jugadores',
	GM: 'Narradores',
	CLUB_PLAYERS: '@Club',
	BAD_ID: 'Id incorrectos',
	PLUS_ONE: 'Invitados',
	CANCELLED: 'Canceladas',
};
const banner_states = {
	OK: '👍',
	KO: '🤬'
};


function anonData(condition) {
	if (condition) {
		const discordIds = [...document.querySelectorAll('.event__gms-item-name'),...document.querySelectorAll('.event__attendee'), ...document.querySelectorAll('.event__gms-item-discord-id')];
		discordIds.forEach(dId => {
			dId.textContent = dId.textContent
				.replace(/[A-Z0-9]/g, 'X')
				.replace(/[a-z]/g, 'x')
			;
		});
	}
}


function addAction(nodes, fn, type = 'click') {
	nodes.forEach(node => {
		node.addEventListener(type, fn);
		node.setAttribute('data-active',true)
	});
}


function formatStrDate(strDate) {
	return strDate.replace(/-/g, '/').replace('T', ' ');
}



function datesToHuman(str) {
	const [year, month] = str.split('-');
	return `${MONTHS[month]} de ${year}`;
}


function getMonthName(strDate) {
	const currentDate = new Date(strDate);
	const monthIndex = ('0' + (currentDate.getMonth() + 1)).slice(-2);
	return MONTHS[monthIndex];
}


function checkDiscordID(discordId) {
	const USER_REGEX = /[.·0-9A-Za-zÀ-ÿ_\ \()\-]{3,32}#[0-9]{4}/;
	if (discordId === CANCELLED_GAME_STR) return false;
	return !USER_REGEX.test(discordId);
}


function getGameDate(strDate, strEndDate) {
	const gameDate = new Date(formatStrDate(strDate));
	const gameEndDate = new Date(formatStrDate(strEndDate));
	const [day,month,year] = gameDate.toLocaleDateString('es-ES').split('/');
	return {
		dateObj: gameDate.toISOString(),
		date: {day, month, year},
		start: gameDate.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'}),
		end: gameEndDate.toLocaleTimeString('es-ES', {hour: '2-digit', minute: '2-digit'})
	}
}


function formatGMs(list, className) {
	const DIVIDER = ' (Discord: ';
	return list.map(gm => gm.name.replace('Discord ', 'Discord: '))
		.map(gm => {
			const [name, discord_id] = gm.replace(')', '').split(DIVIDER);
			return `<li class="${className}"><span class="${className}-name">${name}</span><span class="${className}-divider sr"> - </span><span class="${className}-discord-id">${discord_id}</span></li>`
		});
}


function getGMsLiteral(list) {
	return list.length === 1 ? gms.SINGULAR : gms.PLURAL;
}


function getTitleAndGameSystem(str) {
	const DOUBLE_BRACKET_DIVIDER = ') (';
	const SINGLE_BRACKET_DIVIDER = ' (';
	const hasBracket = str.includes('(');

	if (!hasBracket) return {
		str,
		title: str.replace(')', ''),
		system: undefined
	};

	const hasDoubleBracket = str.includes(DOUBLE_BRACKET_DIVIDER);
	const divider = hasDoubleBracket ? DOUBLE_BRACKET_DIVIDER : SINGLE_BRACKET_DIVIDER;

	const title = str.split(divider)[0] + (hasDoubleBracket ? ')':'');
	const system = str.split(title + ' ')[1].replace('(', '').replace(')', '');

	return {
		str,
		title,
		system
	};
}


function getDateStatus(strDate) {
	const DIFF_LIMIT = -3.5;
	const gameDate = new Date(strDate.replaceAll('-','/'));
	const now = new Date();
	const diff = (gameDate - now) / (60*60*1000);
	let isToday = '';
	let dateStatus = 'event--future';

	if (now.toDateString() === gameDate.toDateString()) {
		isToday = 'event--today ';
	}

	if (diff <= 0 && DIFF_LIMIT <= diff ) {
		dateStatus = 'event--in-progress';
	} else if (DIFF_LIMIT > diff)  {
		dateStatus = 'event--past';
	}
	return isToday + dateStatus;
}


function checkMemberStatus(discord_id, members) {
	 return members.includes(discord_id) ? 'event__attendee--is-member' : '';
}


function getTimeAlertStatus(strTime) {
	const hours = strTime.split(':')[0];

	return hours !== '22' ? 'event__date-time--alert' : '';
}


function getCancelledStatus(data) {
	return !!data.can_go.filter(player => player.name.toLowerCase() === CANCELLED_GAME_STR.toLowerCase()).length;
}

function getPercentage(val, total) {
	return val * 100 / total;
}

function getTotalGames(games) {
	return games.length;
}


function getUniquePlayers(games) {
	return [...new Set(games.map(gameObj => gameObj.attendees.can_go.map(cg => cg.name).filter(discord_id => !checkDiscordID(discord_id))).flat())].length;
}


function getUniqueGM(games) {
	return [...new Set(games.map(gameObj => gameObj.game.gms.map(gm => gm.name)).flat())].length;
}


function getUniqueClubPlayers(data) {
	const players = [...new Set(data.games.map(gameObj => gameObj.attendees.can_go.map(cg => cg.name)).flat())];
	return players.filter(player => data.members.includes(player)).length;
}


function getBadIds(games) {
	return [...new Set(games.map(gameObj => gameObj.attendees.can_go.map(cg => cg.name).filter(discord_id => checkDiscordID(discord_id))).flat())].length;
}


function getPlusOne(games) {
	let plusOnes = 0;
	games.forEach(game => {
		const list = game.attendees.can_go.map(player => player.name);
		const uniqueList = [...new Set(list)];
		const diff = list.length - uniqueList.length;
		if (diff) plusOnes += diff;
	});
	return plusOnes;
}




function getProgressData(data) {
	let total = 0;
	let players = 0;
	let clubPlayers = 0;

	for (const gameBlock of data.games) {
		total += parseInt(gameBlock.game.capacity);
		players += gameBlock.attendees.can_go.length;
		gameBlock.attendees.can_go.forEach(player => {
			if (data.members.includes(player.name)) clubPlayers++;
		});
	}

	return {
		total,
		players: {
			total: players,
			per: getPercentage(players, total),
		},
		clubPlayers: {
			total: clubPlayers,
			per: getPercentage(clubPlayers, total),
		},
	};
}

function getCancelledGames(games) {
	//const is  = getCancelledStatus();
	let cancelledGames = 0;

	games.forEach(({attendees}) => {
		if (getCancelledStatus(attendees)) cancelledGames++;
	})
	return cancelledGames;
}


function getStats(data) {
	return {
		games: getTotalGames(data.games),
		cancelled: getCancelledGames(data.games),
		gm: getUniqueGM(data.games),
		players: getUniquePlayers(data.games),
		club_players: getUniqueClubPlayers(data),
		plus_one: getPlusOne(data.games),
		bad_id: getBadIds(data.games),
	}
}


function toTheClipboard(event) {
	const textBlock = event.currentTarget
		.closest('.js__modal-social-block')
		.querySelector('.js__modal-social-text')
		.textContent.replaceAll('\t','');
	navigator.clipboard
		.writeText(textBlock)
		.then(
		() => {
			showBanner(banner_states.OK);
		},
		() => {
			showBanner(banner_states.KO);
		}
	);

}

function initSharer() {
	const socialButtons = document.querySelectorAll('.js__modal-social-button');
	addAction(socialButtons, toTheClipboard);
}

function getEventListToShare(data) {
	const {first_day} = data;
	const [year, month] = first_day.split('-').map(str => Number(str));

	const firstOfMonth = new Date(year, month - 1, 1);
	const lastOfMonth = new Date(year, month, 0);
	const weeks = Math.ceil((firstOfMonth.getDay() + lastOfMonth.getDate()) / 7);

	const week_first_days = [1];
	let currentDay = 1;
	const firstDayOfWeek = new Date(year, month - 1, currentDay).getDay();
	currentDay = currentDay + (7 - firstDayOfWeek + 1);

	for (let i = 0; i < weeks; i++) {
		if (currentDay <= lastOfMonth.getDate()) {
			week_first_days.push(currentDay);
			currentDay += 7;
		}
	}

	const result = [];
	for (let i = 0; i < week_first_days.length; i++) {
		result.push(getSocialBlockTemplate(i, week_first_days, lastOfMonth, data));
	}

	return result.join('');
}

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

function closeModal() {
	const body = document.querySelector('body');
	const visibleModal = body.querySelector('.modal--visible');
	const panel = visibleModal.querySelector('.js__modal-panel')

	panel.setAttribute('style', 'transform:translateY(calc(-100/16*1rem));opacity:0;')
	visibleModal.setAttribute('style', 'opacity:0;');
	setTimeout(() => {
		visibleModal.classList.remove('modal--visible');
		body.classList.remove('rl--has-modal');
		visibleModal.removeAttribute('style');
		panel.removeAttribute('style');
	}, 500);
}


function openModal(event) {
	const modalId = event.currentTarget.dataset.modal;
	openModalById(modalId);
}


function openModalById(modalId) {
	const body = document.querySelector('body');
	const modal = body.querySelector(`#${modalId}`);
	modal.classList.add('modal--visible');
	body.classList.add('rl--has-modal');
}


function initModals() {
	const body = document.querySelector('body');
	const modalTriggers = body.querySelectorAll('.js__trigger-modal:not([data-active])');
	const modalClosers = body.querySelectorAll('.js__modal-close:not([data-active])');

	addAction(modalClosers, closeModal);
	addAction(modalTriggers, openModal);
}

function createGames() {
	const gameData = document.querySelector('.js__game-data');
	const gameDataContainer = gameData.querySelector('.js__game-data-main')
	const eventsSectionTemplate = getEventsSectionTemplate(game_data);
	gameDataContainer.insertAdjacentHTML('beforeend', eventsSectionTemplate);
}


function createNavigation() {
	const gameData = document.querySelector('.js__game-data');
	const gameDataContainer = gameData.querySelector('.js__game-data-main')
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
	const gameData = document.querySelector('.js__game-data');
	const progressContainer = gameData.querySelector('.js__game-data-progress');
	const progressData = getProgressData(game_data);
	const progressBarTemplate = getProgressBarTemplate(progressData);
	progressContainer.insertAdjacentHTML('beforeend', progressBarTemplate);
}


function createStats() {
	const gameData = document.querySelector('.js__game-data');
	const statsContainer = gameData.querySelector('.js__game-data-stats');
	const stats = getStats(game_data);
	statsContainer.innerHTML = getStatsTemplate(stats);
}

function createSharer() {
	const gameData = document.querySelector('.js__game-data');
	const gameDataContainer = gameData.querySelector('.js__game-data-main')
	const shareSectionTemplate = getShareSectionTemplate(game_data);
	gameDataContainer.insertAdjacentHTML('beforeend', shareSectionTemplate);
	initModals();
	initSharer();
}

function getAttendeeList({can_go}, max, members) {
	const maxPlayers = parseInt(max) || DEFAULT_MAX_PLAYERS;
	const emptyPlayers = maxPlayers - can_go.length;
	const emptySlots = new Array(emptyPlayers).fill(EMPTY_ATTENDEE);
	const result = can_go.map(player => {
		const discordStatus = checkDiscordID(player.name) ? 'event__attendee--bad-discord-id' : '';
		const discordStatusWarning = discordStatus ? `title="${warning_msg.DISCORD_ID}"` : '';
		const memberStatus = checkMemberStatus(player.name, members);
		return `<li class="event__attendee ${memberStatus} ${discordStatus}" data-datetime="${player.date}" ${discordStatusWarning}>
			${player.name}
		</li>`;
	});
	return [...result, ...emptySlots];
}



function getEventsTemplate(games, members) {
	return games.map(({game, attendees}) => {
		const attendeeList = getAttendeeList(attendees, game.capacity, members);
		const emptyPlayers = parseInt(game.capacity) - attendees.can_go.length;
		const fullStatus = emptyPlayers > 0 ? 'event--available' : '';
		const dateStatus = getDateStatus(game.date);
		const canceledStatus = getCancelledStatus(attendees) ? 'event--is-cancelled' :  '';
		const headerContent = getTitleAndGameSystem(game.title);
		const gameSystem = headerContent.system ? `<p class="event__system">${headerContent.system}</p>` : '';
		const gameDate = getGameDate(game.date, game.end_date);
		const timeAlertStatus = getTimeAlertStatus(gameDate.start);
		const timeAlertStatusWarning = timeAlertStatus ? `title="${warning_msg.TIME}"` : '';
		return `<li class="events__item">
		<article class="event ${dateStatus} ${fullStatus} ${canceledStatus}">
			<header class="event__header">
				<a class="event__link" href="${game.link}" target="_blank">
					<h3 class="event__title">${headerContent.title}</h3>
				</a>
				${gameSystem}
				<time class="event__date" datetime="${gameDate.dateObj}">
					<span class="event__date-day">${gameDate.date.day}</span>/<span class="event__date-month">${gameDate.date.month}</span>/<span class="event__date-year">${gameDate.date.year}</span>
					<span class="event__date-time event__date-time-start ${timeAlertStatus}" ${timeAlertStatusWarning}>${gameDate.start}</span>
					<span class="event__date-time event__date-time-end">${gameDate.end}</span>
				</time>
				<div class="event__gm">
					<h4 class="event__gm-label">${getGMsLiteral(game.gms)}:</h4>
					<ul class="event__gm-items">
						${formatGMs(game.gms, 'event__gms-item')}
					</ul>
				</div>
			</header>
			<h4 class="event__attendee-title">${event.ATTENDEE_LIST}:</h4>
			<ul class="event__attendees">
				${attendeeList.join('')}
			</ul>
		</article>
	</li>`;
	});
}





function getNavTemplate(data) {
	const options = data.map(option => `<option value="${option.label}">${datesToHuman(option.label)}</option>`);
	return `<div class="game-data__nav js__game-data-nav">
		<div class="game-data__nav-filter js__nav-filter-history">
			<label for="filterHistory" class="game-data__nav-filter-label">${MONTH_SELECTOR_LABEL}:</label>
			<select name="filterHistory" id="filterHistory" class="game-data__nav-filter-select js__nav-filter-select">
				${options.join('')}
			</select>
		</div>
	</div>`;
}





function getEventsSectionTemplate(data) {
	const currentMonthName = getMonthName(data.first_day);
	const currentYear = new Date(data.first_day).getFullYear();
	const eventsList = getEventsTemplate(data.games, data.members);
	return `<div class="game-data__events events js__events">
		<h2 class="game-data__events-title">${currentMonthName} / ${currentYear}</h2>
		<div class="game-data__progress js__game-data-progress"></div>
		<div class="game-data__stats stats js__game-data-stats"></div>
		<div class="game-data__filters filters js__filters">
			<div class="filters__panel js__filters-panel"></div>
		</div>
		<ul class="events__items">
			${eventsList.join('')}
		</ul>
	</div>`;
}





function getProgressBarTemplate(data) {
	return `<div class="progress">
		<div class="progress__container">
			<div class="progress__total-slots">
				<span class="progress__total-slots-value">${data.total}</span>
				<span class="progress__total-slots-label"> ${progress.SLOTS}</span>
			</div>
			<div class="progress__bar">
				<div class="progress__bar-club" style="width: ${data.clubPlayers.per}%"></div>
				<div class="progress__bar-attendees" style="width: ${data.players.per}%"></div>
				<div class="progress__bar-track"></div>
			</div>
			<ol class="progress__legend">
				<li class="progress__legend-item progress__legend-item--club">
					<span class="progress__legend-label">${progress.CLUB}: </span>
					<span class="progress__legend-value">${data.clubPlayers.total}</span>
					<span class="progress__legend-divider"> ${progress.DIVIDER} </span>
					<span class="progress__legend-per">${data.clubPlayers.per.toFixed(1)}%</span>
				</li>
				<li class="progress__legend-item">
					<span class="progress__legend-label">${progress.PLAYERS}: </span>
					<span class="progress__legend-value">${data.players.total}</span>
					<span class="progress__legend-divider"> ${progress.DIVIDER} </span>
					<span class="progress__legend-per">${data.players.per.toFixed(1)}%</span>
				</li>
			</ol>
		</div>
	</div>`;
}





function getFiltersContainersTemplate() {
	return `<div class="filters__players js__filter-players"></div>
	<div class="filters__events js__filter-events"></div>`;
}




function getGameMasterList() {
	const gmList = [...document.querySelectorAll('.event__gms-item')]
		.map(item => {
			const [name, discord_id] = item.innerText.split('-');
			return {
				name: name.trim(),
				discord_id: discord_id.trim()
			}
		})
		.sort((a,b) => {
			if (a.discord_id.toLowerCase() > b.discord_id.toLowerCase()) return 1;
			if (a.discord_id.toLowerCase() < b.discord_id.toLowerCase()) return -1;
			return 0;
		});
	const optionList = gmList.map(item => {
			const games = gmList.filter(gm => gm.discord_id === item.discord_id).length;
			return `<option value="${item.discord_id}">(${games}) ${item.discord_id}</option>`;
		});

	return [...new Set(optionList)];
}

function getPlayerList() {
	const rawList = [...document.querySelectorAll('.event__attendee:not(.event__attendee--empty):not(.event__attendee--bad-discord-id)')]
		.map(item => item.innerText)
		.sort((a,b) => {
			if (a.toLowerCase() > b.toLowerCase()) return 1;
			if (a.toLowerCase() < b.toLowerCase()) return -1;
			return 0;
		});
	const optionList = rawList.map(item => {
		const games = rawList.filter(player => player === item).length;
		return `<option value="${item}">(${games}) ${item}</option>`;
	})
	return [...new Set(optionList)];
}


function getGameMasterTemplate() {
	const gameMasterList = getGameMasterList();
	return `<div class="filter filter--gm js__filter js__filter-gm">
		<label for="fGameMaster" class="filter__label">${filters.GM_LABEL}</label>
		<select class="filter__field filter__field--select js__filter-gm-field" name="fGameMaster" id="fGameMaster">
			<option value="">${filters.GM_DEFAULT} (${gameMasterList.length})</option>
			${gameMasterList.join('')}
		</select>
	</div>`;
}


function getPlayersTemplate() {
	const playerList = getPlayerList();
	return `<div class="filter filter--gm js__filter js__filter-player">
		<label for="fPlayerMaster" class="filter__label">${filters.PLAYER_LABEL}</label>
		<select class="filter__field filter__field--select js__filter-player-field" name="fPlayerMaster" id="fPlayerMaster">
			<option value="">${filters.PLAYER_DEFAULT} (${playerList.length})</option>
			${playerList.join('')}
		</select>
	</div>`;
}


function getStatsTemplate(data) {
	const dataList = [];
	for (const prop in data) {
		dataList.push(`<div class="stat">
			<span class="stat__value">${data[prop]}</span> <span class="stat__label">${stats[prop.toUpperCase()]}</span>
		</div>`);
	}
	return `${dataList.join('')}`;
}


function getFilterBtnTemplate(mod) {
	return `<div class="filter filter--${mod} js__filter js__filter-${mod}">
		<button class="filter__field filter__field--${mod} js__filter-${mod}-field">[*TEXT*]</button>
	</div>`;
}


function getShareButtonTemplate() {
	return `<button class="share__button js__share-button js__trigger-modal" data-modal="shareModal">Compartir en redes</button>`
}



function getShareModalTemplate(data) {
	return `<section id="shareModal" class="modal js__modal">
		<div class="modal__container">
			<div class="modal__panel js__modal-panel">
				<div class="modal__content">
					<header class="modal__header">
						<h2 class="modal__title"><span class="rl-logo">RL</span> Redes</h2>
						<button class="modal__close js__modal-close">Cerrar modal</button>
					</header>
					<div class="modal__main js__modal-main">
						<h3 class="modal__subtitle">Copiar textos para redes:</h3>
						<ul class="modal__social">
							${getEventListToShare(data)}
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="modal__overlay js__modal-close"></div>
	</section>`;
}


function getSocialBlockTemplate(i, week_first_days, lastOfMonth, data) {
	const weekFirstDay = week_first_days[i];
	const weekLastDay = (i === week_first_days.length - 1) ? lastOfMonth.getDate() : week_first_days[i+1] - 1;
	const title = weekFirstDay === weekLastDay ? `Semana del ${weekFirstDay}` : `Semana del ${weekFirstDay} al ${weekLastDay}`;
	const games = getSocialTemplate(weekFirstDay, weekLastDay, data);
	const isEmptyWeek = !!games.length;
	const emptyWeekClass = isEmptyWeek ? '' : 'modal__social-block--empty';
	const isDisabled = isEmptyWeek ? '' : 'disabled';
	let result = `<li class="modal__social-block js__modal-social-block ${emptyWeekClass}">
			<button class="button modal__social-button js__modal-social-button" ${isDisabled}><span class="modal__social-index">${i + 1}</span>: ${title}</button>
			<pre class="modal__social-text js__modal-social-text">
			${games.join('\n\n')}
			</pre>
		</li>`;

	if (i === week_first_days.length - 1) {
		const allGames = getSocialTemplate(1, weekLastDay, data);
		result += `<li class="modal__social-block modal__social-block--full js__modal-social-block">
			<button class="button modal__social-button js__modal-social-button">Mes completo</button>
			<pre class="modal__social-text js__modal-social-text">${allGames.join('\n\n')}</pre>
		</li>`;
	}

	return result;
}


function getSocialTemplate(weekFirstDay, weekLastDay, data) {
	const textMonth = MONTHS[data.first_day.split('-')[1]].toLowerCase();
	return data.games.filter(g => {
		const day = Number(g.game.date.split(' ')[0].split('-')[2]);
		return day >= weekFirstDay && day <= weekLastDay;
	})
		.map(g => {

			const [,,day] = g.game.date.split(' ')[0].replaceAll('-','/').split('/');
			const startTime = g.game.date.split(' ')[1].substring(8 - 3,0);
			const endTime = g.game.end_date.split(' ')[1].substring(8 - 3,0);
			const {capacity} = g.game;
			const attendees = g.attendees.can_go.filter(Boolean).length
			const isComplete = attendees === Number(capacity)
			return `#Resludi

Esta semana en Resistencia Lúdica: ${g.game.title}

🗓 ${Number(day)} ${textMonth}
🕙 ${startTime} - ${endTime}
${isComplete ? '🔥 ¡Partida completa!' : '⭐ ¡Participa!'}
✅ Enlace: ${g.game.link}
	`;
		});
}


function getShareBannerTemplate() {
	return `<div class="banner js__banner">
		<div class="banner__item js__banner-item"></div>
	</div>`;
}


function getShareSectionTemplate(data) {
	const shareButtonTemplate = getShareButtonTemplate();
	const shareModalTemplate = getShareModalTemplate(data);
	const shareBannerTemplate = getShareBannerTemplate();
	return `<section class="game-data__share share js__share">
		${shareButtonTemplate}
		${shareModalTemplate}
		${shareBannerTemplate}
	</section>`;
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

jQuery( document ).ready(function() {
	createUI(VERSION);
});
