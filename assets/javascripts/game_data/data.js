import {isMember} from "./helpers.js";

function getPercentage(val, total) {
	return val * 100 / total;
}

function getTotalGames(games) {
	return games.length;
}

function _getPlayers(games, filterFn) {
	return games.reduce((acc, game) => {
		game.attendees.can_go.filter(filterFn).map(player => player.name).forEach(discordId => {
			if (!acc.includes(discordId)) acc.push(discordId);
		});
		return acc;
	}, []);
}

function getUniquePlayers(games) {
	return _getPlayers(games, () => true).length;
}

function getUniqueGM(games) {
	return [...new Set(games.map(gameObj => gameObj.game.gms.map(gm => gm.name)).flat())].length;
}

function getUniqueClubPlayers(games) {
	return _getPlayers(games, isMember).length;
}

function getPlusOne(games) {
	return _getPlayers(games, (attendee) => !isMember(attendee)).length;
}

function getCancelledGames(games) {
	//const is  = getCancelledStatus();
	let cancelledGames = 0;

	games.forEach(({game}) => {
		if (game.cancelled) cancelledGames++;
	})
	return cancelledGames;
}

export {
};
