import {getSocialBlockTemplate} from "./templates.js";
import {addAction} from "./helpers.js";
import {showBanner} from "./banner.js";
import {banner_states} from "./constants.js";

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


export {
	initSharer,
	getEventListToShare,
}
