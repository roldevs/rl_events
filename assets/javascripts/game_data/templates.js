import {
	checkDiscordID,
	checkMemberStatus,
	datesToHuman,
	formatGMs,
	getDateStatus,
	getCancelledStatus,
	getGMsLiteral,
	getGameDate,
	getMonthName,
	getTimeAlertStatus,
	getTitleAndGameSystem,
} from "./helpers.js";
import {
	DEFAULT_MAX_PLAYERS,
	EMPTY_ATTENDEE,
	MONTH_SELECTOR_LABEL,
	event,
	progress,
	warning_msg,
	filters,
	stats,
	MONTHS,
} from "./constants.js";
import {getEventListToShare} from "./share.js";






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



export {
	getEventsSectionTemplate,
	getNavTemplate,
	getProgressBarTemplate,
	getFiltersContainersTemplate,
	getGameMasterTemplate,
	getPlayersTemplate,
	getStatsTemplate,
	getFilterBtnTemplate,
	getShareSectionTemplate,
	getSocialBlockTemplate,
}
