import { MONTHS, gms } from "./constants.js";


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

function checkMemberStatus(attendee) {
	return isMember(attendee) ? 'event__attendee--is-member' : '';
}

function isMember(attendee) {
	return attendee.member
}

function getTimeAlertStatus(strTime) {
	const hours = strTime.split(':')[0];

	return hours !== '22' ? 'event__date-time--alert' : '';
}

function getCancelledStatus(game) {
	return game.cancelled;
}

export {
	checkMemberStatus,
	datesToHuman,
	formatGMs,
	getDateStatus,
	getGMsLiteral,
	getGameDate,
	getMonthName,
	getTimeAlertStatus,
	getCancelledStatus,
	addAction,
	anonData,
	isMember
};
