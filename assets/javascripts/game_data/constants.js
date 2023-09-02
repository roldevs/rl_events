const VERSION = 'v3.1.7';
const DEFAULT_MAX_PLAYERS = 4;
const MONTH_SELECTOR_LABEL = 'Elige el mes';
const event = {
	AVAILABLE_GAME_SLOT: 'Plaza libre',
	ATTENDEE_LIST: 'Van a jugar'
}
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


export {
	DEFAULT_MAX_PLAYERS,
	EMPTY_ATTENDEE,
	MONTHS,
	MONTH_SELECTOR_LABEL,
	VERSION,
	event,
	gms,
	progress,
	warning_msg,
	filters,
	stats,
	banner_states,
}
