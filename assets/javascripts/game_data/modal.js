import {addAction} from "./helpers.js";


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


export {
	initModals,
}
