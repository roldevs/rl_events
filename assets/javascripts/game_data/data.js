import {checkDiscordID, getCancelledStatus} from "./helpers.js";

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
	return players.filter(player => data.members.includes(player.toLowerCase())).length;
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
			if (data.members.includes(player.name.toLowerCase())) clubPlayers++;
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



export {
	getProgressData,
	getStats,
};
